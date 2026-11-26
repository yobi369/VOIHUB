import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Flag, Play, ShieldCheck, Terminal, TerminalSquare } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';
import { playCorrectAnswerSound, playTopicCompleteSound } from '../services/audioService';

/* ============================================================================
   1. AI MINI-LAB (CLASSIFIER & RULE SANDBOX)
   ============================================================================ */
interface AiDatasetCase {
  id: string;
  title: string;
  features: Record<string, number>;
  actual: 0 | 1;
}

interface AiDatasetSpec {
  id: 'spam' | 'picnic' | 'bot';
  name: string;
  targetLabel1: string;
  targetLabel0: string;
  featureLabels: { key: string; label: string; min: number; max: number; step: number }[];
  defaultWeights: Record<string, number>;
  defaultThreshold: number;
  starterRuleText: string;
  cases: AiDatasetCase[];
}

const AI_DATASETS: AiDatasetSpec[] = [
  {
    id: 'spam',
    name: 'Kids Safe-Mail Spam Filter',
    targetLabel1: 'Spam / Trap',
    targetLabel0: 'Safe Mail',
    featureLabels: [
      { key: 'links', label: 'Suspicious Links', min: 0, max: 5, step: 1 },
      { key: 'urgentWords', label: 'Urgent Words ("WIN FREE!")', min: 0, max: 5, step: 1 },
      { key: 'knownFriend', label: 'Known Teacher/Friend (0 or 1)', min: 0, max: 1, step: 1 },
    ],
    defaultWeights: { links: 1.5, urgentWords: 1.2, knownFriend: -2.2 },
    defaultThreshold: 2.0,
    starterRuleText: 'score = 1.5 * links + 1.2 * urgentWords - 2.2 * knownFriend >= 2.0',
    cases: [
      { id: 's1', title: 'Homework PDF from Ms. Lin', features: { links: 1, urgentWords: 0, knownFriend: 1 }, actual: 0 },
      { id: 's2', title: 'WIN FREE TABLET CLICK NOW!!', features: { links: 3, urgentWords: 4, knownFriend: 0 }, actual: 1 },
      { id: 's3', title: 'Soccer practice schedule', features: { links: 0, urgentWords: 0, knownFriend: 1 }, actual: 0 },
      { id: 's4', title: 'Urgent verify password link', features: { links: 2, urgentWords: 2, knownFriend: 0 }, actual: 1 },
      { id: 's5', title: 'Science fair museum flyer', features: { links: 1, urgentWords: 1, knownFriend: 1 }, actual: 0 },
      { id: 's6', title: 'Mystery prize expires in 5 min', features: { links: 2, urgentWords: 3, knownFriend: 0 }, actual: 1 },
    ],
  },
  {
    id: 'picnic',
    name: 'Robot Picnic Weather Classifier',
    targetLabel1: 'Go on Picnic',
    targetLabel0: 'Stay Indoors',
    featureLabels: [
      { key: 'sunshine', label: 'Sunshine Score (0-10)', min: 0, max: 10, step: 1 },
      { key: 'rainPct', label: 'Rain Chance (0-10 scale)', min: 0, max: 10, step: 1 },
      { key: 'windLevel', label: 'Wind Gusts (0-5)', min: 0, max: 5, step: 1 },
    ],
    defaultWeights: { sunshine: 1.0, rainPct: -1.4, windLevel: -0.6 },
    defaultThreshold: 1.5,
    starterRuleText: 'score = 1.0 * sunshine - 1.4 * rainPct - 0.6 * windLevel >= 1.5',
    cases: [
      { id: 'p1', title: 'Bright Sunny Saturday', features: { sunshine: 9, rainPct: 1, windLevel: 1 }, actual: 1 },
      { id: 'p2', title: 'Thunderstorm Warning', features: { sunshine: 1, rainPct: 9, windLevel: 4 }, actual: 0 },
      { id: 'p3', title: 'Warm Breezy Afternoon', features: { sunshine: 7, rainPct: 2, windLevel: 2 }, actual: 1 },
      { id: 'p4', title: 'Drizzle & Cold Wind', features: { sunshine: 3, rainPct: 6, windLevel: 3 }, actual: 0 },
      { id: 'p5', title: 'Clear Blue Sky', features: { sunshine: 8, rainPct: 0, windLevel: 1 }, actual: 1 },
      { id: 'p6', title: 'Grey Pouring Clouds', features: { sunshine: 2, rainPct: 8, windLevel: 2 }, actual: 0 },
    ],
  },
  {
    id: 'bot',
    name: 'Bot vs. Student Login Detector',
    targetLabel1: 'Automated Bot',
    targetLabel0: 'Real Student',
    featureLabels: [
      { key: 'clicksPerSec', label: 'Clicks Per Second', min: 1, max: 10, step: 1 },
      { key: 'mouseJitter', label: 'Natural Mouse Moves (0-5)', min: 0, max: 5, step: 1 },
      { key: 'verifiedCookie', label: 'Valid Session Token (0/1)', min: 0, max: 1, step: 1 },
    ],
    defaultWeights: { clicksPerSec: 1.1, mouseJitter: -1.3, verifiedCookie: -2.0 },
    defaultThreshold: 2.0,
    starterRuleText: 'score = 1.1 * clicksPerSec - 1.3 * mouseJitter - 2.0 * verifiedCookie >= 2.0',
    cases: [
      { id: 'b1', title: 'Student opening Lesson 3', features: { clicksPerSec: 1, mouseJitter: 4, verifiedCookie: 1 }, actual: 0 },
      { id: 'b2', title: 'Fast scraper script', features: { clicksPerSec: 9, mouseJitter: 0, verifiedCookie: 0 }, actual: 1 },
      { id: 'b3', title: 'Student typing notes', features: { clicksPerSec: 2, mouseJitter: 5, verifiedCookie: 1 }, actual: 0 },
      { id: 'b4', title: 'Brute-force password bot', features: { clicksPerSec: 8, mouseJitter: 0, verifiedCookie: 0 }, actual: 1 },
      { id: 'b5', title: 'Quiz taker clicking answers', features: { clicksPerSec: 2, mouseJitter: 3, verifiedCookie: 1 }, actual: 0 },
      { id: 'b6', title: 'Headless crawler burst', features: { clicksPerSec: 6, mouseJitter: 1, verifiedCookie: 0 }, actual: 1 },
    ],
  },
];

