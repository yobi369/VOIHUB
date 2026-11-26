import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, Download, Printer, Sparkles } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';
import { playLevelUpSound, playTopicCompleteSound } from '../services/audioService';

interface CapstoneProject {
  id: string;
  grade: number;
  track: 'Artificial Intelligence' | 'Computer Networking' | 'Cybersecurity & Defense';
  title: string;
  scenario: string;
  components: { id: string; label: string; role: string }[];
  checklist: string[];
  lpReward: number;
}

const CAPSTONES: CapstoneProject[] = [
  {
    id: 'cap-g1-sensors',
    grade: 1,
    track: 'Artificial Intelligence',
    title: 'Class 1 Capstone: Smart Classroom Helper Robot',
    scenario: 'Design an AI helper robot that organizes books safely and listens only when you say its wake word.',
    components: [
      { id: 'c1-cam', label: 'Color Pixel Camera', role: 'Reads book cover colors' },
      { id: 'c1-mic', label: 'Wake-Word Microphone', role: 'Stays muted until trigger phrase' },
      { id: 'c1-bump', label: 'Soft Safety Bumper', role: 'Stops motors instantly on touch' },
      { id: 'c1-tree', label: '3-Step Yes/No Tree', role: 'Sorts Math, Reading, and Art bins' },
    ],
    checklist: [
      'Pick sensors that see and hear without recording private chatter',
      'Label 20 practice book cards clearly so the robot does not guess blindly',
      'Test a manual emergency Stop button for humans',
    ],
    lpReward: 120,
  },
  {
    id: 'cap-g2-packet',
    grade: 2,
    track: 'Computer Networking',
    title: 'Class 2 Capstone: Safe Home Postcard Route',
    scenario: 'Map how your tablet sends a homework question to a science library server and gets a reliable reply back.',
    components: [
      { id: 'c2-ip', label: 'Home Private IP (192.168.1.42)', role: 'Addresses your tablet' },
      { id: 'c2-dns', label: 'DNS Phonebook (1.1.1.1)', role: 'Translates school.edu into an IP' },
      { id: 'c2-tcp', label: 'TCP 3-Way Handshake', role: 'SYN -> SYN-ACK -> ACK reliability' },
      { id: 'c2-caesar', label: 'Secret Shift Wrapper', role: 'Scrambles message envelopes' },
    ],
    checklist: [
      'Translate the website name using DNS before mailing packets',
      'Check packet sequence numbers so no homework page arrives out of order',
      'Verify the return address before opening downloaded files',
    ],
    lpReward: 120,
  },
  {
    id: 'cap-g3-wifi',
    grade: 3,
    track: 'Computer Networking',
    title: 'Class 3 Capstone: Design a Safe School Wi-Fi Map',
    scenario: 'Architect a segmented Wi-Fi layout for students, teachers, and printers with strong WPA3 encryption and DNS filtering.',
    components: [
      { id: 'c3-vlan-stu', label: 'Student Wi-Fi VLAN', role: 'Isolates kid tablets from staff servers' },
      { id: 'c3-wpa3', label: 'WPA3 Passphrase Shield', role: 'Encrypts radio waves in the classroom' },
      { id: 'c3-dns-safe', label: 'Safe-Search DNS Filter', role: 'Blocks phishing & malware domains' },
      { id: 'c3-fw', label: 'Firewall Port 80 Block', role: 'Requires HTTPS (443) for logins' },
    ],
    checklist: [
      'Separate Student Tablets and Teacher Gradebook onto isolated VLANs',
      'Enable WPA3 instead of open guest Wi-Fi',
      'Verify Firewall blocks unprotected port 80 logins',
    ],
    lpReward: 120,
  },
  {
    id: 'cap-g4-subnet',
    grade: 4,
    track: 'Computer Networking',
    title: 'Class 4 Capstone: Campus IPv4 Subnet & PKI Plan',
    scenario: 'Split a 192.168.10.0/24 network into 4 subnets (/26) for Robotics, Library, Admin, and Guest labs with HTTPS locks.',
    components: [
      { id: 'c4-sub1', label: 'Subnet A: 192.168.10.0/26', role: '62 usable host seats for Library' },
      { id: 'c4-sub2', label: 'Subnet B: 192.168.10.64/26', role: '62 usable seats for Robotics Lab' },
      { id: 'c4-pki', label: 'TLS Certificate Chain', role: 'Verifies genuine school portals' },
      { id: 'c4-arp', label: 'Switch Port Security', role: 'Locks MAC spoofing attempts' },
    ],
    checklist: [
      'Compute network ID and broadcast address for /26 masks accurately',
      'Verify TLS padlock certificate chain on classroom portal',
      'Ensure guest traffic cannot route into Robotics subnet',
    ],
    lpReward: 120,
  },
  {
    id: 'cap-g5-vision',
    grade: 5,
    track: 'Artificial Intelligence',
    title: 'Class 5 Capstone: Multi-Layer Leaf Disease Classifier',
    scenario: 'Combine 3x3 edge-detection filters and gradient-descent training to classify healthy vs. spotted plant leaves offline.',
    components: [
      { id: 'c5-conv', label: '3×3 Edge Kernel Bank', role: 'Detects spots and leaf veins' },
      { id: 'c5-relu', label: 'ReLU Hidden Layer', role: 'Adds non-linear shape curves' },
      { id: 'c5-split', label: '80/20 Train-Test Split', role: 'Checks real generalization score' },
      { id: 'c5-loss', label: 'Cross-Entropy Monitor', role: 'Stops training before overfitting' },
    ],
    checklist: [
      'Keep unseen test photos completely separate from training folds',
      'Check precision and recall across shaded and sunny photos',
      'Document model limitations clearly on a Model Card',
    ],
    lpReward: 120,
  },
  {
    id: 'cap-g6-spam',
    grade: 6,
    track: 'Artificial Intelligence',
    title: 'Class 6 Capstone: Build an AI Spam & Phishing Filter',
    scenario: 'Design an NLP + cybersecurity pipeline combining token embeddings, domain reputation, and TLS verification to guard kids’ inboxes.',
    components: [
      { id: 'c6-tok', label: 'Subword Tokenizer + Attention', role: 'Reads urgent urgency cues safely' },
      { id: 'c6-spf', label: 'SPF / DKIM Sender Check', role: 'Verifies cryptographic sender identity' },
      { id: 'c6-url', label: 'Homoglyph URL Scanner', role: 'Catches lookalike domains like g00gle' },
      { id: 'c6-quarantine', label: 'Safe Quarantine Vault', role: 'Blocks auto-loading tracking pixels' },
    ],
    checklist: [
      'Combine AI probability score with deterministic SPF/DKIM checks',
      'Keep false positives low so real teacher emails arrive safely',
      'Test adversarial typos ("fr33 pr1ze") against tokenizer rules',
    ],
    lpReward: 120,
  },
  {
    id: 'cap-g7-soc',
    grade: 7,
    track: 'Cybersecurity & Defense',
    title: 'Class 7 Capstone: School SOC Intrusion Response Playbook',
    scenario: 'Respond to an alert storm showing SYN bursts, SQLi probes, and suspicious outbound DNS beacons.',
    components: [
      { id: 'c7-syn', label: 'SYN Cookies Mitigation', role: 'Drops spoofed half-open floods' },
      { id: 'c7-waf', label: 'Parameterized Query Patch', role: 'Neutralizes SQLi in login form' },
      { id: 'c7-dns', label: 'DNS Egress Sinkhole', role: 'Halts suspicious beacon domain' },
      { id: 'c7-rot', label: 'Session Key Rotation', role: 'Invalidates compromised tokens' },
    ],
    checklist: [
      'Triage critical alerts without shutting down valid student exams',
      'Preserve packet captures with SHA-256 chain-of-custody hashes',
      'Patch root cause before restoring public traffic',
    ],
    lpReward: 120,
  },
  {
    id: 'cap-g8-raft',
    grade: 8,
    track: 'Computer Networking',
    title: 'Class 8 Capstone: Fault-Tolerant Raft & TLS 1.3 Mesh',
    scenario: 'Architect a 5-node distributed classroom vault that survives 2 server outages with encrypted node-to-node traffic.',
    components: [
      { id: 'c8-quorum', label: '5-Node Raft Quorum (3/5)', role: 'Tolerates up to 2 offline nodes' },
      { id: 'c8-mtls', label: 'Mutual TLS 1.3 Channels', role: 'Forward-secure encrypted replication' },
      { id: 'c8-ebpf', label: 'eBPF/XDP Packet Filter', role: 'Drops malformed flood packets at NIC' },
      { id: 'c8-pqc', label: 'Hybrid ML-KEM Key Exchange', role: 'Harvest-now-decrypt-later protection' },
    ],
    checklist: [
      'Verify Raft leader election avoids split-brain writes',
      'Confirm forward secrecy with ephemeral ECDHE + ML-KEM keys',
      'Benchmark failover latency under simulated packet loss',
    ],
    lpReward: 120,
  },
  {
    id: 'cap-g9-zerotrust',
    grade: 9,
    track: 'Cybersecurity & Defense',
    title: 'Class 9 Capstone: Zero-Trust System Blueprint',
    scenario: 'Design an end-to-end Zero-Trust AI + Cloud Network enforcing least privilege, hardware attestation, and verified Firestore rules.',
    components: [
      { id: 'c9-tpm', label: 'Hardware Root of Trust', role: 'Attests device & OS boot integrity' },
      { id: 'c9-rbac', label: 'Zero-Trust Firestore ABAC Rules', role: 'Denies shadow updates & ID spoofing' },
      { id: 'c9-llm', label: 'Prompt-Injection Sandbox', role: 'Isolates untrusted tool inputs' },
      { id: 'c9-zk', label: 'Privacy-Preserving Audit Log', role: 'Tamper-evident hash chain' },
    ],
    checklist: [
      'Never trust network location alone—verify identity on every request',
      'Enforce strict allowlists and immutable ownership on all writes',
      'Isolate AI tool execution inside least-privilege sandboxes',
    ],
    lpReward: 120,
  },
];

