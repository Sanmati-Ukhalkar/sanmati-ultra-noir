import React, { useState } from 'react';
import { Lightbulb, ArrowRight, ShieldCheck, Layers, Gauge, Cpu, Lock, Eye } from 'lucide-react';

interface DecisionCase {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  optimizedTitle: string;
  optimizedItems: { title: string; desc: string; icon: React.ElementType }[];
  naiveItems: { title: string; desc: string }[];
  metrics: { label: string; value: string; percent: number }[];
  impact: string;
}

const cases: DecisionCase[] = [
  {
    id: 'latency',
    title: 'ML Inference Latency Optimization',
    subtitle: 'Cutting Real-Time Prediction Latency from 185ms to 14ms',
    summary: 'Building production ML models requires balancing accuracy with inference latency and memory footprint. Here is how I solved high latency in real-time prediction pipelines.',
    optimizedTitle: '14ms Avg Latency',
    optimizedItems: [
      { title: '1. In-Memory Redis Feature Cache', desc: 'Pre-computed heavy behavioral aggregations stored in Redis, bypassing expensive on-the-fly SQL joins.', icon: Layers },
      { title: '2. ONNX Model Quantization (INT8)', desc: 'Converted PyTorch weights to INT8 ONNX Runtime, cutting RAM usage by 68% and boosting matrix multiplication speed 4x.', icon: Cpu },
      { title: '3. Async FastAPI Micro-Batching', desc: 'Grouped incoming single requests into 16-sample mini-batches within a 5ms window to maximize GPU/CPU vectorization.', icon: Gauge }
    ],
    naiveItems: [
      { title: '1. Synchronous On-Demand DB Queries', desc: 'Every incoming REST request triggered multi-table SQL queries, causing DB connection locks under load.' },
      { title: '2. Uncompressed FP32 PyTorch Model', desc: 'FP32 precision model required high memory capacity and un-optimized CPU inference calls.' }
    ],
    metrics: [
      { label: 'Inference Speed', value: '14ms vs 185ms', percent: 92 },
      { label: 'Memory Footprint', value: '140MB vs 850MB', percent: 85 },
      { label: 'Throughput Capacity', value: '1,400+ req/s vs 120 req/s', percent: 95 }
    ],
    impact: 'Enabled real-time churn alerts directly inside client dashboards without impacting core API response budgets.'
  },
  {
    id: 'anti-ban',
    title: 'JobPilot Anti-Ban Semi-Auto Gate',
    subtitle: 'Orchestrating High-Volume Applications Without Account Bans',
    summary: 'Automating job applications at scale risks immediate account suspension on platforms like LinkedIn and Indeed if bots navigate too fast or fail CAPTCHAs.',
    optimizedTitle: '0 Account Bans (100% Safe)',
    optimizedItems: [
      { title: '1. Human-in-the-Loop Semi-Auto Approval', desc: 'Automated job parsing & tailoring, but routed final form submit button triggers through a 1-click human verification gate.', icon: Lock },
      { title: '2. Humanized Jitter & Rate Limiting', desc: 'Injected randomized gaussian delay distributions (3s-8s) between form actions to match organic human rhythm.', icon: Gauge },
      { title: '3. Vector-Store Resume Tailoring', desc: 'Matched job bullet points with pgvector embeddings to craft tailored responses before approval.', icon: Layers }
    ],
    naiveItems: [
      { title: '1. Full Unthrottled Headless Scraping', desc: 'Firing rapid Selenium clicks caused IP rate limiting and immediate anti-bot verification blocks.' },
      { title: '2. Hardcoded Static Resumes', desc: 'Sending identical applications led to low interview conversion rates.' }
    ],
    metrics: [
      { label: 'Account Safety Rate', value: '100% vs 35%', percent: 98 },
      { label: 'Application Speedup', value: '5x Faster vs Manual', percent: 88 },
      { label: 'Interview Callback Rate', value: '18% vs 4%', percent: 82 }
    ],
    impact: 'Successfully automated application tracking for 150+ target roles while maintaining 100% account safety.'
  },
  {
    id: 'vision-qa',
    title: 'Computer Vision Line QA Pipeline',
    subtitle: 'Real-Time Edge Defect Inspection at 60 FPS',
    summary: 'Industrial manufacturing lines move fast; cloud API inference introduces network jitter that missed fast-moving defect frames on the line.',
    optimizedTitle: '60 FPS Edge Inspection',
    optimizedItems: [
      { title: '1. Local Edge Processing (OpenCV + TensorRT)', desc: 'Deployed lightweight YOLO model directly on local edge hardware, eliminating cloud network roundtrips.', icon: Eye },
      { title: '2. Frame Buffer & Skip Strategy', desc: 'Analyzed keyframes using optical flow to skip static redundant frames and maximize GPU throughput.', icon: Cpu },
      { title: '3. Real-Time WebSocket Alerts', desc: 'Emitted zero-latency WebSocket signals to stop conveyor hardware upon detecting high-confidence defects.', icon: Layers }
    ],
    naiveItems: [
      { title: '1. Cloud REST Upload per Frame', desc: 'Uploading high-res video frames over HTTP introduced 200ms+ latency spikes.' },
      { title: '2. Unoptimized Heavy Model', desc: 'Running standard ResNet models stalled frame ingestion buffers.' }
    ],
    metrics: [
      { label: 'Frame Inspection Rate', value: '60 FPS vs 5 FPS', percent: 95 },
      { label: 'Defect Detection Accuracy', value: '98.2% Precision', percent: 98 },
      { label: 'Network Bandwidth', value: '94% Reduction', percent: 94 }
    ],
    impact: 'Stopped defective parts instantly at the edge before proceeding down the packaging line.'
  }
];

