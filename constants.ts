import type { AvatarItem, Badge, Quest, SubjectMeta } from './types';

export const LP_PER_QUIZ_CORRECT = 15;
export const LP_PER_TOPIC_COMPLETE = 60;
export const LP_PER_FLASHCARD_MASTERED = 5;
export const LEVEL_UP_BASE_LP = 250;
export const LEVEL_UP_MULTIPLIER = 1.45;

export const SUBJECT_METAS: SubjectMeta[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    shortName: 'AI & ML',
    tagline: 'Pattern recognition, neural networks, computer vision, language models, robotics, and safe AI.',
    accentHex: '#1D4ED8',
    defaultSim: 'ai-perceptron',
  },
  {
    id: 'networking',
    name: 'Computer Networking',
    shortName: 'Networking',
    tagline: 'Binary signals, packet switching, IP addressing, DNS phonebooks, Wi-Fi, TCP/UDP, and cloud routing.',
    accentHex: '#0284C7',
    defaultSim: 'net-packets',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Defense',
    shortName: 'Cybersecurity',
    tagline: 'Passphrases, encryption ciphers, SHA-256 hashing, phishing defense, firewalls, and ethical forensics.',
    accentHex: '#059669',
    defaultSim: 'cyber-crypto',
  },
];

export const AVATAR_ITEMS: AvatarItem[] = [
  {
    id: 'scholar_cap',
    name: 'AI Architect Cap',
    type: 'hat',
    cost: 200,
    description: 'Distinction cap awarded to young builders mastering neural models and logic.',
  },
  {
    id: 'astrolabe_visor',
    name: 'Packet Scanner Monocle',
    type: 'glasses',
    cost: 150,
    description: 'Precision diagnostic lens for inspecting live network packets and latency.',
  },
  {
    id: 'laurel_crown',
    name: 'Cyber Guardian Crest',
    type: 'hat',
    cost: 420,
    description: 'Honor emblem for defending digital systems with zero-trust principles.',
  },
  {
    id: 'spectro_lenses',
    name: 'Cipher Decoder Lenses',
    type: 'glasses',
    cost: 300,
    description: 'Cryptographic visor tuned for frequency analysis and hash verification.',
  },
];

export const DAILY_QUESTS: Quest[] = [
  {
    id: 'q_topics_any_3',
    description: 'Master 3 Tech Hub modules across AI, Networking, or Cybersecurity',
    type: 'completeTopics',
    target: 3,
    reward: 90,
  },
  {
    id: 'q_quiz_any_5',
    description: 'Answer 5 mastery exam questions accurately',
    type: 'correctQuizzes',
    target: 5,
    reward: 65,
  },
  {
    id: 'q_topics_ai_2',
    description: 'Complete 2 Artificial Intelligence monographs',
    type: 'completeTopics',
    subject: 'Artificial Intelligence',
    target: 2,
    reward: 80,
  },
  {
    id: 'q_topics_net_2',
    description: 'Complete 2 Computer Networking monographs',
    type: 'completeTopics',
    subject: 'Computer Networking',
    target: 2,
    reward: 80,
  },
  {
    id: 'q_topics_cyber_2',
    description: 'Complete 2 Cybersecurity & Defense modules',
    type: 'completeTopics',
    subject: 'Cybersecurity & Defense',
    target: 2,
    reward: 80,
  },
];

export const BADGES: Badge[] = Array.from({ length: 9 }, (_, idx) => idx + 1).flatMap((grade) =>
  SUBJECT_METAS.map((sub) => ({
    id: `${sub.id}_master_${grade}`,
    name: `Class ${grade} ${sub.shortName} Specialist`,
    description: `Complete all Class ${grade} ${sub.name} modules`,
    subject: sub.name,
    grade,
  }))
);