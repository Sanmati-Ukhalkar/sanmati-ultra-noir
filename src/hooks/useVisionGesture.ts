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
  const lastScrollTimeRef = useRef<number>(0);
  const lastHandYRef = useRef<number | null>(null);

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

  // Frame processing loop
  const processFrame = useCallback(() => {
    if (!videoRef.current || !gestureRecognizerRef.current || !isActive) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const nowInMs = Date.now();
    try {
      const results = gestureRecognizerRef.current.recognizeForVideo(video, nowInMs);

      // Render live mirrored camera video feed + hand landmarks on canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 240;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw mirrored live webcam video background
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Draw AI Hand Skeleton on top of live video
          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            ctx.fillStyle = '#FF6B4A';
            ctx.strokeStyle = 'rgba(255, 107, 74, 0.9)';
            ctx.lineWidth = 3;

            // Draw connecting bones
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

            // Draw joint nodes with glowing rings
            landmarks.forEach((lm) => {
              const x = (1 - lm.x) * canvas.width;
              const y = lm.y * canvas.height;
              
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, Math.PI * 2);
              ctx.fillStyle = '#FF6B4A';
              ctx.fill();

              ctx.beginPath();
              ctx.arc(x, y, 8, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 107, 74, 0.3)';
              ctx.fill();
            });
          }
        }
      }

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        const indexTip = landmarks[8]; // Index finger tip
        const thumbTip = landmarks[4]; // Thumb tip
        const wrist = landmarks[0];

        // Mirror X coordinate for intuitive camera control
        const screenX = (1 - indexTip.x) * window.innerWidth;
        const screenY = indexTip.y * window.innerHeight;
        setCursorPos({ x: screenX, y: screenY });

        // Calculate pinch distance (Thumb & Index)
        const dx = (thumbTip.x - indexTip.x) * window.innerWidth;
        const dy = (thumbTip.y - indexTip.y) * window.innerHeight;
        const pinchDistance = Math.hypot(dx, dy);
        const pinching = pinchDistance < 50;
        setIsPinching(pinching);

        // Detect gesture category from model
        let gestureName = 'Hand Detected';
        if (results.gestures && results.gestures.length > 0 && results.gestures[0].length > 0) {
          gestureName = results.gestures[0][0].categoryName;
        }

        // Custom Gesture Logic
        if (pinching) {
          gestureName = 'Pinch / Click 🤏';
          // Trigger virtual click at cursor position if pinched
          if (nowInMs - lastScrollTimeRef.current > 400) {
            const el = document.elementFromPoint(screenX, screenY) as HTMLElement | null;
            if (el) {
              el.click();
              lastScrollTimeRef.current = nowInMs;
            }
          }
        } else if (gestureName === 'Victory' || gestureName === 'Thumb_Up') {
          gestureName = 'Jump Section ✌️';
          if (nowInMs - lastScrollTimeRef.current > 1200) {
            window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
            lastScrollTimeRef.current = nowInMs;
          }
        } else {
          // Hand Y movement based smooth scroll
          const currentHandY = wrist.y;
          if (lastHandYRef.current !== null) {
            const deltaY = currentHandY - lastHandYRef.current;
            if (Math.abs(deltaY) > 0.025) {
              if (deltaY > 0.025) {
                gestureName = 'Scroll Down 👇';
                window.scrollBy({ top: 90, behavior: 'smooth' });
              } else if (deltaY < -0.025) {
                gestureName = 'Scroll Up 👆';
                window.scrollBy({ top: -90, behavior: 'smooth' });
              }
            }
          }
          lastHandYRef.current = currentHandY;
        }

        setCurrentGesture(gestureName);
      } else {
        setCurrentGesture('Searching Hand...');
        setCursorPos(null);
        setIsPinching(false);
        lastHandYRef.current = null;
      }
    } catch (err) {
      console.warn('Frame processing glitch:', err);
    }

    animationFrameIdRef.current = requestAnimationFrame(processFrame);
  }, [isActive]);

  // Start/Stop Camera
  const toggleCamera = useCallback(async () => {
    if (isActive) {
      // Stop Camera Stream
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
      // Start Camera Stream & Load Model
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

  // Trigger processing loop when camera becomes active
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

  // Clean up stream on unmount
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
