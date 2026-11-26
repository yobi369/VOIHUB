import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, RotateCcw, Shield, ShieldAlert } from 'lucide-react';
import type { SandboxTabKind, SimulationKind } from '../types';
import { AiMiniLab, CyberCtfMissions, NetworkingCliSim } from './SandboxTerminals';

interface SimulationsLabProps {
  initialSim?: SandboxTabKind;
  contextTopic?: string;
}

const SIM_OPTIONS: { id: SandboxTabKind; label: string; track: string }[] = [
  { id: 'ai-perceptron', label: 'Neural Perceptron Lab', track: 'AI' },
  { id: 'ai-vision', label: 'Vision Pixel & Edge Filters', track: 'AI' },
  { id: 'sandbox-ai-lab', label: 'AI Mini-Lab (Rules)', track: 'Sandbox' },
  { id: 'net-packets', label: 'Packet Router & TCP/IP Lab', track: 'Networking' },
  { id: 'net-binary', label: 'Binary, ASCII & Subnet Lab', track: 'Networking' },
  { id: 'sandbox-net-cli', label: 'Networking CLI Terminal', track: 'Sandbox' },
  { id: 'cyber-crypto', label: 'Cipher & SHA-256 Hash Lab', track: 'Cybersecurity' },
  { id: 'cyber-firewall', label: 'Firewall Defense Console', track: 'Cybersecurity' },
  { id: 'sandbox-cyber-ctf', label: 'Cyber CTF Missions (1–9)', track: 'Sandbox' },
];

interface DataPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

const PRESET_DATASETS: Record<'AND' | 'OR' | 'CLUSTER' | 'XOR', DataPoint[]> = {
  AND: [
    { x: -1.5, y: -1.5, label: 0 },
    { x: -1.5, y: 1.5, label: 0 },
    { x: 1.5, y: -1.5, label: 0 },
    { x: 1.5, y: 1.5, label: 1 },
  ],
  OR: [
    { x: -1.5, y: -1.5, label: 0 },
    { x: -1.5, y: 1.5, label: 1 },
    { x: 1.5, y: -1.5, label: 1 },
    { x: 1.5, y: 1.5, label: 1 },
  ],
  CLUSTER: [
    { x: -2.2, y: -1.4, label: 0 },
    { x: -1.4, y: -2.0, label: 0 },
    { x: -0.8, y: -1.0, label: 0 },
    { x: -1.9, y: 0.2, label: 0 },
    { x: 1.2, y: 1.4, label: 1 },
    { x: 2.1, y: 0.9, label: 1 },
    { x: 0.9, y: 2.2, label: 1 },
    { x: 2.0, y: 2.1, label: 1 },
  ],
  XOR: [
    { x: -1.5, y: -1.5, label: 0 },
    { x: 1.5, y: 1.5, label: 0 },
    { x: -1.5, y: 1.5, label: 1 },
    { x: 1.5, y: -1.5, label: 1 },
  ],
};

