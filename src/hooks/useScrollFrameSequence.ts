import { useState, useEffect, useRef, useCallback } from 'react';

// Global memory registry to track active sequences and enforce site-wide RAM cap
class SequenceMemoryManager {
  private activeSequenceId: string | null = 'hero';
  private subscribers: Map<string, (activeId: string | null) => void> = new Map();

  register(id: string, callback: (activeId: string | null) => void) {
    this.subscribers.set(id, callback);
  }

  unregister(id: string) {
    this.subscribers.delete(id);
  }

  setActive(id: string) {
    if (this.activeSequenceId === id) return;
    this.activeSequenceId = id;
    this.subscribers.forEach((cb) => cb(this.activeSequenceId));
  }

  getActive() {
    return this.activeSequenceId;
  }
}

export const globalSequenceMemory = new SequenceMemoryManager();

interface UseScrollFrameSequenceOptions {
  sequenceId: string;
  totalFrames: number;
  getFrameUrl: (index: number) => string;
  windowSize?: number; // Number of frames to keep loaded around current frame
  priorityCount?: number; // First N frames to preload
  autoStart?: 'immediate' | 'on-enter-viewport';
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function useScrollFrameSequence({
  sequenceId,
  totalFrames,
  getFrameUrl,
  windowSize = 25,
  priorityCount = 10,
  autoStart = 'immediate',
  containerRef,
}: UseScrollFrameSequenceOptions) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const loadedFramesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingStatusRef = useRef<Map<number, 'loading' | 'loaded' | 'error'>>(new Map());
  const [isPriorityReady, setIsPriorityReady] = useState(false);
  const [isViewportActive, setIsViewportActive] = useState(autoStart === 'immediate');

  // IntersectionObserver for lazy loading on-enter-viewport
  useEffect(() => {
    if (autoStart === 'immediate') {
      setIsViewportActive(true);
      return;
    }

    const container = containerRef?.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsViewportActive(true);
          globalSequenceMemory.setActive(sequenceId);
        }
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [autoStart, containerRef, sequenceId]);

  // Subscribe to memory eviction notifications
  useEffect(() => {
    const handleMemoryEviction = (activeId: string | null) => {
      // If another non-hero sequence is active, evict our held RAM window down to single frame 0
      if (activeId && activeId !== sequenceId && sequenceId !== 'hero') {
        loadedFramesRef.current.forEach((_, key) => {
          if (key !== 0 && key !== currentFrameIndex) {
            loadedFramesRef.current.delete(key);
            loadingStatusRef.current.delete(key);
          }
        });
      }
    };

    globalSequenceMemory.register(sequenceId, handleMemoryEviction);
    return () => globalSequenceMemory.unregister(sequenceId);
  }, [sequenceId, currentFrameIndex]);

  // Load single frame
  const loadFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    if (index < 0 || index >= totalFrames) return Promise.resolve(null);

    if (loadedFramesRef.current.has(index)) {
      return Promise.resolve(loadedFramesRef.current.get(index)!);
    }

    if (loadingStatusRef.current.get(index) === 'loading') {
      return Promise.resolve(null);
    }

    loadingStatusRef.current.set(index, 'loading');

    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFrameUrl(index);
      img.onload = () => {
        loadedFramesRef.current.set(index, img);
        loadingStatusRef.current.set(index, 'loaded');
        resolve(img);
      };
      img.onerror = () => {
        loadingStatusRef.current.set(index, 'error');
        resolve(null);
      };
    });
  }, [totalFrames, getFrameUrl]);

  // Preload priority frames once viewport is active
  useEffect(() => {
    if (!isViewportActive) return;
    let isCancelled = false;

    const loadPriority = async () => {
      const promises: Promise<HTMLImageElement | null>[] = [];
      for (let i = 0; i < Math.min(priorityCount, totalFrames); i++) {
        promises.push(loadFrame(i));
      }
      await Promise.all(promises);
      if (!isCancelled) {
        setIsPriorityReady(true);
      }
    };

    loadPriority();

    return () => {
      isCancelled = true;
    };
  }, [isViewportActive, priorityCount, totalFrames, loadFrame]);

  // Sliding window memory management
  useEffect(() => {
    if (!isViewportActive) return;

    const halfWindow = Math.floor(windowSize / 2);
    const minIndex = Math.max(0, currentFrameIndex - halfWindow);
    const maxIndex = Math.min(totalFrames - 1, currentFrameIndex + halfWindow);

    for (let i = minIndex; i <= maxIndex; i++) {
      if (!loadedFramesRef.current.has(i) && loadingStatusRef.current.get(i) !== 'loading') {
        loadFrame(i);
      }
    }

    // Evict distant frames to enforce RAM budget
    loadedFramesRef.current.forEach((_, frameIdx) => {
      if (frameIdx < minIndex - 10 || frameIdx > maxIndex + 10) {
        loadedFramesRef.current.delete(frameIdx);
        loadingStatusRef.current.delete(frameIdx);
      }
    });
  }, [isViewportActive, currentFrameIndex, totalFrames, windowSize, loadFrame]);

  const getCurrentImage = useCallback((): HTMLImageElement | null => {
    if (loadedFramesRef.current.has(currentFrameIndex)) {
      return loadedFramesRef.current.get(currentFrameIndex)!;
    }
    let nearestFrame = -1;
    let minDistance = Infinity;
    loadedFramesRef.current.forEach((_, frameIdx) => {
      const distance = Math.abs(frameIdx - currentFrameIndex);
      if (distance < minDistance) {
        minDistance = distance;
        nearestFrame = frameIdx;
      }
    });
    if (nearestFrame !== -1) {
      return loadedFramesRef.current.get(nearestFrame)!;
    }
    return null;
  }, [currentFrameIndex]);

  return {
    currentFrameIndex,
    setCurrentFrameIndex,
    getCurrentImage,
    isPriorityReady,
    isViewportActive,
    loadedCount: loadedFramesRef.current.size,
  };
}
