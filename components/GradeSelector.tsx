import React, { useState } from 'react';
import { ArrowRight, Award, Cpu, FlaskConical, Search, Terminal, Users } from 'lucide-react';
import { ALL_MODULES, findModuleById } from '../data/curriculum';
import type { CurriculumModule, SandboxTabKind } from '../types';

const HERO_IMAGE_URL = new URL('../src/assets/images/tech_hub_hero_1795693277942.jpg', import.meta.url).href;
const AI_LAB_IMAGE_URL = new URL('../src/assets/images/lab_ai_network_1795693278093.jpg', import.meta.url).href;
const CYBER_LAB_IMAGE_URL = new URL('../src/assets/images/lab_cyber_shield_1795693278793.jpg', import.meta.url).href;

interface GradeSelectorProps {
  onSelectGrade: (grade: number) => void;
  onSelectModule: (mod: CurriculumModule) => void;
  onOpenSimulations: () => void;
  onOpenSimTab?: (tab: SandboxTabKind) => void;
  onOpenCapstones?: () => void;
  onOpenClassroom?: () => void;
  onOpenSearch: () => void;
}

const CLASS_DETAILS: { grade: number; tier: string; focus: string }[] = [
  { grade: 1, tier: 'Explorer (Ages 6–7)', focus: 'Smart sensors, pixels, wires vs. Wi-Fi, packet postcards, strong passwords & pop-up traps' },
  { grade: 2, tier: 'Explorer (Ages 7–8)', focus: 'Training datasets, binary beacons, IP addresses, TCP handshakes, Caesar shift ciphers' },
  { grade: 3, tier: 'Builder (Ages 8–9)', focus: 'Artificial neurons, 3×3 vision edges, OSI layers, MAC switches, SHA-256 hashing & XSS safety' },
  { grade: 4, tier: 'Builder (Ages 9–10)', focus: 'Linear regression, K-means, IPv4 CIDR subnets, DNS records, public-key crypto & PKI' },
  { grade: 5, tier: 'Engineer (Ages 10–11)', focus: 'Multi-layer neural nets, gradient descent, OSPF routing, QUIC, RSA primes & OWASP Top 10' },
  { grade: 6, tier: 'Engineer (Ages 11–12)', focus: 'Backpropagation, Transformers, BGP routing, TLS 1.3, elliptic curves & zero-knowledge proofs' },
  { grade: 7, tier: 'Honors (Ages 12–13)', focus: 'Matrix backprop, YOLO vision, agent sandboxes, SYN cookies, HTTP/3 & threat hunting' },
  { grade: 8, tier: 'Honors (Ages 13–14)', focus: 'FlashAttention, diffusion models, Raft consensus, eBPF/XDP, post-quantum LWE & fuzzing' },
  { grade: 9, tier: 'Junior Architect (Ages 14–15)', focus: 'RLHF & interpretability, M/M/1 network calculus, PBFT, zk-SNARKs & hardware roots of trust' },
];

const FEATURED_MODULES = [
  {
    moduleId: 'ai-g3-u3-m1',
    discipline: 'Artificial Intelligence · Class 3',
    title: 'Inputs, Weights & Importance Dials',
    desc: 'Discover how an artificial neuron weighs clues like wind speed and storm clouds to make smart decisions.',
  },
  {
    moduleId: 'networking-g2-u6-m3',
    discipline: 'Computer Networking · Class 2',
    title: 'The Friendly Three-Way Handshake',
    desc: 'Trace SYN, SYN-ACK, and ACK packets step by step to see how computers say hello reliably.',
  },
  {
    moduleId: 'cybersecurity-g3-u1-m2',
    discipline: 'Cybersecurity · Class 3',
    title: 'The Avalanche Effect in SHA-256',
    desc: 'See how one-way digital fingerprints scramble 50% of their bits when a single letter changes.',
  },
];