/* ---------------- 1. AI PERCEPTRON LAB ---------------- */
const PerceptronLab: React.FC = () => {
  const [w1, setW1] = useState(1.2);
  const [w2, setW2] = useState(1.1);
  const [bias, setBias] = useState(-1.2);
  const [points, setPoints] = useState<DataPoint[]>(PRESET_DATASETS.CLUSTER);
  const [activeBrush, setActiveBrush] = useState<0 | 1>(1);
  const [activation, setActivation] = useState<'step' | 'sigmoid'>('step');
  const [epochs, setEpochs] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const predict = (x: number, y: number) => {
    const z = w1 * x + w2 * y + bias;
    const prob = 1 / (1 + Math.exp(-z));
    return { z, prob, cls: z >= 0 ? 1 : 0 };
  };

  const accuracy = useMemo(() => {
    if (points.length === 0) return 100;
    const correct = points.filter((p) => predict(p.x, p.y).cls === p.label).length;
    return Math.round((correct / points.length) * 100);
  }, [points, w1, w2, bias]);

  const trainEpochs = (count: number) => {
    let cw1 = w1;
    let cw2 = w2;
    let cb = bias;
    const lr = 0.25;
    for (let ep = 0; ep < count; ep++) {
      for (const p of points) {
        const z = cw1 * p.x + cw2 * p.y + cb;
        const pred = z >= 0 ? 1 : 0;
        const err = p.label - pred;
        if (err !== 0) {
          cw1 += lr * err * p.x;
          cw2 += lr * err * p.y;
          cb += lr * err;
        }
      }
    }
    setW1(Number(cw1.toFixed(2)));
    setW2(Number(cw2.toFixed(2)));
    setBias(Number(cb.toFixed(2)));
    setEpochs((e) => e + count);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 42;

    // Region shading
    const step = 8;
    for (let px = 0; px < w; px += step) {
      for (let py = 0; py < h; py += step) {
        const x = (px + step / 2 - cx) / scale;
        const y = -(py + step / 2 - cy) / scale;
        const { z, prob } = predict(x, y);
        if (activation === 'step') {
          ctx.fillStyle = z >= 0 ? 'rgba(29, 78, 216, 0.11)' : 'rgba(234, 88, 12, 0.11)';
        } else {
          ctx.fillStyle =
            prob >= 0.5
              ? `rgba(29, 78, 216, ${(prob - 0.5) * 0.42})`
              : `rgba(234, 88, 12, ${(0.5 - prob) * 0.42})`;
        }
        ctx.fillRect(px, py, step, step);
      }
    }

    // Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1;
    for (let gx = -5; gx <= 5; gx++) {
      ctx.beginPath();
      ctx.moveTo(cx + gx * scale, 0);
      ctx.lineTo(cx + gx * scale, h);
      ctx.stroke();
    }
    for (let gy = -3; gy <= 3; gy++) {
      ctx.beginPath();
      ctx.moveTo(0, cy - gy * scale);
      ctx.lineTo(w, cy - gy * scale);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Decision boundary line w1*x + w2*y + b = 0
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (Math.abs(w2) > 0.01) {
      const x1 = -6;
      const y1 = -(w1 * x1 + bias) / w2;
      const x2 = 6;
      const y2 = -(w1 * x2 + bias) / w2;
      ctx.moveTo(cx + x1 * scale, cy - y1 * scale);
      ctx.lineTo(cx + x2 * scale, cy - y2 * scale);
    } else if (Math.abs(w1) > 0.01) {
      const x0 = -bias / w1;
      ctx.moveTo(cx + x0 * scale, 0);
      ctx.lineTo(cx + x0 * scale, h);
    }
    ctx.stroke();

    // Points
    for (const p of points) {
      const px = cx + p.x * scale;
      const py = cy - p.y * scale;
      const ok = predict(p.x, p.y).cls === p.label;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = p.label === 1 ? '#1D4ED8' : '#EA580C';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = ok ? '#FFFFFF' : '#E11D48';
      ctx.stroke();
    }
  }, [w1, w2, bias, points, activation]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const py = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const x = Number(((px - canvas.width / 2) / 42).toFixed(2));
    const y = Number((-(py - canvas.height / 2) / 42).toFixed(2));
    setPoints((prev) => [...prev, { x, y, label: activeBrush }]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-mono-math font-semibold text-slate-800">
            z = {w1.toFixed(2)}x₁ + {w2.toFixed(2)}x₂ + ({bias.toFixed(2)})
          </span>
          <span className={`font-mono-math font-bold ${accuracy === 100 ? 'text-emerald-700' : 'text-blue-700'}`}>
            Accuracy: {accuracy}% · Epochs: {epochs}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={320}
          onClick={handleCanvasClick}
          className="w-full h-auto rounded-lg border border-slate-200 cursor-crosshair"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>Click anywhere on the grid to place a dot for the selected class.</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveBrush(1)}
              className={`px-2.5 py-1 rounded font-semibold border ${activeBrush === 1 ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-700 border-slate-200'}`}
            >
              Blue Dot (1)
            </button>
            <button
              onClick={() => setActiveBrush(0)}
              className={`px-2.5 py-1 rounded font-semibold border ${activeBrush === 0 ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-slate-200'}`}
            >
              Orange Dot (0)
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Neuron Weights &amp; Training</h4>
          <div className="flex gap-1">
            {(['step', 'sigmoid'] as const).map((act) => (
              <button
                key={act}
                onClick={() => setActivation(act)}
                className={`px-2 py-1 text-[11px] font-semibold rounded border capitalize ${
                  activation === act ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <label className="block">
            <div className="flex justify-between mb-1"><span>Weight w₁ (Horizontal)</span><span className="font-mono-math font-semibold">{w1.toFixed(2)}</span></div>
            <input type="range" min="-4" max="4" step="0.1" value={w1} onChange={(e) => setW1(Number(e.target.value))} className="w-full accent-blue-700" />
          </label>
          <label className="block">
            <div className="flex justify-between mb-1"><span>Weight w₂ (Vertical)</span><span className="font-mono-math font-semibold">{w2.toFixed(2)}</span></div>
            <input type="range" min="-4" max="4" step="0.1" value={w2} onChange={(e) => setW2(Number(e.target.value))} className="w-full accent-blue-700" />
          </label>
          <label className="block">
            <div className="flex justify-between mb-1"><span>Bias Threshold b</span><span className="font-mono-math font-semibold">{bias.toFixed(2)}</span></div>
            <input type="range" min="-4" max="4" step="0.1" value={bias} onChange={(e) => setBias(Number(e.target.value))} className="w-full accent-slate-800" />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => trainEpochs(1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
          >
            <Play className="w-3.5 h-3.5" /> Train 1 Epoch
          </button>
          <button
            onClick={() => trainEpochs(15)}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            Auto-Train 15 Epochs
          </button>
          <button
            onClick={() => {
              setW1(0.2);
              setW2(-0.3);
              setBias(0);
              setEpochs(0);
            }}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Scramble
          </button>
        </div>

        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="text-[11px] font-bold text-slate-500">Dataset Presets (Try XOR to see single-neuron limits!)</div>
          <div className="flex flex-wrap gap-1.5">
            {(['CLUSTER', 'AND', 'OR', 'XOR'] as const).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setPoints(PRESET_DATASETS[key]);
                  setEpochs(0);
                }}
                className="px-2.5 py-1 text-xs font-mono-math font-semibold rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- 2. COMPUTER VISION KERNEL LAB ---------------- */
const VISION_PRESETS: Record<string, number[][]> = {
  Seven: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  Cross: [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
  ],
  Box: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const KERNELS: Record<string, { label: string; desc: string; matrix: number[][] }> = {
  vertical: {
    label: 'Vertical Edge Detector',
    desc: 'Fires strongly where dark pixels meet bright vertical strokes.',
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  },
  horizontal: {
    label: 'Horizontal Edge Detector',
    desc: 'Highlights flat horizontal rooftops, bars, and horizons.',
    matrix: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
  },
  sharpen: {
    label: 'Sharpen Filter',
    desc: 'Boosts center pixel contrast relative to immediate neighbors.',
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
  },
  blur: {
    label: 'Box Blur Smooth',
    desc: 'Averages neighboring pixels to smooth away harsh noise.',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
};

const VisionKernelLab: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() => VISION_PRESETS.Seven.map((r) => [...r]));
  const [kernelKey, setKernelKey] = useState<keyof typeof KERNELS>('vertical');
  const kernel = KERNELS[kernelKey];

  const featureMap = useMemo(() => {
    const out: number[][] = [];
    for (let r = 0; r < 6; r++) {
      const row: number[] = [];
      for (let c = 0; c < 6; c++) {
        let sum = 0;
        for (let kr = 0; kr < 3; kr++) {
          for (let kc = 0; kc < 3; kc++) {
            sum += grid[r + kr][c + kc] * kernel.matrix[kr][kc];
          }
        }
        row.push(kernelKey === 'blur' ? Number((sum / 9).toFixed(1)) : sum);
      }
      out.push(row);
    }
    return out;
  }, [grid, kernel, kernelKey]);

  const togglePixel = (r: number, c: number) => {
    setGrid((prev) => prev.map((row, ri) => (ri === r ? row.map((v, ci) => (ci === c ? (v ? 0 : 1) : v)) : row)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">1. Draw Input Image (8×8 Pixels)</h4>
          <div className="flex gap-1.5">
            {Object.keys(VISION_PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => setGrid(VISION_PRESETS[name].map((r) => [...r]))}
                className="px-2 py-1 text-[11px] font-semibold border border-slate-200 rounded bg-slate-50 hover:bg-slate-100"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-8 gap-1 bg-slate-100 p-2 rounded-lg border border-slate-200 max-w-[300px]">
          {grid.map((row, r) =>
            row.map((val, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => togglePixel(r, c)}
                aria-label={`Pixel ${r},${c}`}
                className={`aspect-square rounded-xs font-mono-math text-[10px] font-bold transition-colors ${
                  val ? 'bg-slate-900 text-white' : 'bg-white text-slate-300 border border-slate-200'
                }`}
              >
                {val}
              </button>
            ))
          )}
        </div>
        <p className="text-xs text-slate-500">Click squares to toggle pixel brightness (1 = ink, 0 = white background).</p>
      </div>

      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-900">2. Select 3×3 Filter</h4>
        <div className="space-y-1.5">
          {Object.entries(KERNELS).map(([k, item]) => (
            <button
              key={k}
              onClick={() => setKernelKey(k)}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                kernelKey === k ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5 pt-2 max-w-[160px]">
          {kernel.matrix.flat().map((v, idx) => (
            <div key={idx} className="py-2 text-center font-mono-math text-xs font-bold bg-slate-100 border border-slate-200 rounded">
              {v}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{kernel.desc}</p>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-900">3. Output Feature Map (6×6)</h4>
        <div className="grid grid-cols-6 gap-1 bg-slate-100 p-2 rounded-lg border border-slate-200 max-w-[280px]">
          {featureMap.map((row, r) =>
            row.map((val, c) => {
              const abs = Math.min(1, Math.abs(val) / 4);
              const bg =
                val > 0
                  ? `rgba(29, 78, 216, ${Math.max(0.12, abs)})`
                  : val < 0
                    ? `rgba(234, 88, 12, ${Math.max(0.12, abs)})`
                    : '#FFFFFF';
              return (
                <div
                  key={`${r}-${c}`}
                  style={{ backgroundColor: bg }}
                  className="aspect-square rounded-xs flex items-center justify-center font-mono-math text-[10px] font-bold text-slate-900 border border-slate-200/70"
                >
                  {val}
                </div>
              );
            })
          )}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Blue cells show positive edge matches; orange cells show opposite-direction edges; white cells show flat regions (0).
        </p>
      </div>
    </div>
  );
};

/* ---------------- 3. PACKET ROUTER & TCP/IP LAB ---------------- */
interface PacketEvent {
  id: number;
  protocol: 'DNS' | 'TCP' | 'UDP';
  stage: string;
  srcIp: string;
  dstIp: string;
  port: number;
  ttl: number;
  payload: string;
  status: 'delivered' | 'dropped';
}

const PacketRouterLab: React.FC = () => {
  const [protocol, setProtocol] = useState<'TCP' | 'UDP'>('TCP');
  const [lossPct, setLossPct] = useState(10);
  const [latencyMs, setLatencyMs] = useState(35);
  const [activeHop, setActiveHop] = useState(0);
  const [logs, setLogs] = useState<PacketEvent[]>([]);
  const [isSending, setIsSending] = useState(false);

  const hops = ['Your Tablet (192.168.1.42)', 'Home Wi-Fi Router', 'DNS Resolver (1.1.1.1)', 'ISP Fiber Core', 'TechHub Server (93.184.216.34)'];

  const runSimulation = (mode: 'handshake' | 'dns' | 'burst') => {
    if (isSending) return;
    setIsSending(true);
    setActiveHop(0);

    const steps =
      mode === 'dns'
        ? [
            { stage: 'DNS Query: techhub.edu?', proto: 'DNS' as const, src: '192.168.1.42', dst: '1.1.1.1', port: 53, payload: 'Type=A Name=techhub.edu', ttl: 64 },
            { stage: 'DNS Reply: 93.184.216.34', proto: 'DNS' as const, src: '1.1.1.1', dst: '192.168.1.42', port: 53, payload: 'A=93.184.216.34 TTL=300s', ttl: 59 },
          ]
        : mode === 'handshake'
          ? [
              { stage: '1/3 TCP SYN (Hi, ready?)', proto: 'TCP' as const, src: '192.168.1.42', dst: '93.184.216.34', port: 443, payload: 'SYN Seq=100', ttl: 64 },
              { stage: '2/3 TCP SYN-ACK (Ready!)', proto: 'TCP' as const, src: '93.184.216.34', dst: '192.168.1.42', port: 443, payload: 'SYN-ACK Seq=500 Ack=101', ttl: 54 },
              { stage: '3/3 TCP ACK (Connected!)', proto: 'TCP' as const, src: '192.168.1.42', dst: '93.184.216.34', port: 443, payload: 'ACK Ack=501 + HTTP GET', ttl: 64 },
            ]
          : [1, 2, 3, 4].map((idx) => ({
              stage: `${protocol} Packet #${idx}/4`,
              proto: protocol,
              src: '192.168.1.42',
              dst: '93.184.216.34',
              port: protocol === 'TCP' ? 443 : 51820,
              payload: protocol === 'TCP' ? `Chunk ${idx} Seq=${100 + idx * 128}` : `LiveFrame ${idx} (No Retry)`,
              ttl: 64 - idx,
            }));

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setActiveHop((idx % 4) + 1);
        const dropped = Math.random() * 100 < lossPct;
        const entry: PacketEvent = {
          id: Date.now() + idx,
          protocol: step.proto,
          stage: dropped && step.proto === 'TCP' ? `${step.stage} -> Dropped & Retransmitted!` : step.stage,
          srcIp: step.src,
          dstIp: step.dst,
          port: step.port,
          ttl: step.ttl,
          payload: step.payload,
          status: dropped && step.proto !== 'TCP' ? 'dropped' : 'delivered',
        };
        setLogs((prev) => [entry, ...prev].slice(0, 8));
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setActiveHop(0);
            setIsSending(false);
          }, 280);
        }
      }, (idx + 1) * Math.max(180, latencyMs * 5));
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Live Network Route Visualizer</h4>
            <p className="text-xs text-slate-500">Send DNS queries, TCP handshakes, or streaming packets across router hops.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => runSimulation('dns')} disabled={isSending} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 disabled:opacity-50">
              1. DNS Lookup
            </button>
            <button onClick={() => runSimulation('handshake')} disabled={isSending} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50">
              2. TCP 3-Way Handshake
            </button>
            <button onClick={() => runSimulation('burst')} disabled={isSending} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">
              3. Send 4-{protocol} Packets
            </button>
          </div>
        </div>

        {/* Visual Hop Chain */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {hops.map((hop, idx) => {
            const lit = activeHop === idx;
            return (
              <div
                key={hop}
                className={`p-3 rounded-lg border text-center transition-all ${
                  lit ? 'bg-blue-700 text-white border-blue-700 shadow-sm' : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className={`text-[10px] font-mono-math ${lit ? 'text-blue-100' : 'text-slate-400'}`}>HOP {idx + 1}</div>
                <div className="text-xs font-semibold mt-1 leading-snug">{hop}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-semibold">Transport:</span>
            {(['TCP', 'UDP'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProtocol(p)}
                className={`px-3 py-1 rounded border font-mono-math font-bold ${
                  protocol === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <label className="block">
            <div className="flex justify-between mb-1"><span>Link Latency</span><span className="font-mono-math font-semibold">{latencyMs} ms</span></div>
            <input type="range" min="10" max="150" step="5" value={latencyMs} onChange={(e) => setLatencyMs(Number(e.target.value))} className="w-full accent-blue-700" />
          </label>
          <label className="block">
            <div className="flex justify-between mb-1"><span>Simulated Packet Loss</span><span className="font-mono-math font-semibold">{lossPct}%</span></div>
            <input type="range" min="0" max="60" step="5" value={lossPct} onChange={(e) => setLossPct(Number(e.target.value))} className="w-full accent-rose-600" />
          </label>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Live Packet Header Inspector</h4>
          {logs.length > 0 && (
            <button onClick={() => setLogs([])} className="text-xs text-slate-500 hover:text-slate-800">
              Clear Log
            </button>
          )}
        </div>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500">Click any packet action above to inspect IP, Port, TTL, and Sequence headers.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {logs.map((pkt) => (
              <div key={pkt.id} className="border border-slate-200 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
                <div>
                  <span className="font-mono-math font-bold text-blue-700 mr-2">[{pkt.protocol}]</span>
                  <span className="font-semibold text-slate-900">{pkt.stage}</span>
                  <div className="font-mono-math text-[11px] text-slate-600 mt-1">
                    {pkt.srcIp} → {pkt.dstIp}:{pkt.port} · TTL={pkt.ttl} · {pkt.payload}
                  </div>
                </div>
                <span className={`font-mono-math font-semibold shrink-0 ${pkt.status === 'delivered' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {pkt.status === 'delivered' ? 'DELIVERED' : 'DROPPED (UDP)'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- 4. BINARY, ASCII & SUBNET BITMASK LAB ---------------- */
const BinarySubnetLab: React.FC = () => {
  const [bits, setBits] = useState<number[]>([0, 1, 0, 0, 1, 0, 0, 0]); // 72 = 'H'
  const [hostLastOctet, setHostLastOctet] = useState(142);
  const [maskCidr, setMaskCidr] = useState<24 | 25 | 26 | 27>(26);

  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const decimalVal = bits.reduce((acc, b, idx) => acc + b * weights[idx], 0);
  const hexVal = decimalVal.toString(16).toUpperCase().padStart(2, '0');
  const asciiChar = decimalVal >= 32 && decimalVal <= 126 ? String.fromCharCode(decimalVal) : '(Control)';

  const maskLastOctet = maskCidr === 24 ? 0 : maskCidr === 25 ? 128 : maskCidr === 26 ? 192 : 224;
  const networkIdOctet = hostLastOctet & maskLastOctet;
  const usableHosts = Math.pow(2, 32 - maskCidr) - 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">8-Bit Binary &amp; ASCII Switchboard</h4>
          <span className="font-mono-math text-xs text-blue-700 font-bold">1 Byte = 8 Bits</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {bits.map((b, idx) => (
            <button
              key={idx}
              onClick={() => setBits((prev) => prev.map((v, i) => (i === idx ? (v ? 0 : 1) : v)))}
              className={`py-3 rounded-lg border text-center transition-colors ${
                b ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-mono-math text-base font-extrabold">{b}</div>
              <div className={`text-[10px] font-mono-math mt-0.5 ${b ? 'text-blue-100' : 'text-slate-400'}`}>{weights[idx]}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="text-[11px] text-slate-500">Decimal (0–255)</div>
            <div className="text-xl font-bold font-mono-math text-slate-900 mt-0.5">{decimalVal}</div>
          </div>
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="text-[11px] text-slate-500">Hexadecimal</div>
            <div className="text-xl font-bold font-mono-math text-blue-700 mt-0.5">0x{hexVal}</div>
          </div>
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="text-[11px] text-slate-500">ASCII Letter</div>
            <div className="text-xl font-bold font-mono-math text-emerald-700 mt-0.5">{asciiChar}</div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">IPv4 Bitwise AND Subnet Masking</h4>
          <span className="font-mono-math text-xs text-slate-600">/{maskCidr} ({usableHosts} hosts)</span>
        </div>

        <div className="space-y-3 text-xs">
          <label className="block">
            <div className="flex justify-between mb-1"><span>Device IP</span><span className="font-mono-math font-bold">192.168.1.{hostLastOctet}</span></div>
            <input type="range" min="1" max="254" value={hostLastOctet} onChange={(e) => setHostLastOctet(Number(e.target.value))} className="w-full accent-blue-700" />
          </label>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-semibold">CIDR Prefix:</span>
            {([24, 25, 26, 27] as const).map((c) => (
              <button
                key={c}
                onClick={() => setMaskCidr(c)}
                className={`px-2.5 py-1 rounded font-mono-math font-semibold border ${
                  maskCidr === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                /{c}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono-math text-xs space-y-1.5">
          <div>IP Last Octet:   {hostLastOctet.toString(2).padStart(8, '0')} ({hostLastOctet})</div>
          <div>Mask Last Octet: {maskLastOctet.toString(2).padStart(8, '0')} ({maskLastOctet})</div>
          <div className="border-t border-slate-700 pt-1.5 text-emerald-400 font-bold">
            AND Network ID:  {networkIdOctet.toString(2).padStart(8, '0')} → 192.168.1.{networkIdOctet}/{maskCidr}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- 5. CRYPTOGRAPHY & SHA-256 LAB ---------------- */
function caesarShift(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + ((shift % 26) + 26)) % 26) + base);
  });
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function countDifferentBits(hexA: string, hexB: string): number {
  if (!hexA || !hexB || hexA.length !== hexB.length) return 0;
  let diff = 0;
  for (let i = 0; i < hexA.length; i++) {
    let x = parseInt(hexA[i], 16) ^ parseInt(hexB[i], 16);
    while (x > 0) {
      diff += x & 1;
      x >>= 1;
    }
  }
  return diff;
}

const CryptoLab: React.FC = () => {
  const [plain, setPlain] = useState('HELLO TECH HUB');
  const [shift, setShift] = useState(3);

  const [inputA, setInputA] = useState('TechHub2026!');
  const [inputB, setInputB] = useState('techHub2026!');
  const [hashA, setHashA] = useState('');
  const [hashB, setHashB] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([sha256Hex(inputA), sha256Hex(inputB)]).then(([a, b]) => {
      if (!cancelled) {
        setHashA(a);
        setHashB(b);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [inputA, inputB]);

  const bitDiff = countDifferentBits(hashA, hashB);
  const charsetSize = (/[a-z]/.test(inputA) ? 26 : 0) + (/[A-Z]/.test(inputA) ? 26 : 0) + (/[0-9]/.test(inputA) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(inputA) ? 32 : 0);
  const entropyBits = inputA.length > 0 && charsetSize > 0 ? Math.round(inputA.length * Math.log2(charsetSize)) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Caesar Shift Cipher Wheel</h4>
          <span className="font-mono-math text-xs font-bold text-blue-700">Key +{shift}</span>
        </div>
        <input
          type="text"
          value={plain}
          onChange={(e) => setPlain(e.target.value)}
          className="w-full px-3 py-2 text-xs font-mono-math border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
          placeholder="Type secret message..."
        />
        <label className="block text-xs">
          <div className="flex justify-between mb-1"><span>Alphabet Shift</span><span className="font-mono-math font-semibold">{shift}</span></div>
          <input type="range" min="0" max="25" value={shift} onChange={(e) => setShift(Number(e.target.value))} className="w-full accent-blue-700" />
        </label>
        <div className="bg-slate-900 text-emerald-400 rounded-lg p-3.5 font-mono-math text-xs break-all">
          Ciphertext: {caesarShift(plain, shift)}
        </div>
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
          <span className="text-slate-600">Message A Password Entropy:</span>
          <span className={`font-mono-math font-bold ${entropyBits >= 60 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {entropyBits} bits {entropyBits >= 60 ? '(Strong)' : '(Add length!)'}
          </span>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Live SHA-256 Avalanche Effect Comparator</h4>
          <span className="font-mono-math text-xs font-bold text-blue-700">
            {bitDiff} / 256 bits changed ({Math.round((bitDiff / 256) * 100)}%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Input A</label>
            <input
              type="text"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="w-full px-3 py-2 font-mono-math border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Input B (Try editing 1 character!)</label>
            <input
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="w-full px-3 py-2 font-mono-math border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
            />
          </div>
        </div>

        <div className="space-y-2 font-mono-math text-[11px]">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg break-all">
            <span className="text-slate-400 mr-2">SHA-256(A):</span>
            <span className="text-slate-900">{hashA}</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg break-all">
            <span className="text-slate-400 mr-2">SHA-256(B):</span>
            <span className="text-blue-700">{hashB}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- 6. FIREWALL & THREAT DEFENSE LAB ---------------- */
interface TrafficSample {
  id: string;
  label: string;
  port: number;
  proto: string;
  payload: string;
  malicious: boolean;
}

const TRAFFIC_WAVE: TrafficSample[] = [
  { id: 't1', label: 'HTTPS Homework Page', port: 443, proto: 'TCP', payload: 'GET /lesson/ai-g4', malicious: false },
  { id: 't2', label: 'SQL Injection Probe', port: 443, proto: 'TCP', payload: "GET /login?user=' OR 1=1--", malicious: true },
  { id: 't3', label: 'Unsolicited Remote Desktop', port: 3389, proto: 'TCP', payload: 'RDP Brute-Force Attempt', malicious: true },
  { id: 't4', label: 'Plaintext HTTP Login', port: 80, proto: 'TCP', payload: 'POST password=12345 (unencrypted)', malicious: true },
  { id: 't5', label: 'XSS Script Injection', port: 443, proto: 'TCP', payload: '<script>stealCookie()</script>', malicious: true },
  { id: 't6', label: 'DNS School Domain Lookup', port: 53, proto: 'UDP', payload: 'Query techhub.edu', malicious: false },
];

const FirewallLab: React.FC = () => {
  const [allow443, setAllow443] = useState(true);
  const [block80, setBlock80] = useState(true);
  const [block3389, setBlock3389] = useState(true);
  const [inspectSqlXss, setInspectSqlXss] = useState(true);

  const evaluations = TRAFFIC_WAVE.map((pkt) => {
    const hasInjection = /' OR|<script>/i.test(pkt.payload);
    let blocked = false;
    let reason = 'Allowed safe traffic';

    if (pkt.port === 3389 && block3389) {
      blocked = true;
      reason = 'Blocked risky port 3389 (RDP)';
    } else if (pkt.port === 80 && block80) {
      blocked = true;
      reason = 'Blocked unencrypted HTTP port 80';
    } else if (pkt.port === 443 && !allow443) {
      blocked = true;
      reason = 'HTTPS port 443 disabled';
    } else if (hasInjection && inspectSqlXss) {
      blocked = true;
      reason = 'WAF caught SQLi / XSS signature';
    }

    const correctDecision = pkt.malicious ? blocked : !blocked;
    return { ...pkt, blocked, reason, correctDecision };
  });

  const defenseScore = Math.round((evaluations.filter((e) => e.correctDecision).length / evaluations.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Firewall Policy Rules</h4>
          <span className={`font-mono-math text-xs font-bold ${defenseScore === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
            Defense: {defenseScore}%
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {[
            { label: 'Allow HTTPS Port 443 (Encrypted Web)', val: allow443, set: setAllow443 },
            { label: 'Block Plaintext HTTP Port 80', val: block80, set: setBlock80 },
            { label: 'Block Exposed RDP Port 3389', val: block3389, set: setBlock3389 },
            { label: 'Enable WAF SQLi & XSS Inspection', val: inspectSqlXss, set: setInspectSqlXss },
          ].map((rule) => (
            <label key={rule.label} className="flex items-center justify-between gap-2 p-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <span className="font-medium text-slate-800">{rule.label}</span>
              <input type="checkbox" checked={rule.val} onChange={(e) => rule.set(e.target.checked)} className="accent-blue-700 w-4 h-4" />
            </label>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-slate-900">Incoming Traffic Inspection Results</h4>
        <div className="space-y-2">
          {evaluations.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                item.correctDecision ? 'border-slate-200 bg-slate-50' : 'border-rose-300 bg-rose-50'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {item.malicious ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  <span className="font-bold text-slate-900">{item.label}</span>
                  <span className="font-mono-math text-slate-500">{item.proto}:{item.port}</span>
                </div>
                <div className="font-mono-math text-[11px] text-slate-600">{item.payload}</div>
              </div>
              <div className="text-right shrink-0">
                <span className={`font-mono-math font-bold ${item.blocked ? 'text-blue-700' : 'text-emerald-700'}`}>
                  {item.blocked ? 'BLOCKED' : 'ALLOWED'}
                </span>
                <div className="text-[11px] text-slate-500">{item.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SimulationsLab: React.FC<SimulationsLabProps> = ({ initialSim = 'ai-perceptron', contextTopic }) => {
  const [activeSim, setActiveSim] = useState<SandboxTabKind>(initialSim);

  useEffect(() => {
    setActiveSim(initialSim);
  }, [initialSim]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">TECH HUB Interactive Simulation &amp; Terminal Suite</h3>
          <p className="text-sm text-slate-600">
            {contextTopic
              ? `Calibrated for "${contextTopic}". Experiment with live AI rules, CLI diagnostics, CTF missions, packets, and crypto below.`
              : 'Hands-on kids laboratories & live coding/CLI sandboxes for AI, Computer Networking, and Cybersecurity.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SIM_OPTIONS.map((sim) => (
            <button
              key={sim.id}
              onClick={() => setActiveSim(sim.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeSim === sim.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {sim.label}
            </button>
          ))}
        </div>
      </div>

      {activeSim === 'ai-perceptron' && <PerceptronLab />}
      {activeSim === 'ai-vision' && <VisionKernelLab />}
      {activeSim === 'sandbox-ai-lab' && <AiMiniLab />}
      {activeSim === 'net-packets' && <PacketRouterLab />}
      {activeSim === 'net-binary' && <BinarySubnetLab />}
      {activeSim === 'sandbox-net-cli' && <NetworkingCliSim />}
      {activeSim === 'cyber-crypto' && <CryptoLab />}
      {activeSim === 'cyber-firewall' && <FirewallLab />}
      {activeSim === 'sandbox-cyber-ctf' && <CyberCtfMissions />}
    </div>
  );
};

export default SimulationsLab;
