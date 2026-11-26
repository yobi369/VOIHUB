import React, { useState } from 'react';
import type { SimulationKind } from '../types';

interface ConceptDiagramProps {
  simType: SimulationKind;
  topic: string;
  grade: number;
  subjectName: string;
}

const ConceptDiagram: React.FC<ConceptDiagramProps> = ({ simType, topic, grade, subjectName }) => {
  const [stage, setStage] = useState<number>(0);

  const isAi = simType === 'ai-perceptron' || simType === 'ai-vision';
  const isNet = simType === 'net-packets' || simType === 'net-binary';

  const stages = isAi
    ? [
        { title: '1. Inputs (Clues)', desc: 'Sensors or numbers (like pixels, clouds, or words) enter as numerical values x₁, x₂, x₃.' },
        { title: '2. Weights (Importance)', desc: 'Each clue is multiplied by a learned importance weight (w₁, w₂, w₃). Strong clues matter more.' },
        { title: '3. Sum & Threshold', desc: 'All weighted signals add up with bias b and pass an activation gate to decide.' },
        { title: '4. Prediction & Check', desc: 'The model outputs its guess ŷ, compares against the true label, and adjusts weights to improve.' },
      ]
    : isNet
      ? [
          { title: '1. Payload Split', desc: 'Large files and messages are sliced into tiny numbered packets with sequence IDs.' },
          { title: '2. IP & Port Envelope', desc: 'Each packet carries Source IP, Destination IP, Port (like 443), and a Time-To-Live (TTL) hop limit.' },
          { title: '3. DNS & Router Hops', desc: 'DNS translates names to IPs while routers forward packets along the fastest healthy fiber link.' },
          { title: '4. Reassembly & ACK', desc: 'The destination verifies every sequence number, replies ACK, and rebuilds the exact original file.' },
        ]
      : [
          { title: '1. Raw Data Check', desc: 'Sensitive logins or messages start as readable plaintext that attackers could read if unprotected.' },
          { title: '2. Key / SHA-256 Mixer', desc: 'Encryption scrambles data with a secret key; SHA-256 creates a unique 256-bit one-way fingerprint.' },
          { title: '3. Firewall & WAF Gate', desc: 'Security rules allow safe HTTPS (443) traffic while blocking Port 80 plaintext, SQLi, and XSS.' },
          { title: '4. Verified Safe State', desc: 'Only authenticated, intact, and authorized requests reach the protected application vault.' },
        ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="text-[11px] font-bold text-blue-700">
            Interactive Visual Concept Map · Class {grade} {subjectName}
          </div>
          <h3 className="text-base font-bold text-slate-900">How &ldquo;{topic}&rdquo; Works Step by Step</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {stages.map((s, idx) => (
            <button
              key={s.title}
              onClick={() => setStage(idx)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                stage === idx
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto">
        {isAi && (
          <svg viewBox="0 0 760 200" className="w-full min-w-[540px] h-44">
            {/* Edges */}
            {[45, 100, 155].map((y, idx) => (
              <g key={idx}>
                <line
                  x1="150"
                  y1={y}
                  x2="375"
                  y2="100"
                  stroke={stage === 1 ? '#1D4ED8' : '#94A3B8'}
                  strokeWidth={stage === 1 ? '3.5' : '2'}
                />
                <text x="255" y={y < 100 ? y + 12 : y === 100 ? 92 : y - 6} fontSize="11" fontFamily="monospace" fill="#1E293B">
                  w{idx + 1}
                </text>
              </g>
            ))}
            <line
              x1="435"
              y1="100"
              x2="600"
              y2="100"
              stroke={stage >= 2 ? '#059669' : '#94A3B8'}
              strokeWidth={stage >= 2 ? '3.5' : '2'}
            />

            {/* Input Nodes */}
            {['x₁ Input', 'x₂ Input', 'x₃ Input'].map((lbl, idx) => {
              const cy = [45, 100, 155][idx];
              const lit = stage === 0;
              return (
                <g key={lbl}>
                  <rect
                    x="30"
                    y={cy - 18}
                    width="120"
                    height="36"
                    rx="8"
                    fill={lit ? '#1D4ED8' : '#FFFFFF'}
                    stroke={lit ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth="2"
                  />
                  <text
                    x="90"
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill={lit ? '#FFFFFF' : '#0F172A'}
                  >
                    {lbl}
                  </text>
                </g>
              );
            })}

            {/* Neuron Sum + Activation */}
            <circle
              cx="405"
              cy="100"
              r="42"
              fill={stage === 2 ? '#1D4ED8' : '#FFFFFF'}
              stroke={stage === 2 ? '#1D4ED8' : '#0F172A'}
              strokeWidth="2.5"
            />
            <text
              x="405"
              y="96"
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={stage === 2 ? '#FFFFFF' : '#0F172A'}
            >
              Σ(w·x) + b
            </text>
            <text
              x="405"
              y="114"
              textAnchor="middle"
              fontSize="10"
              fill={stage === 2 ? '#DBEAFE' : '#64748B'}
            >
              Activation
            </text>

            {/* Output Prediction */}
            <rect
              x="600"
              y="72"
              width="135"
              height="56"
              rx="10"
              fill={stage === 3 ? '#059669' : '#FFFFFF'}
              stroke={stage === 3 ? '#059669' : '#0F172A'}
              strokeWidth="2"
            />
            <text
              x="667"
              y="97"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill={stage === 3 ? '#FFFFFF' : '#0F172A'}
            >
              Output ŷ
            </text>
            <text
              x="667"
              y="115"
              textAnchor="middle"
              fontSize="10"
              fill={stage === 3 ? '#D1FAE5' : '#64748B'}
            >
              Safe Decision
            </text>
          </svg>
        )}

        {isNet && (
          <svg viewBox="0 0 760 190" className="w-full min-w-[540px] h-44">
            <line x1="150" y1="95" x2="620" y2="95" stroke="#94A3B8" strokeWidth="3" strokeDasharray="6 4" />
            {[
              { x: 30, title: 'Your Tablet', sub: '192.168.1.42', active: stage === 0 },
              { x: 215, title: 'Packet Header', sub: 'Port 443 · TTL 64', active: stage === 1 },
              { x: 405, title: 'DNS + Router', sub: '1.1.1.1 -> Fiber', active: stage === 2 },
              { x: 595, title: 'School Server', sub: 'ACK Received!', active: stage === 3 },
            ].map((node) => (
              <g key={node.title}>
                <rect
                  x={node.x}
                  y="56"
                  width="140"
                  height="78"
                  rx="10"
                  fill={node.active ? '#0284C7' : '#FFFFFF'}
                  stroke={node.active ? '#0284C7' : '#CBD5E1'}
                  strokeWidth="2.5"
                />
                <text
                  x={node.x + 70}
                  y="90"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill={node.active ? '#FFFFFF' : '#0F172A'}
                >
                  {node.title}
                </text>
                <text
                  x={node.x + 70}
                  y="112"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fill={node.active ? '#E0F2FE' : '#64748B'}
                >
                  {node.sub}
                </text>
              </g>
            ))}
          </svg>
        )}

        {!isAi && !isNet && (
          <svg viewBox="0 0 760 190" className="w-full min-w-[540px] h-44">
            <line x1="150" y1="95" x2="620" y2="95" stroke="#94A3B8" strokeWidth="3" />
            {[
              { x: 30, title: 'Raw Request', sub: 'Input / Login', active: stage === 0 },
              { x: 215, title: 'Crypto / Hash', sub: 'AES + SHA-256', active: stage === 1 },
              { x: 405, title: 'Firewall WAF', sub: 'Blocks Port 80/SQLi', active: stage === 2 },
              { x: 595, title: 'Protected App', sub: 'HTTPS 443 OK', active: stage === 3 },
            ].map((node) => (
              <g key={node.title}>
                <rect
                  x={node.x}
                  y="56"
                  width="140"
                  height="78"
                  rx="10"
                  fill={node.active ? '#059669' : '#FFFFFF'}
                  stroke={node.active ? '#059669' : '#CBD5E1'}
                  strokeWidth="2.5"
                />
                <text
                  x={node.x + 70}
                  y="90"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill={node.active ? '#FFFFFF' : '#0F172A'}
                >
                  {node.title}
                </text>
                <text
                  x={node.x + 70}
                  y="112"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fill={node.active ? '#D1FAE5' : '#64748B'}
                >
                  {node.sub}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

      <p className="text-xs text-slate-700 bg-blue-50/70 border border-blue-200 rounded-lg px-4 py-2.5">
        <strong className="text-blue-900">{stages[stage].title}:</strong> {stages[stage].desc}
      </p>
    </div>
  );
};

export default ConceptDiagram;