const GradeSelector: React.FC<GradeSelectorProps> = ({
  onSelectGrade,
  onSelectModule,
  onOpenSimulations,
  onOpenSimTab,
  onOpenCapstones,
  onOpenClassroom,
  onOpenSearch,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [netImgFailed, setNetImgFailed] = useState(false);
  const [cyberImgFailed, setCyberImgFailed] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10 space-y-14">
      {/* VOI HUB product hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-8 sm:p-10">
          <div className="space-y-4">
            <div className="text-xs font-semibold text-blue-700">
              Classes 1–9 · Artificial Intelligence · Networking · Cybersecurity
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
              VOI HUB for Kids: AI, Networking &amp; Cyber Defense.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Master {ALL_MODULES.length.toLocaleString()} structured modules across all 9 classes—from Class 1 visual puzzles to Class 9 architecture—paired with live neural-network, packet-router, and cryptography labs built for young learners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-8">
            <button
              onClick={() => onSelectGrade(3)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Start Class 3 Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSimulations}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <FlaskConical className="w-4 h-4 text-blue-700" />
              <span>Open Live Tech Labs</span>
            </button>
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search All Classes</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          {!heroImgFailed ? (
            <img
              src={HERO_IMAGE_URL}
              alt="Kids technology laboratory showing neural network sphere, fiber optic routing pathways, and security padlock shield"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="w-full h-full min-h-[280px] object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[280px] bg-slate-100 flex flex-col items-center justify-center p-8 text-center">
              <Cpu className="w-10 h-10 text-blue-700 mb-3" />
              <div className="text-sm font-bold text-slate-900">VOI HUB · Classes 1–9</div>
              <p className="text-xs text-slate-500 mt-1">AI, Networking &amp; Cybersecurity · 864 Modules</p>
            </div>
          )}
        </div>
      </section>

      {/* 4-Column Quantitative Proof Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-slate-500">Total Tech Modules</div>
          <div className="text-3xl font-extrabold font-mono-math text-slate-900 mt-1">
            {ALL_MODULES.length.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">96 modules per class (Classes 1–9)</div>
        </div>
        <button
          onClick={() => (onOpenSimTab ? onOpenSimTab('sandbox-net-cli') : onOpenSimulations())}
          className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-blue-700 transition-colors"
        >
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-700" /> Interactive Labs &amp; Terminals
          </div>
          <div className="text-3xl font-extrabold font-mono-math text-blue-700 mt-1">9</div>
          <div className="text-xs text-slate-500 mt-1">AI Mini-Lab, Network CLI &amp; CTF Missions</div>
        </button>
        <button
          onClick={onOpenCapstones}
          className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-blue-700 transition-colors"
        >
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-700" /> Capstones &amp; Certificates
          </div>
          <div className="text-3xl font-extrabold font-mono-math text-emerald-700 mt-1">9</div>
          <div className="text-xs text-slate-500 mt-1">Class 1–9 Builders &amp; Printable SVG Diplomas</div>
        </button>
        <button
          onClick={onOpenClassroom}
          className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-blue-700 transition-colors"
        >
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-900" /> Classroom &amp; Family Sync
          </div>
          <div className="text-3xl font-extrabold font-mono-math text-slate-900 mt-1">3 Roles</div>
          <div className="text-xs text-slate-500 mt-1">Student, Teacher &amp; Parent Cloud Mode</div>
        </button>
      </section>

      {/* Class 1-9 Directory */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Select Your Class (Classes 1–9)</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Every class teaches Artificial Intelligence, Computer Networking, and Cybersecurity tailored to your level.
            </p>
          </div>
          <span className="text-xs font-mono-math text-slate-500">96 modules / class</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLASS_DETAILS.map((item) => (
            <button
              key={item.grade}
              onClick={() => onSelectGrade(item.grade)}
              className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-blue-700 hover:shadow-sm transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{item.tier}</span>
                  <span className="font-mono-math">24 units · 96 modules</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-blue-700 transition-colors">
                  Class {item.grade}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.focus}</p>
              </div>
              <div className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1">
                <span>Open Class {item.grade} Tracks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Reference Monographs & Visual Plates */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Kids Tech Monographs &amp; Labs</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Jump straight into built-in deep lessons with kid-friendly analogies, real engineering math, flashcards, and 5-tier exams.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FEATURED_MODULES.map((feat) => {
            const mod = findModuleById(feat.moduleId);
            if (!mod) return null;
            return (
              <button
                key={feat.moduleId}
                onClick={() => onSelectModule(mod)}
                className="bg-white border border-slate-200 rounded-xl p-6 text-left hover:border-blue-700 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">{feat.discipline} · Built-In Compendium</div>
                  <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
                <span className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1">
                  Open Deep Lesson <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch">
            <div className="sm:col-span-5 bg-slate-100">
              {!netImgFailed ? (
                <img
                  src={AI_LAB_IMAGE_URL}
                  alt="Network packets traveling between servers and an artificial intelligence neural network"
                  referrerPolicy="no-referrer"
                  onError={() => setNetImgFailed(true)}
                  className="w-full h-full min-h-[180px] object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[180px] flex items-center justify-center text-xs text-slate-500">AI &amp; Networking Lab</div>
              )}
            </div>
            <div className="sm:col-span-7 p-5 flex flex-col justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500">AI &amp; Networking Workbench</div>
                <h3 className="text-base font-bold text-slate-900 mt-1">Neural Neurons, Vision Kernels &amp; Live Packets</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Train a 2D neuron live, test 3×3 image edge detectors, and watch DNS + TCP three-way handshakes cross router hops.
                </p>
              </div>
              <button
                onClick={onOpenSimulations}
                className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1 self-start"
              >
                Launch AI &amp; Packet Labs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch">
            <div className="sm:col-span-5 bg-slate-100">
              {!cyberImgFailed ? (
                <img
                  src={CYBER_LAB_IMAGE_URL}
                  alt="Cybersecurity digital shield with cipher rings, keys, and safe devices"
                  referrerPolicy="no-referrer"
                  onError={() => setCyberImgFailed(true)}
                  className="w-full h-full min-h-[180px] object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[180px] flex items-center justify-center text-xs text-slate-500">Cyber Shield Lab</div>
              )}
            </div>
            <div className="sm:col-span-7 p-5 flex flex-col justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500">Cybersecurity Defense Sandbox</div>
                <h3 className="text-base font-bold text-slate-900 mt-1">Ciphers, SHA-256 Avalanche &amp; Firewalls</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Test Caesar shift wheels, watch real SHA-256 hashes scramble live, and configure firewall rules to stop SQLi and XSS traffic.
                </p>
              </div>
              <button
                onClick={onOpenSimulations}
                className="text-xs font-semibold text-blue-700 inline-flex items-center gap-1 self-start"
              >
                Launch Cyber Defense Lab <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GradeSelector;