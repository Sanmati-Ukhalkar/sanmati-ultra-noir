import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Database, Cpu, Zap, Server, Activity, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useScrollFrameSequence } from '@/hooks/useScrollFrameSequence';

interface PipelineStep {
  id: string;
  name: string;
  sub: string;
  icon: React.ElementType;
  tech: string;
  status: 'idle' | 'processing' | 'completed';
}

const TOTAL_PIPELINE_FRAMES = 30;

const getPipelineFrameUrl = (index: number) => {
  const paddedIndex = String(index).padStart(3, '0');
  return `/assets/pipeline-sequence/frame_${paddedIndex}.webp`;
};

const PipelineWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [throughput, setThroughput] = useState(1250);
  const [latency, setLatency] = useState(14.2);
  const [accuracy, setAccuracy] = useState(92.4);

  const pathRef = useRef<SVGPathElement>(null);
  const packetRef = useRef<SVGCircleElement>(null);

  const {
    currentFrameIndex,
    setCurrentFrameIndex,
    getCurrentImage,
    isPriorityReady,
  } = useScrollFrameSequence({
    sequenceId: 'pipeline',
    totalFrames: TOTAL_PIPELINE_FRAMES,
    getFrameUrl: getPipelineFrameUrl,
    windowSize: 15,
    priorityCount: 5,
    autoStart: 'on-enter-viewport',
    containerRef,
  });

  const renderPipelineCanvasFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const dw = canvas.clientWidth;
    const dh = canvas.clientHeight;

    if (canvas.width !== Math.round(dw * dpr) || canvas.height !== Math.round(dh * dpr)) {
      canvas.width = Math.round(dw * dpr);
      canvas.height = Math.round(dh * dpr);
      ctx.scale(dpr, dpr);
    }

    const img = getCurrentImage();
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, dw, dh);
      ctx.drawImage(img, 0, 0, dw, dh);
    }
  }, [getCurrentImage]);

  useEffect(() => {
    renderPipelineCanvasFrame();
  }, [currentFrameIndex, isPriorityReady, renderPipelineCanvasFrame]);

  const steps: PipelineStep[] = [
    { id: 'ingest', name: 'Raw Ingestion', sub: 'SQL & Event Stream', icon: Database, tech: 'PostgreSQL / Kafka', status: activeStepIndex > 0 ? 'completed' : activeStepIndex === 0 ? 'processing' : 'idle' },
    { id: 'transform', name: 'Feature ETL', sub: 'Cleaning & Encoding', icon: Cpu, tech: 'Pandas / NumPy', status: activeStepIndex > 1 ? 'completed' : activeStepIndex === 1 ? 'processing' : 'idle' },
    { id: 'model', name: 'ML Inference', sub: 'Churn Classifier', icon: Zap, tech: 'PyTorch / Scikit-Learn', status: activeStepIndex > 2 ? 'completed' : activeStepIndex === 2 ? 'processing' : 'idle' },
    { id: 'serve', name: 'API Response', sub: '14ms REST Payload', icon: Server, tech: 'FastAPI / Docker', status: activeStepIndex >= 3 ? 'completed' : activeStepIndex === 3 ? 'processing' : 'idle' }
  ];

  const animateCountUp = (
    startVal: number,
    endVal: number,
    durationMs: number,
    onUpdate: (val: number) => void
  ) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onUpdate(endVal);
      return;
    }

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = startVal + (endVal - startVal) * eased;
      onUpdate(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const handleRunPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStepIndex(0);

    const path = pathRef.current;
    const packet = packetRef.current;
    if (!path || !packet) return;

    const pathLength = path.getTotalLength();
    gsap.set(packet, { opacity: 1 });

    const targetThroughput = Math.floor(1250 + Math.random() * 150 - 75);
    const targetLatency = +(14.2 + (Math.random() * 0.8 - 0.4)).toFixed(1);
    const targetAccuracy = +(92.4 + (Math.random() * 0.4 - 0.2)).toFixed(1);

    // Playback canvas sequence alongside GSAP path timeline
    const frameObj = { f: 0 };
    gsap.to(frameObj, {
      f: TOTAL_PIPELINE_FRAMES - 1,
      duration: 3,
      ease: 'power1.inOut',
      onUpdate: () => {
        setCurrentFrameIndex(Math.floor(frameObj.f));
      }
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRunning(false);
        setActiveStepIndex(3);
        animateCountUp(0, targetThroughput, 1000, (v) => setThroughput(Math.floor(v)));
        animateCountUp(0, targetLatency, 1000, (v) => setLatency(+v.toFixed(1)));
        animateCountUp(0, targetAccuracy, 1000, (v) => setAccuracy(+v.toFixed(1)));
      }
    });

    tl.to(packet, {
      duration: 0.75,
      ease: 'none',
      onUpdate: function () {
        const p = this.progress();
        const pt = path.getPointAtLength(p * (pathLength * 0.33));
        gsap.set(packet, { cx: pt.x, cy: pt.y });
      },
      onComplete: () => setActiveStepIndex(1)
    })
    .to(packet, {
      duration: 0.75,
      ease: 'none',
      onUpdate: function () {
        const p = this.progress();
        const pt = path.getPointAtLength((pathLength * 0.33) + p * (pathLength * 0.33));
        gsap.set(packet, { cx: pt.x, cy: pt.y });
      },
      onComplete: () => setActiveStepIndex(2)
    })
    .to(packet, {
      duration: 0.75,
      ease: 'none',
      onUpdate: function () {
        const p = this.progress();
        const pt = path.getPointAtLength((pathLength * 0.66) + p * (pathLength * 0.34));
        gsap.set(packet, { cx: pt.x, cy: pt.y });
      },
      onComplete: () => setActiveStepIndex(3)
    })
    .to(packet, {
      duration: 0.3,
      opacity: 0
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveStepIndex(-1);
    setCurrentFrameIndex(0);
    setThroughput(1250);
    setLatency(14.2);
    setAccuracy(92.4);

    const packet = packetRef.current;
    if (packet) gsap.set(packet, { opacity: 0 });
  };

  return (
    <section ref={containerRef} className="py-24 px-4 sm:px-8 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-semibold mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Live ETL Architecture Simulation
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Interactive ML Pipeline Architecture
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed">
            Click <span className="text-foreground font-semibold">"Run Pipeline"</span> to trigger sequential data stream ingestion, ETL feature matrix encoding, and high-speed PyTorch model inference.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleRunPipeline}
              disabled={isRunning}
              className={`px-6 py-3 rounded-xl font-mono text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
                isRunning
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-75'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Executing Pipeline...' : 'Run Pipeline'}
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="p-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all shadow-sm"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pipeline Stages Container */}
        <div className="relative bg-card/60 backdrop-blur-md border border-border p-6 sm:p-8 rounded-2xl shadow-xl overflow-hidden">
          {/* Canvas Execution Backdrop */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
          />

          <div className="relative z-10">
            {/* SVG Connecting Path */}
            <div className="hidden md:block absolute top-[70px] left-[10%] right-[10%] h-[60px] pointer-events-none">
              <svg className="w-full h-full overflow-visible">
                <path
                  ref={pathRef}
                  d="M 20 30 Q 200 -10 380 30 T 740 30"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <circle ref={packetRef} r="8" fill="hsl(var(--primary))" opacity="0" />
              </svg>
            </div>

            {/* Stage Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isCurrent = activeStepIndex === idx;
                const isDone = activeStepIndex > idx;

                return (
                  <div
                    key={step.id}
                    className={`p-5 rounded-xl border transition-all duration-500 relative flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-card border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]'
                        : isDone
                        ? 'bg-card/90 border-secondary/40 shadow-sm'
                        : 'bg-background-secondary/50 border-border opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-lg ${isCurrent ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-secondary" />
                        ) : (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            Stage 0{idx + 1}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-base mb-1">{step.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{step.sub}</p>
                    </div>
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>{step.tech}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Real-time Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
              <div className="p-4 rounded-xl bg-background-secondary/60 border border-border/60 text-center">
                <span className="text-xs font-mono text-muted-foreground block mb-1">Throughput</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-foreground">{throughput}</span>
                <span className="text-[10px] text-muted-foreground block">req/sec</span>
              </div>
              <div className="p-4 rounded-xl bg-background-secondary/60 border border-border/60 text-center">
                <span className="text-xs font-mono text-muted-foreground block mb-1">Latency</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-foreground">{latency}</span>
                <span className="text-[10px] text-muted-foreground block">ms (p99)</span>
              </div>
              <div className="p-4 rounded-xl bg-background-secondary/60 border border-border/60 text-center">
                <span className="text-xs font-mono text-muted-foreground block mb-1">Model Precision</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-foreground">{accuracy}%</span>
                <span className="text-[10px] text-muted-foreground block">F1 Score</span>
              </div>
              <div className="p-4 rounded-xl bg-background-secondary/60 border border-border/60 text-center">
                <span className="text-xs font-mono text-muted-foreground block mb-1">Container Health</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-secondary">HEALTHY</span>
                <span className="text-[10px] text-muted-foreground block">200 OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineWidget;