const CapstonesAndCertificates: React.FC = () => {
  const { profile, recordCapstoneComplete } = useUserProfile();
  const completedCapstones = profile.completedCapstones || [];

  const [selectedId, setSelectedId] = useState<string>(CAPSTONES[2].id); // Default Class 3 Safe Wi-Fi Map
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string[]>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean[]>>({});
  const [notesByCapstone, setNotesByCapstone] = useState<Record<string, string>>({});

  const capstone = useMemo(
    () => CAPSTONES.find((c) => c.id === selectedId) || CAPSTONES[0],
    [selectedId]
  );

  const pickedComps = selectedComponents[capstone.id] || [];
  const stepChecks = checkedSteps[capstone.id] || capstone.checklist.map(() => false);
  const reflection = notesByCapstone[capstone.id] || '';
  const isCompleted = completedCapstones.includes(capstone.id);

  const readyToMint = pickedComps.length >= 3 && stepChecks.every(Boolean);

  const toggleComp = (compId: string) => {
    setSelectedComponents((prev) => {
      const current = prev[capstone.id] || [];
      const next = current.includes(compId)
        ? current.filter((x) => x !== compId)
        : [...current, compId];
      return { ...prev, [capstone.id]: next };
    });
  };

  const toggleCheck = (idx: number) => {
    setCheckedSteps((prev) => {
      const current = prev[capstone.id] || capstone.checklist.map(() => false);
      const next = current.map((v, i) => (i === idx ? !v : v));
      return { ...prev, [capstone.id]: next };
    });
  };

  const handleMintCertificate = () => {
    if (!readyToMint && !isCompleted) return;
    recordCapstoneComplete(capstone.id, capstone.lpReward);
    playTopicCompleteSound();
    playLevelUpSound();
  };

  const certId = `TH-C${capstone.grade}-${capstone.id.toUpperCase()}-${profile.level}L`;
  const issuedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const buildCertificateSvg = () => {
    const safeName = (profile.name || 'Scholar').replace(/[<>&"]/g, '');
    const safeTitle = capstone.title.replace(/[<>&"]/g, '');
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="680" viewBox="0 0 1000 680">
  <rect width="1000" height="680" fill="#F8FAFC"/>
  <rect x="24" y="24" width="952" height="632" rx="16" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="6"/>
  <rect x="40" y="40" width="920" height="600" rx="10" fill="none" stroke="#CBD5E1" stroke-width="2"/>
  <text x="500" y="105" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#1D4ED8" letter-spacing="4">TECH HUB ACADEMY · CLASSES 1–9</text>
  <text x="500" y="165" text-anchor="middle" font-family="serif" font-size="42" font-weight="700" fill="#0F172A">Certificate of Engineering Mastery</text>
  <text x="500" y="220" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#475569">Proudly awarded to</text>
  <text x="500" y="290" text-anchor="middle" font-family="serif" font-size="46" font-weight="700" fill="#1D4ED8">${safeName}</text>
  <line x1="220" y1="312" x2="780" y2="312" stroke="#CBD5E1" stroke-width="2"/>
  <text x="500" y="362" text-anchor="middle" font-family="sans-serif" font-size="17" fill="#334155">For completing the Class ${capstone.grade} ${capstone.track} Capstone Blueprint:</text>
  <text x="500" y="408" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="700" fill="#0F172A">${safeTitle}</text>
  <rect x="240" y="455" width="520" height="64" rx="10" fill="#EFF6FF" stroke="#BFDBFE"/>
  <text x="500" y="484" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="#1E40AF">Level ${profile.level} · ${profile.lp} LP · ${profile.badges.length} Badges · ${profile.solvedCtfFlags?.length || 0} CTF Flags</text>
  <text x="500" y="505" text-anchor="middle" font-family="monospace" font-size="12" fill="#475569">Verification ID: ${certId}</text>
  <text x="160" y="590" font-family="sans-serif" font-size="14" fill="#475569">Issued: ${issuedDate}</text>
  <text x="840" y="590" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="700" fill="#0F172A">TECH HUB Curriculum Board</text>
</svg>`;
  };

  const handleDownloadSvg = () => {
    const svgText = buildCertificateSvg();
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-hub-class-${capstone.grade}-certificate.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:hidden">
        <div>
          <div className="text-xs font-semibold text-blue-700">Proposal 3 · Hands-On Capstones &amp; Diplomas</div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Capstone Builders &amp; Printable Certificates
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Build real Class 1–9 AI, Networking, and Security architectures to earn +120 LP and export verified certificates.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-right">
          <div className="text-xs text-slate-500">Capstones Completed</div>
          <div className="text-xl font-bold font-mono-math text-blue-700">
            {completedCapstones.length} / {CAPSTONES.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Capstone Selector */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 space-y-1.5 print:hidden">
          {CAPSTONES.map((c) => {
            const done = completedCapstones.includes(c.id);
            const active = c.id === capstone.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="min-w-0">
                  <div className={`text-[10px] font-mono-math ${active ? 'text-blue-300' : 'text-blue-700'}`}>
                    Class {c.grade} · {c.track}
                  </div>
                  <div className="font-semibold truncate">{c.title}</div>
                </div>
                {done && <CheckCircle2 className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-400' : 'text-emerald-600'}`} />}
              </button>
            );
          })}
        </aside>

        {/* Right Interactive Builder + Live Certificate */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 print:hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-mono-math text-blue-700 font-semibold">
                  Class {capstone.grade} · {capstone.track} · +{capstone.lpReward} LP
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{capstone.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{capstone.scenario}</p>
              </div>
              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                  <Award className="w-4 h-4" /> Completed
                </span>
              )}
            </div>

            {/* Step 1: Select Architecture Blocks */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-800">
                1. Select Architecture Modules ({pickedComps.length}/4 selected — pick at least 3)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {capstone.components.map((comp) => {
                  const chosen = pickedComps.includes(comp.id);
                  return (
                    <button
                      key={comp.id}
                      onClick={() => toggleComp(comp.id)}
                      className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                        chosen
                          ? 'bg-blue-50 border-blue-700 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{comp.label}</span>
                        {chosen && <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{comp.role}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Engineering Checklist */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-800">2. Verify Safety &amp; Design Checkpoints</div>
              <div className="space-y-2">
                {capstone.checklist.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer text-xs text-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(stepChecks[idx])}
                      onChange={() => toggleCheck(idx)}
                      className="mt-0.5 accent-blue-700 w-4 h-4"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Reflection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                3. Your Design Notes (Optional — included in your record)
              </label>
              <textarea
                rows={2}
                value={reflection}
                onChange={(e) => setNotesByCapstone((prev) => ({ ...prev, [capstone.id]: e.target.value }))}
                placeholder="Explain in 1-2 sentences why you chose these components..."
                className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {isCompleted
                  ? 'Certificate unlocked! Download SVG or Print PDF below.'
                  : readyToMint
                    ? 'All design checks passed — ready to mint your certificate!'
                    : 'Pick at least 3 blocks and check all 3 checkpoints above.'}
              </span>
              <button
                onClick={handleMintCertificate}
                disabled={!readyToMint && !isCompleted}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4" />
                {isCompleted ? 'Certificate Unlocked' : `Complete Capstone (+${capstone.lpReward} LP)`}
              </button>
            </div>
          </div>

          {/* Printable Certificate Preview */}
          <div className="bg-white border-4 border-blue-700 rounded-2xl p-8 sm:p-10 text-center space-y-5 shadow-sm">
            <div className="text-xs font-mono-math font-bold tracking-[0.25em] text-blue-700 uppercase">
              TECH HUB Academy · Classes 1–9
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif-prose font-bold text-slate-900">
              Certificate of Engineering Mastery
            </h3>
            <p className="text-sm text-slate-500">This certifies that</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-700 border-b-2 border-slate-200 pb-3 max-w-md mx-auto">
              {profile.name}
            </div>
            <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              has designed and verified the Class {capstone.grade} {capstone.track} Capstone Blueprint:{' '}
              <strong className="text-slate-900">{capstone.title}</strong>
            </p>
            {reflection.trim() && (
              <p className="text-xs italic text-slate-600 max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
                &ldquo;{reflection.trim()}&rdquo;
              </p>
            )}
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 font-mono-math text-xs text-blue-900">
              Level {profile.level} · {profile.lp} LP · {profile.badges.length} Specialist Badges · {profile.solvedCtfFlags?.length || 0} CTF Flags
              <div className="text-[11px] text-slate-600 mt-0.5">Verification ID: {certId}</div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
              <span>Issued {issuedDate}</span>
              <span className="font-semibold text-slate-800">TECH HUB Curriculum Board</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 print:hidden">
              <button
                onClick={handleDownloadSvg}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5" /> Download SVG Diploma
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CapstonesAndCertificates;