const HowIThink: React.FC = () => {
  const [activeCaseId, setActiveCaseId] = useState<string>('latency');
  const [selectedApproach, setSelectedApproach] = useState<'optimized' | 'standard'>('optimized');

  const currentCase = cases.find(c => c.id === activeCaseId) || cases[0];

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden my-16">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 rounded-lg bg-accent/20 text-accent-foreground">
          <Lightbulb className="w-4 h-4" />
        </span>
        <span className="text-xs font-mono tracking-widest uppercase text-primary font-semibold">
          Engineering Strategy & Thought Process
        </span>
      </div>

      <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
        How I Think: Technical Decisions In Action
      </h3>
      <p className="text-muted-foreground text-base max-w-3xl mb-8 leading-relaxed">
        {currentCase.summary}
      </p>

      {/* Case Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-border pb-4">
        {cases.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveCaseId(item.id);
              setSelectedApproach('optimized');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
              activeCaseId === item.id
                ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm'
                : 'bg-background-secondary border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Strategy Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-8 p-1.5 bg-background-secondary rounded-xl w-full sm:w-fit border border-border">
        <button
          onClick={() => setSelectedApproach('optimized')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            selectedApproach === 'optimized'
              ? 'bg-card text-foreground shadow-sm font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          ✨ Optimized Strategy (My Architecture)
        </button>
        <button
          onClick={() => setSelectedApproach('standard')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            selectedApproach === 'standard'
              ? 'bg-card text-foreground shadow-sm font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          ⚠️ Standard Naive Approach
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Architecture Breakdown Card */}
        <div className="lg:col-span-7 bg-background-secondary/50 border border-border rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Architecture Blueprint
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                selectedApproach === 'optimized' ? 'bg-secondary/15 text-secondary border border-secondary/30' : 'bg-destructive/15 text-destructive border border-destructive/30'
              }`}>
                {selectedApproach === 'optimized' ? currentCase.optimizedTitle : 'Legacy Baseline'}
              </span>
            </div>

            {selectedApproach === 'optimized' ? (
              <div className="space-y-4">
                {currentCase.optimizedItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="p-4 bg-card border border-secondary/40 rounded-xl flex items-start gap-4 shadow-sm">
                      <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 opacity-75">
                {currentCase.naiveItems.map((item, i) => (
                  <div key={i} className="p-4 bg-card border border-border rounded-xl flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive font-mono font-bold text-xs">
                      ✕
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Engineering Discipline</span>
            <span className="font-mono text-foreground font-semibold">Quality over Quick Hacks</span>
          </div>
        </div>

        {/* Trade-Off Comparison Card */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-bold text-foreground mb-4">Key Performance Metrics</h4>

            <div className="space-y-4">
              {currentCase.metrics.map((m, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="text-secondary font-bold">{m.value}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-700"
                      style={{ width: selectedApproach === 'optimized' ? `${m.percent}%` : '25%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-background-secondary border border-border">
              <p className="text-xs font-mono text-foreground font-semibold flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-secondary" /> Measured Business Impact
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentCase.impact}
              </p>
            </div>
          </div>

          <div
            className="mt-6 flex items-center gap-2 text-xs text-primary font-semibold cursor-pointer group"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Explore production projects using this architecture</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowIThink;

