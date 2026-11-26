let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

export const setAudioMuted = (muted: boolean) => {
  isAudioMuted = muted;
};

const getContext = (): AudioContext | null => {
  if (isAudioMuted || typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

const playTone = (frequency: number, durationSec: number, startOffset = 0, gainPeak = 0.06, type: OscillatorType = 'sine') => {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSec + 0.02);
};

export const playClickSound = () => {
  playTone(620, 0.05, 0, 0.03, 'triangle');
};

export const playCorrectAnswerSound = () => {
  playTone(523.25, 0.14, 0, 0.06, 'sine');
  playTone(659.25, 0.18, 0.09, 0.06, 'sine');
};

export const playTopicCompleteSound = () => {
  playTone(523.25, 0.14, 0, 0.06, 'triangle');
  playTone(659.25, 0.14, 0.09, 0.06, 'triangle');
  playTone(783.99, 0.25, 0.18, 0.07, 'triangle');
};

export const playLevelUpSound = () => {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    playTone(freq, 0.22, i * 0.09, 0.065, 'sine');
  });
};