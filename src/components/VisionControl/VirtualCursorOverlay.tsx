import React from 'react';

interface VirtualCursorOverlayProps {
  cursorPos: { x: number; y: number } | null;
  isPinching: boolean;
  gestureName: string;
}

export const VirtualCursorOverlay: React.FC<VirtualCursorOverlayProps> = ({
  cursorPos,
  isPinching,
  gestureName,
}) => {
  if (!cursorPos) return null;

  return (
    <div
      className="fixed z-[9999] pointer-events-none transition-transform duration-75 ease-out"
      style={{
        left: `${cursorPos.x}px`,
        top: `${cursorPos.y}px`,
        transform: `translate(-50%, -50%) scale(${isPinching ? 0.75 : 1.0})`,
      }}
    >
      {/* Outer Pulsing Ring */}
      <div
        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
          isPinching
            ? 'border-primary bg-primary/30 shadow-[0_0_20px_rgba(255,107,74,0.8)]'
            : 'border-primary/80 bg-background/30 backdrop-blur-sm shadow-[0_0_12px_rgba(255,107,74,0.4)]'
        }`}
      >
        {/* Core Dot */}
        <div
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            isPinching ? 'bg-primary scale-125' : 'bg-primary/90'
          }`}
        />
      </div>

      {/* Floating Gesture Label Badge */}
      <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/90 backdrop-blur-md border border-border/80 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-foreground shadow-lg flex items-center gap-1">
        <span>{gestureName}</span>
      </div>
    </div>
  );
};

export default VirtualCursorOverlay;
