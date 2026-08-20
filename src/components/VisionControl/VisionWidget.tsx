import React, { useState } from 'react';
import { CameraOff, Sparkles, HelpCircle, X, Loader2, Hand, Video } from 'lucide-react';
import { useVisionGesture } from '@/hooks/useVisionGesture';
import VirtualCursorOverlay from './VirtualCursorOverlay';
import { Button } from '@/components/ui/button';

export const VisionWidget: React.FC = () => {
  const {
    isActive,
    isModelLoading,
    modelError,
    currentGesture,
    cursorPos,
    isPinching,
    toggleCamera,
    videoRef,
    canvasRef,
  } = useVisionGesture();

  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      {/* On-Screen Virtual Cursor Overlay */}
      <VirtualCursorOverlay
        cursorPos={cursorPos}
        isPinching={isPinching}
        gestureName={currentGesture}
      />

      {/* Floating Control Hub Box */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Help Guide Popover */}
        {showHelp && (
          <div className="bg-background/95 backdrop-blur-xl border border-border/90 p-4 rounded-2xl shadow-2xl max-w-xs w-72 space-y-3 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Vision Controls
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 hover:bg-muted/80 rounded-md text-muted-foreground transition-colors"
                aria-label="Close Help"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-foreground/80 leading-relaxed font-medium">
              <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border/60">
                <span className="text-base">👆</span>
                <div>
                  <p className="font-bold text-foreground">Move Hand Up / Down</p>
                  <p className="text-[11px] text-muted-foreground">Smoothly scroll page up &amp; down</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border/60">
                <span className="text-base">🤏</span>
                <div>
                  <p className="font-bold text-foreground">Pinch (Thumb + Index)</p>
                  <p className="text-[11px] text-muted-foreground">Virtual click buttons &amp; links</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border/60">
                <span className="text-base">✌️</span>
                <div>
                  <p className="font-bold text-foreground">V-Sign / Victory</p>
                  <p className="text-[11px] text-muted-foreground">Jump to next portfolio section</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-muted-foreground text-center opacity-70">
              🔒 100% Local WASM processing — No video leaves your browser.
            </p>
          </div>
        )}

        {/* Live Camera Video Review Box when Active */}
        {isActive && (
          <div className="relative bg-background/95 backdrop-blur-xl border border-border/90 p-2.5 rounded-2xl shadow-2xl w-56 sm:w-64 space-y-2.5 overflow-hidden transition-all duration-300">
            {/* Header Status Bar */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-primary">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Camera Review
              </div>
              <button
                onClick={toggleCamera}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
                title="Stop Camera"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hidden Video Feed element */}
            <video
              ref={videoRef}
              className="hidden"
              playsInline
              muted
              autoPlay
            />

            {/* Canvas displaying live webcam feed + MediaPipe skeleton */}
            <div className="relative w-full h-36 sm:h-40 bg-black/90 rounded-xl overflow-hidden border border-border/60 flex items-center justify-center shadow-inner">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
              />

              {/* Status Badge Tag Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-center text-foreground truncate border border-border/50 shadow-md">
                {currentGesture}
              </div>
            </div>
          </div>
        )}

        {/* Error Badge */}
        {modelError && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-xs p-2.5 rounded-xl max-w-xs text-center">
            {modelError}
          </div>
        )}

        {/* Main Action Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp((prev) => !prev)}
            className="p-3 bg-background/90 backdrop-blur-md border border-border/90 hover:border-primary text-foreground rounded-2xl shadow-lg transition-all hover:scale-105"
            aria-label="Gesture Control Guide"
            title="Gesture Guide"
          >
            <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </button>

          <Button
            onClick={toggleCamera}
            variant={isActive ? 'default' : 'outline'}
            size="lg"
            disabled={isModelLoading}
            className={`gap-2 rounded-2xl shadow-xl transition-all duration-300 font-semibold text-xs sm:text-sm px-4 py-3 ${
              isActive
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/25'
                : 'bg-background/90 backdrop-blur-md border-border/90 hover:border-primary text-foreground'
            }`}
          >
            {isModelLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Loading Vision AI...</span>
              </>
            ) : isActive ? (
              <>
                <CameraOff className="w-4 h-4" />
                <span>Stop Live Feed</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4 text-primary animate-pulse" />
                <span className="hidden sm:inline">Live Camera Gestures</span>
                <span className="sm:hidden">Camera Feed</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default VisionWidget;
