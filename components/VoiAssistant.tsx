import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { sendTutorMessage } from '../services/geminiService';
import type { TutorMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface VoiAssistantProps {
  grade: number;
  subjectName: string;
  topic: string;
}

type TutorMode = 'socratic' | 'worked_problem' | 'feynman_test' | 'deep_extension';

const MODE_LABELS: { id: TutorMode; label: string; promptSeed: string }[] = [
  { id: 'socratic', label: 'Socratic Inquiry', promptSeed: 'Ask me a diagnostic question to test my intuition on this topic.' },
  { id: 'worked_problem', label: 'Step Derivation', promptSeed: 'Walk me through a challenging worked example step by step.' },
  { id: 'feynman_test', label: 'Feynman Check', promptSeed: 'Let me explain this concept in my own words and critique my reasoning.' },
  { id: 'deep_extension', label: 'Olympiad / Deep Extension', promptSeed: 'Connect this topic to advanced research or competition-level theory.' },
];

const VoiAssistant: React.FC<VoiAssistantProps> = ({ grade, subjectName, topic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TutorMode>('socratic');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (textOverride?: string) => {
    const content = (textOverride ?? input).trim();
    if (!content || isLoading) return;

    const userMsg: TutorMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      content,
      mode,
      timestamp: new Date().toISOString(),
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textOverride) setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const reply = await sendTutorMessage({
        grade,
        subjectName,
        topic,
        mode,
        message: content,
        history: messages,
      });
      setMessages([
        ...nextHistory,
        {
          id: `${Date.now()}-m`,
          role: 'model',
          content: reply,
          mode,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err: any) {
      setError(err?.message || 'Unable to reach AI Socratic Seminar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[360px] sm:w-[420px] mb-3 flex flex-col overflow-hidden max-h-[72vh]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-900 text-white">
            <div>
              <h4 className="text-sm font-bold">TECH HUB Socratic Mentor</h4>
              <p className="text-[11px] text-slate-300 truncate max-w-[290px]">Class {grade} {subjectName} · {topic}</p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close Tutor" className="p-1 text-slate-300 hover:text-white rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1 p-2 border-b border-slate-200 bg-slate-50 overflow-x-auto">
            {MODE_LABELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded whitespace-nowrap shrink-0 transition-colors ${
                  mode === m.id ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select a seminar mode above or ask a deep question about <strong>{topic}</strong>.
                </p>
                <div className="space-y-1.5 pt-1">
                  {MODE_LABELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setMode(m.id);
                        handleSend(m.promptSeed);
                      }}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {m.promptSeed}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`text-xs leading-relaxed p-3 rounded-lg whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white ml-8'
                    : 'bg-slate-100 text-slate-800 mr-4 border border-slate-200'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isLoading && <LoadingSpinner size="sm" />}
            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                {error}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a conceptual question or test an idea..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Toggle Socratic Seminar"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="whitespace-nowrap">Socratic Tutor</span>
      </button>
    </div>
  );
};

export default VoiAssistant;