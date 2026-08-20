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

      {/* Floating Vision Control Hub Box - Positioned in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
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

        {/* Vision Card Container — Replaces the background video grid card */}
        <div className="bg-background/95 backdrop-blur-xl border border-border/90 p-3 rounded-2xl shadow-2xl w-56 sm:w-64 space-y-3 overflow-hidden transition-all duration-300">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-primary/60'}`} />
              {isActive ? 'Live Camera Feed' : 'AI Vision Control'}
            </div>
            <button
              onClick={() => setShowHelp((prev) => !prev)}
              className="p-1 text-muted-foreground hover:text-primary transition-colors"
              title="Help &amp; Gestures"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Hidden Video element for MediaPipe */}
          <video
            ref={videoRef}
            className="hidden"
            playsInline
            muted
            autoPlay
          />

          {/* Live Preview or Placeholder Card */}
          <div className="relative w-full h-36 sm:h-40 bg-card rounded-xl overflow-hidden border border-border/70 flex flex-col items-center justify-center text-center p-3 shadow-inner">
            {isActive ? (
              <>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-mono font-bold text-center text-foreground truncate border border-border/50 shadow-md">
                  {currentGesture}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                  <Hand className="w-5 h-5 animate-pulse" />
                </div>
                <p className="text-xs font-bold text-foreground">Hand Gesture Navigation</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Control scrolling &amp; click buttons using mid-air hand gestures.
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {modelError && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-[11px] p-2 rounded-lg text-center">
              {modelError}
            </div>
          )}

          {/* Enable / Disable Button */}
          <Button
            onClick={toggleCamera}
            variant={isActive ? 'destructive' : 'hero'}
            size="sm"
            disabled={isModelLoading}
            className="w-full gap-2 text-xs font-semibold py-2 shadow-md"
          >
            {isModelLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading Vision AI...</span>
              </>
            ) : isActive ? (
              <>
                <CameraOff className="w-3.5 h-3.5" />
                <span>Stop Live Feed</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5" />
                <span>Start Live Camera</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default VisionWidget;