export const AiMiniLab: React.FC = () => {
  const { recordCorrectQuizAnswer } = useUserProfile();
  const [datasetId, setDatasetId] = useState<'spam' | 'picnic' | 'bot'>('spam');
  const dataset = useMemo(() => AI_DATASETS.find((d) => d.id === datasetId) || AI_DATASETS[0], [datasetId]);

  const [weights, setWeights] = useState<Record<string, number>>(dataset.defaultWeights);
  const [threshold, setThreshold] = useState<number>(dataset.defaultThreshold);
  const [rewardedIds, setRewardedIds] = useState<string[]>([]);

  useEffect(() => {
    setWeights({ ...dataset.defaultWeights });
    setThreshold(dataset.defaultThreshold);
  }, [dataset]);

  const results = useMemo(() => {
    return dataset.cases.map((c) => {
      const score = dataset.featureLabels.reduce(
        (sum, f) => sum + (weights[f.key] ?? 0) * (c.features[f.key] ?? 0),
        0
      );
      const predicted: 0 | 1 = score >= threshold ? 1 : 0;
      return { ...c, score: Number(score.toFixed(2)), predicted, correct: predicted === c.actual };
    });
  }, [dataset, weights, threshold]);

  const correctCount = results.filter((r) => r.correct).length;
  const accuracyPct = Math.round((correctCount / results.length) * 100);

  const handleVerifyMastery = () => {
    if (accuracyPct === 100 && !rewardedIds.includes(dataset.id)) {
      setRewardedIds((prev) => [...prev, dataset.id]);
      recordCorrectQuizAnswer();
      playCorrectAnswerSound();
    }
  };

  const ruleExpression = dataset.featureLabels
    .map((f) => {
      const w = weights[f.key] ?? 0;
      return `${w >= 0 ? '+' : ''}${w.toFixed(1)} * ${f.key}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">AI Mini-Lab: Interactive Classifier Code &amp; Weights</h4>
          <p className="text-xs text-slate-500">
            Tune the Python-style rule weights and decision threshold to hit 100% accuracy on the sample test set.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AI_DATASETS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => setDatasetId(ds.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                datasetId === ds.id
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {ds.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Rule Code & Tuning Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Live Classifier Function</span>
            <span className={`font-mono-math text-xs font-bold ${accuracyPct === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
              Accuracy: {correctCount}/{results.length} ({accuracyPct}%)
            </span>
          </div>

          <pre className="bg-slate-900 text-emerald-300 rounded-lg p-3.5 text-[11px] font-mono-math overflow-x-auto leading-relaxed">
{`def classify(sample):
  score = (${ruleExpression})
  if score >= ${threshold.toFixed(1)}:
    return "${dataset.targetLabel1}"
  return "${dataset.targetLabel0}"`}
          </pre>

          <div className="space-y-3 text-xs pt-1">
            {dataset.featureLabels.map((f) => {
              const w = weights[f.key] ?? 0;
              return (
                <label key={f.key} className="block">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Weight: {f.label}</span>
                    <span className="font-mono-math font-bold text-blue-700">{w.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.2"
                    value={w}
                    onChange={(e) => setWeights((prev) => ({ ...prev, [f.key]: Number(e.target.value) }))}
                    className="w-full accent-blue-700"
                  />
                </label>
              );
            })}

            <label className="block pt-2 border-t border-slate-100">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-slate-800">Decision Threshold</span>
                <span className="font-mono-math font-bold text-slate-900">{threshold.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="8"
                step="0.5"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-slate-900"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={() => {
                setWeights({ ...dataset.defaultWeights });
                setThreshold(dataset.defaultThreshold);
              }}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Reset Starter Rule
            </button>
            <button
              onClick={handleVerifyMastery}
              disabled={accuracyPct < 100}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5" />
              {rewardedIds.includes(dataset.id) ? 'Verified (+LP Awarded)' : 'Verify 100% Rule (+15 LP)'}
            </button>
          </div>
        </div>

        {/* Evaluation Dataset Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Sample Dataset Evaluation Matrix</h4>
          <div className="space-y-2">
            {results.map((row) => (
              <div
                key={row.id}
                className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                  row.correct ? 'border-slate-200 bg-slate-50' : 'border-rose-300 bg-rose-50'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900">{row.title}</div>
                  <div className="font-mono-math text-[11px] text-slate-500 mt-0.5">
                    {Object.entries(row.features)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(' · ')}{' '}
                    → score={row.score}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono-math">
                  <span className="text-slate-600">
                    Pred: <strong>{row.predicted === 1 ? dataset.targetLabel1 : dataset.targetLabel0}</strong>
                  </span>
                  <span className={row.correct ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                    {row.correct ? 'MATCH' : `Expected ${row.actual === 1 ? dataset.targetLabel1 : dataset.targetLabel0}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. NETWORKING CLI SIMULATOR
   ============================================================================ */
interface CliLine {
  id: string;
  kind: 'cmd' | 'out' | 'ok' | 'warn';
  text: string;
}

const KNOWN_HOSTS: Record<string, { ip: string; rtt: number; ttl: number; hops: string[] }> = {
  'techhub.edu': {
    ip: '93.184.216.34',
    rtt: 24,
    ttl: 56,
    hops: ['192.168.1.1 (School Wi-Fi Router)', '10.42.0.1 (City Fiber Gateway)', '1.1.1.1 (Cloudflare DNS)', '172.64.8.12 (ISP Backbone)', '93.184.216.34 (techhub.edu)'],
  },
  '8.8.8.8': {
    ip: '8.8.8.8',
    rtt: 14,
    ttl: 58,
    hops: ['192.168.1.1 (School Wi-Fi Router)', '10.42.0.1 (City Fiber Gateway)', '72.14.215.1 (Google Edge POP)', '8.8.8.8 (dns.google)'],
  },
  '1.1.1.1': {
    ip: '1.1.1.1',
    rtt: 11,
    ttl: 60,
    hops: ['192.168.1.1 (School Wi-Fi Router)', '10.42.0.1 (City Fiber Gateway)', '1.1.1.1 (one.one.one.one)'],
  },
  '192.168.1.1': {
    ip: '192.168.1.1',
    rtt: 2,
    ttl: 64,
    hops: ['192.168.1.1 (Local Wi-Fi Router)'],
  },
};

export const NetworkingCliSim: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [activeHops, setActiveHops] = useState<string[]>([]);
  const [highlightedHop, setHighlightedHop] = useState<number>(-1);
  const [lines, setLines] = useState<CliLine[]>([
    { id: 'init1', kind: 'ok', text: 'TECH HUB Safe Network Shell v2.4 (Simulated Local Sandbox)' },
    { id: 'init2', kind: 'out', text: 'Type "help" or click any command chip below to trace real packet hops.' },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const appendLines = (entries: Omit<CliLine, 'id'>[]) => {
    setLines((prev) => [
      ...prev.slice(-60),
      ...entries.map((e, i) => ({ ...e, id: `${Date.now()}-${i}-${Math.random()}` })),
    ]);
  };

  const animateHops = (hops: string[]) => {
    setActiveHops(hops);
    setHighlightedHop(0);
    hops.forEach((_, idx) => {
      window.setTimeout(() => {
        setHighlightedHop(idx);
      }, idx * 280);
    });
  };

  const executeCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((prev) => [cmd, ...prev].slice(0, 20));
    setHistIdx(-1);
    appendLines([{ kind: 'cmd', text: `kid@techhub:~$ ${cmd}` }]);

    const parts = cmd.split(/\s+/);
    const verb = parts[0].toLowerCase();
    const arg = (parts[1] || '').toLowerCase();

    if (verb === 'clear') {
      setLines([]);
      setActiveHops([]);
      return;
    }

    if (verb === 'help') {
      appendLines([
        { kind: 'ok', text: 'Available Simulated Commands:' },
        { kind: 'out', text: '  ipconfig                  Show your device IPv4, Subnet Mask, Gateway & DNS' },
        { kind: 'out', text: '  ping <host>               Send 3 ICMP echo requests (try techhub.edu or 8.8.8.8)' },
        { kind: 'out', text: '  traceroute <host>         Trace every router hop to destination' },
        { kind: 'out', text: '  nslookup <domain>         Resolve domain name into IPv4 address' },
        { kind: 'out', text: '  arp -a                    Show local MAC-to-IP address table' },
        { kind: 'out', text: '  clear                     Clear terminal output' },
      ]);
      return;
    }

    if (verb === 'ipconfig' || verb === 'ifconfig') {
      appendLines([
        { kind: 'ok', text: 'Interface wlan0 (School Safe Wi-Fi):' },
        { kind: 'out', text: '  IPv4 Address . . . : 192.168.1.42' },
        { kind: 'out', text: '  Subnet Mask  . . . : 255.255.255.0 (/24)' },
        { kind: 'out', text: '  Default Gateway  . : 192.168.1.1' },
        { kind: 'out', text: '  DNS Server . . . . : 1.1.1.1' },
      ]);
      return;
    }

    if (verb === 'arp') {
      appendLines([
        { kind: 'ok', text: 'Local ARP Cache (IPv4 -> Hardware MAC):' },
        { kind: 'out', text: '  192.168.1.1    a4:2b:8c:10:99:01   (Wi-Fi Router Gateway)' },
        { kind: 'out', text: '  192.168.1.10   c8:9f:12:44:7a:20   (Classroom Printer)' },
        { kind: 'out', text: '  192.168.1.42   d2:11:5e:88:3b:14   (Your Workstation)' },
      ]);
      return;
    }

    if (verb === 'nslookup' || verb === 'dig') {
      const target = arg || 'techhub.edu';
      const match = KNOWN_HOSTS[target] || {
        ip: '93.184.216.100',
        rtt: 19,
        ttl: 56,
        hops: KNOWN_HOSTS['techhub.edu'].hops,
      };
      animateHops(['192.168.1.42 (Your PC)', '192.168.1.1 (Router)', '1.1.1.1 (DNS Resolver)']);
      appendLines([
        { kind: 'out', text: 'Server:   one.one.one.one (1.1.1.1)' },
        { kind: 'ok', text: `Name:     ${target}` },
        { kind: 'ok', text: `Address:  ${match.ip} (TTL=300s)` },
      ]);
      return;
    }

    if (verb === 'ping') {
      const target = arg || 'techhub.edu';
      const match = KNOWN_HOSTS[target] || KNOWN_HOSTS['techhub.edu'];
      animateHops(match.hops);
      appendLines([
        { kind: 'out', text: `PING ${target} (${match.ip}): 56 data bytes` },
        { kind: 'ok', text: `64 bytes from ${match.ip}: icmp_seq=1 ttl=${match.ttl} time=${match.rtt}.2 ms` },
        { kind: 'ok', text: `64 bytes from ${match.ip}: icmp_seq=2 ttl=${match.ttl} time=${match.rtt - 1}.8 ms` },
        { kind: 'ok', text: `64 bytes from ${match.ip}: icmp_seq=3 ttl=${match.ttl} time=${match.rtt + 2}.1 ms` },
        { kind: 'out', text: `--- ${target} ping statistics: 3 transmitted, 3 received, 0% packet loss ---` },
      ]);
      return;
    }

    if (verb === 'traceroute' || verb === 'tracert') {
      const target = arg || 'techhub.edu';
      const match = KNOWN_HOSTS[target] || KNOWN_HOSTS['techhub.edu'];
      animateHops(match.hops);
      appendLines([
        { kind: 'out', text: `traceroute to ${target} (${match.ip}), 30 hops max:` },
        ...match.hops.map((hop, idx) => ({
          kind: 'ok' as const,
          text: `  ${idx + 1}   ${hop}   ${(idx + 1) * 4 + 1}.3 ms`,
        })),
      ]);
      return;
    }

    appendLines([
      { kind: 'warn', text: `Command "${verb}" not recognized in sandbox. Type "help" to see supported commands.` },
    ]);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Networking CLI Simulator</h4>
          <p className="text-xs text-slate-500">
            Practice real network diagnostics safely in your browser and watch each packet hop light up.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['ipconfig', 'nslookup techhub.edu', 'ping 8.8.8.8', 'traceroute techhub.edu', 'arp -a', 'help'].map((chip) => (
            <button
              key={chip}
              onClick={() => executeCommand(chip)}
              className="px-2.5 py-1 text-[11px] font-mono-math font-semibold rounded-md border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs font-mono-math text-slate-300">
            <TerminalSquare className="w-4 h-4 text-emerald-400" />
            <span>kid@techhub: ~/net-lab</span>
          </div>

          <div className="p-4 h-72 overflow-y-auto font-mono-math text-xs space-y-1.5">
            {lines.map((l) => (
              <div
                key={l.id}
                className={
                  l.kind === 'cmd'
                    ? 'text-sky-300 font-bold pt-1'
                    : l.kind === 'ok'
                      ? 'text-emerald-400'
                      : l.kind === 'warn'
                        ? 'text-amber-400'
                        : 'text-slate-300'
                }
              >
                {l.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeCommand(input);
              setInput('');
            }}
            className="border-t border-slate-800 px-4 py-2.5 flex items-center gap-2 bg-slate-900/60"
          >
            <span className="font-mono-math text-xs text-emerald-400 font-bold shrink-0">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' && history.length > 0) {
                  e.preventDefault();
                  const next = Math.min(history.length - 1, histIdx + 1);
                  setHistIdx(next);
                  setInput(history[next]);
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const next = histIdx - 1;
                  if (next < 0) {
                    setHistIdx(-1);
                    setInput('');
                  } else {
                    setHistIdx(next);
                    setInput(history[next]);
                  }
                }
              }}
              placeholder="Type a command (e.g. traceroute techhub.edu)..."
              className="flex-1 bg-transparent text-xs font-mono-math text-white focus:outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold rounded bg-blue-700 text-white hover:bg-blue-600"
            >
              Run
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-700" />
            <h4 className="text-sm font-bold text-slate-900">Packet Hop Path Visualizer</h4>
          </div>
          {activeHops.length === 0 ? (
            <p className="text-xs text-slate-500 leading-relaxed">
              Run <code className="font-mono-math text-slate-800">ping</code>, <code className="font-mono-math text-slate-800">traceroute</code>, or{' '}
              <code className="font-mono-math text-slate-800">nslookup</code> to animate each router hop live.
            </p>
          ) : (
            <div className="space-y-2">
              {activeHops.map((hop, idx) => {
                const active = idx <= highlightedHop;
                return (
                  <div
                    key={hop}
                    className={`p-3 rounded-lg border text-xs transition-all ${
                      active ? 'bg-blue-50 border-blue-600 text-slate-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] font-mono-math text-blue-700">HOP {idx + 1}</div>
                    <div>{hop}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. CYBER CAPTURE-THE-FLAG (CTF) MISSIONS (CLASSES 1-9)
   ============================================================================ */
interface CtfMission {
  id: string;
  grade: number;
  title: string;
  category: string;
  briefing: string;
  artifact: string;
  hint: string;
  flag: string;
  rewardLp: number;
}

const CTF_MISSIONS: CtfMission[] = [
  {
    id: 'ctf-g1-phish',
    grade: 1,
    title: 'Mission 1: Spot the Fake School Link',
    category: 'Phishing Defense',
    briefing: 'A tricky pop-up pretends to be your school page! Find the REAL safe address versus the lookalike trap.',
    artifact: '1) http://techhUb-free-gems.tk\n2) https://classroom.techhub.edu\n3) http://paypa1-prizes.xyz\n\nEnter flag format: TECH{PHISH_SPOTTED}',
    hint: 'Copy the exact flag shown at the bottom of the briefing after checking which link uses https://classroom.techhub.edu!',
    flag: 'TECH{PHISH_SPOTTED}',
    rewardLp: 45,
  },
  {
    id: 'ctf-g2-caesar',
    grade: 2,
    title: 'Mission 2: Caesar Shift +3 Spy Note',
    category: 'Cryptography',
    briefing: 'Shift every letter BACK by 3 steps in the alphabet to decode this secret message!',
    artifact: 'Ciphertext: WHFK{FDHVDU_QLQMD}\nHint: W -> T, H -> E, F -> C, K -> H',
    hint: 'Decode each letter by moving 3 letters left: F->C, D->A, H->E, V->S, D->A, U->R ...',
    flag: 'TECH{CAESAR_NINJA}',
    rewardLp: 45,
  },
  {
    id: 'ctf-g3-https',
    grade: 3,
    title: 'Mission 3: Encrypted Login Port Check',
    category: 'Transport Security',
    briefing: 'Two servers accept logins: Server A uses unencrypted Port 80 (HTTP), Server B uses encrypted Port 443 (HTTPS). Which protocol+port protects passwords?',
    artifact: 'Format: TECH{PROTOCOL_PORT} using uppercase HTTPS and port number.',
    hint: 'Combine HTTPS and 443 with an underscore inside TECH{...}.',
    flag: 'TECH{HTTPS_443}',
    rewardLp: 45,
  },
  {
    id: 'ctf-g4-subnet',
    grade: 4,
    title: 'Mission 4: IPv4 Subnet Mask Detective',
    category: 'Network Engineering',
    briefing: 'A student tablet has IP 192.168.10.75 with mask /26 (255.255.255.192). Compute the last octet of the Network ID (75 & 192).',
    artifact: '75 in binary = 01001011\n192 in binary = 11000000\nBitwise AND = ?\nFlag format: TECH{NET_<number>}',
    hint: '01000000 in decimal is 64!',
    flag: 'TECH{NET_64}',
    rewardLp: 45,
  },
  {
    id: 'ctf-g5-hash',
    grade: 5,
    title: 'Mission 5: SHA-256 Digest Match',
    category: 'Integrity & Hashing',
    briefing: 'Use the Crypto Lab SHA-256 tool or deduce which secret word ("alpha", "beacon", or "cipher") starts with hash 87f9f...',
    artifact: 'Flag format: TECH{<UPPERCASE_WORD>_HASH}',
    hint: 'Test the word "beacon" in the Cipher & SHA-256 Lab — it begins with 87f9...',
    flag: 'TECH{BEACON_HASH}',
    rewardLp: 45,
  },
  {
    id: 'ctf-g6-sqli',
    grade: 6,
    title: 'Mission 6: Defeat SQL Injection',
    category: 'Web App Security',
    briefing: 'Fix the vulnerable query: "SELECT * FROM kids WHERE name = \'" + input + "\'". Which defensive mechanism treats input purely as data?',
    artifact: 'Choose: CONCATENATION vs PARAMETERIZED\nFlag format: TECH{PARAM_SAFE}',
    hint: 'Parameterized queries separate SQL code from user data! Submit TECH{PARAM_SAFE}.',
    flag: 'TECH{PARAM_SAFE}',
    rewardLp: 45,
  },
  {
    id: 'ctf-g7-syn',
    grade: 7,
    title: 'Mission 7: SYN Flood Log Forensics',
    category: 'Packet Forensics',
    briefing: 'Firewall logs show 12,000 incoming TCP SYN packets/sec with 0 ACK replies, filling the half-open table. Name the stateless defense.',
    artifact: '192.0.2.55 -> 93.184.216.34:443 [SYN] x12000\nFlag format: TECH{SYN_COOKIES}',
    hint: 'Enter TECH{SYN_COOKIES} to deploy cryptographic sequence cookies.',
    flag: 'TECH{SYN_COOKIES}',
    rewardLp: 45,
  },
  {
    id: 'ctf-g8-xss',
    grade: 8,
    title: 'Mission 8: Stop Reflected XSS',
    category: 'Browser Security',
    briefing: 'A comment box executes "<script>alert(1)</script>" because it uses element.innerHTML. Which safe DOM property prevents script execution?',
    artifact: 'Unsafe: div.innerHTML = comment\nSafe: div.textContent = comment\nFlag format: TECH{ESCAPE_XSS}',
    hint: 'Always escape HTML or use textContent. Flag: TECH{ESCAPE_XSS}.',
    flag: 'TECH{ESCAPE_XSS}',
    rewardLp: 45,
  },
  {
    id: 'ctf-g9-jwt',
    grade: 9,
    title: 'Mission 9: Zero-Trust JWT Header Audit',
    category: 'Authentication Architecture',
    briefing: 'Base64 header "eyJhbGciOiJub25lIn0" decodes to {"alg":"none"}. What must a Zero-Trust verifier strictly do?',
    artifact: 'Header decoded: {"alg": "none"}\nFlag format: TECH{REJECT_ALG_NONE}',
    hint: 'Never allow unsigned "none" tokens! Submit TECH{REJECT_ALG_NONE}.',
    flag: 'TECH{REJECT_ALG_NONE}',
    rewardLp: 45,
  },
];

export const CyberCtfMissions: React.FC = () => {
  const { profile, recordCtfSolved } = useUserProfile();
  const solvedFlags = profile.solvedCtfFlags || [];
  const [selectedId, setSelectedId] = useState<string>(CTF_MISSIONS[0].id);
  const [flagInput, setFlagInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const mission = CTF_MISSIONS.find((m) => m.id === selectedId) || CTF_MISSIONS[0];
  const isSolved = solvedFlags.includes(mission.id);

  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (flagInput.trim().toUpperCase() === mission.flag.toUpperCase()) {
      recordCtfSolved(mission.id, mission.rewardLp);
      playTopicCompleteSound();
      setFeedback({ ok: true, msg: `Flag captured! +${mission.rewardLp} LP credited to your profile.` });
      setFlagInput('');
    } else {
      setFeedback({ ok: false, msg: 'Not quite right — inspect the artifact or open the Hint below.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Cyber Capture-The-Flag (CTF) Ethical Missions</h4>
          <p className="text-xs text-slate-500">
            Solve defensive security puzzles across Classes 1–9 to capture Mission Flags and earn +45 LP each.
          </p>
        </div>
        <div className="font-mono-math text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
          Flags Captured: {solvedFlags.length} / {CTF_MISSIONS.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 space-y-1.5">
          {CTF_MISSIONS.map((m) => {
            const done = solvedFlags.includes(m.id);
            const active = m.id === mission.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedId(m.id);
                  setShowHint(false);
                  setFeedback(null);
                  setFlagInput('');
                }}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="min-w-0">
                  <div className={`text-[10px] font-mono-math ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                    Class {m.grade} · {m.category}
                  </div>
                  <div className="font-semibold truncate">{m.title}</div>
                </div>
                {done && (
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-400' : 'text-emerald-600'}`} />
                )}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-mono-math text-blue-700 font-semibold">
                Class {mission.grade} · {mission.category} · +{mission.rewardLp} LP
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{mission.title}</h3>
            </div>
            {isSolved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                <ShieldCheck className="w-4 h-4" /> Flag Captured
              </span>
            )}
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{mission.briefing}</p>

          <pre className="bg-slate-950 text-emerald-300 rounded-xl p-4 font-mono-math text-xs overflow-x-auto leading-relaxed">
            {mission.artifact}
          </pre>

          <form onSubmit={handleSubmitFlag} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="Enter flag e.g. TECH{...}"
              className="flex-1 px-3.5 py-2.5 text-xs font-mono-math border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 whitespace-nowrap shrink-0"
            >
              <Flag className="w-3.5 h-3.5" /> Submit Flag
            </button>
          </form>

          {feedback && (
            <div
              className={`p-3 rounded-lg border text-xs font-medium ${
                feedback.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.msg}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowHint((h) => !h)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              {showHint ? 'Hide Mission Hint' : 'Need a Clue? Show Hint'}
            </button>
            {showHint && (
              <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 mt-2">
                {mission.hint}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
