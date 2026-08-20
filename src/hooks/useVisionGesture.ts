import { useState, useEffect, useRef, useCallback } from 'react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';

export interface VisionGestureState {
  isActive: boolean;
  isModelLoading: boolean;
  modelError: string | null;
  currentGesture: string;
  cursorPos: { x: number; y: number } | null;
  isPinching: boolean;
  toggleCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function useVisionGesture(): VisionGestureState {
  const [isActive, setIsActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [currentGesture, setCurrentGesture] = useState<string>('None');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isPinching, setIsPinching] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastPinchTimeRef = useRef<number>(0);
  const prevHandYRef = useRef<number | null>(null);
  const smoothCursorRef = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Initialize GestureRecognizer model
  const initModel = useCallback(async () => {
    if (gestureRecognizerRef.current) return gestureRecognizerRef.current;

    setIsModelLoading(true);
    setModelError(null);

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
      );
      
      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });

      gestureRecognizerRef.current = recognizer;
      setIsModelLoading(false);
      return recognizer;
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to load MediaPipe GestureRecognizer:', error);
      setModelError(error.message || 'Failed to load Vision AI model');
      setIsModelLoading(false);
      return null;
    }
  }, []);

  // 60fps Frame processing loop
  const processFrame = useCallback(() => {
    if (!videoRef.current || !gestureRecognizerRef.current || !isActive) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const nowMs = performance.now();
    try {
      const results = gestureRecognizerRef.current.recognizeForVideo(video, nowMs);

      // Render live webcam feed + AI skeleton on canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 240;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw mirrored live camera feed
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Draw MediaPipe Skeleton overlay
          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            ctx.fillStyle = '#FF6B4A';
            ctx.strokeStyle = 'rgba(255, 107, 74, 0.9)';
            ctx.lineWidth = 3;

            const connections = [
              [0,1],[1,2],[2,3],[3,4], // Thumb
              [0,5],[5,6],[6,7],[7,8], // Index
              [5,9],[9,10],[10,11],[11,12], // Middle
              [9,13],[13,14],[14,15],[15,16], // Ring
              [13,17],[17,18],[18,19],[19,20],[0,17] // Pinky
            ];

            connections.forEach(([i, j]) => {
              const p1 = landmarks[i];
              const p2 = landmarks[j];
              if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo((1 - p1.x) * canvas.width, p1.y * canvas.height);
                ctx.lineTo((1 - p2.x) * canvas.width, p2.y * canvas.height);
                ctx.stroke();
              }
            });

            landmarks.forEach((lm) => {
              const x = (1 - lm.x) * canvas.width;
              const y = lm.y * canvas.height;
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, Math.PI * 2);
              ctx.fillStyle = '#FF6B4A';
              ctx.fill();
            });
          }
        }
      }

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];

        // Target screen coordinates (mirrored X)
        const targetX = (1 - indexTip.x) * window.innerWidth;
        const targetY = indexTip.y * window.innerHeight;

        // Smooth cursor interpolation (lerp factor = 0.35)
        smoothCursorRef.current.x += (targetX - smoothCursorRef.current.x) * 0.35;
        smoothCursorRef.current.y += (targetY - smoothCursorRef.current.y) * 0.35;
        setCursorPos({ x: smoothCursorRef.current.x, y: smoothCursorRef.current.y });

        // Calculate normalized pinch distance (Thumb & Index)
        const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
        const pinching = pinchDist < 0.075;
        setIsPinching(pinching);

        let detectedName = 'Hand Tracked';
        if (results.gestures && results.gestures.length > 0 && results.gestures[0].length > 0) {
          detectedName = results.gestures[0][0].categoryName;
        }

        // Gesture Action Dispatcher
        if (pinching) {
          detectedName = 'Pinch / Click 🤏';
          if (nowMs - lastPinchTimeRef.current > 450) {
            const el = document.elementFromPoint(smoothCursorRef.current.x, smoothCursorRef.current.y) as HTMLElement | null;
            if (el) {
              el.click();
              lastPinchTimeRef.current = nowMs;
            }
          }
        } else if (detectedName === 'Victory' || detectedName === 'Thumb_Up') {
          detectedName = 'Jump Section ✌️';
          if (nowMs - lastPinchTimeRef.current > 1000) {
            window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
            lastPinchTimeRef.current = nowMs;
          }
        } else {
          // Hand Y velocity continuous scrolling
          const currentY = indexTip.y;
          if (prevHandYRef.current !== null) {
            const diffY = currentY - prevHandYRef.current;
            if (Math.abs(diffY) > 0.015) {
              const scrollStep = Math.min(120, Math.max(-120, diffY * 2200));
              window.scrollBy(0, scrollStep);
              detectedName = diffY > 0 ? 'Scroll Down 👇' : 'Scroll Up 👆';
            }
          }
          prevHandYRef.current = currentY;
        }

        setCurrentGesture(detectedName);
      } else {
        setCurrentGesture('Searching Hand...');
        setCursorPos(null);
        setIsPinching(false);
        prevHandYRef.current = null;
      }
    } catch (err) {
      console.warn('Frame processing glitch:', err);
    }

    animationFrameIdRef.current = requestAnimationFrame(processFrame);
  }, [isActive]);

  // Start/Stop Camera Stream
  const toggleCamera = useCallback(async () => {
    if (isActive) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsActive(false);
      setCursorPos(null);
      setCurrentGesture('None');
    } else {
      const recognizer = await initModel();
      if (!recognizer) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: { ideal: 30 } },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsActive(true);
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error('Camera access denied or unavailable:', error);
        setModelError('Camera access denied. Please allow webcam permissions.');
      }
    }
  }, [isActive, initModel]);

  useEffect(() => {
    if (isActive) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isActive, processFrame]);

  useEffect(() => {
    const videoEl = videoRef.current;
    return () => {
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isActive,
    isModelLoading,
    modelError,
    currentGesture,
    cursorPos,
    isPinching,
    toggleCamera,
    videoRef,
    canvasRef,
  };
}
