import type { CurriculumModule, DeepLessonContent } from '../types';

export const BUILT_IN_MONOGRAPHS: Record<string, DeepLessonContent> = {
  'ai-g3-u3-m1': {
    moduleId: 'ai-g3-u3-m1',
    topic: 'Inputs, Weights & Importance Dials',
    subtitle: 'How an artificial neuron multiplies real-world clues by learned importance weights to make decisions.',
    grade: 3,
    subjectName: 'Artificial Intelligence',
    estimatedStudyMinutes: 35,
    prerequisites: [
      'Basic multiplication with positive and negative numbers',
      'Sorting objects by observable traits (features) such as size or color',
      'Plotting simple points on a number line or 2D grid',
    ],
    learningObjectives: [
      'Model an artificial neuron as weighted inputs plus a bias threshold.',
      'Calculate a neuron weighted sum z = w₁x₁ + w₂x₂ + b by hand.',
      'Explain how positive, zero, and negative weights encode evidence for or against an answer.',
      'Predict how nudging a weight changes a linear decision boundary.',
    ],
    coreConcepts: [
      {
        heading: '1. Turning Real-World Clues Into Number Inputs (x)',
        definition: 'An artificial neuron receives numbers called inputs (x₁, x₂, ..., xₙ), where each number measures one clear clue about the world.',
        exposition:
          'Imagine building a robot helper that decides whether it is a good afternoon to fly a kite outdoors. Instead of guessing randomly, the robot measures two clues: wind speed (x₁ in km/h) and dark storm clouds (x₂ from 0 for clear sky to 10 for heavy thunderclouds).\n\nBecause computers compute using numbers rather than vague feelings, turning observations into clean numeric features is step one of every AI model. Strong wind helps a kite soar, while storm clouds mean lightning danger!',
        formula: 'Input Vector: x = [ x₁ (Wind Speed),  x₂ (Storm Clouds) ]',
        historicalContext:
          'In 1943, neurophysiologist Warren McCulloch and logician Walter Pitts proposed the first mathematical model of a nerve cell taking numeric inputs.',
        realWorldApplication:
          'Self-driving cars turn lidar distance, camera pixel brightness, and wheel speed into numeric input vectors hundreds of times every second.',
      },
      {
        heading: '2. Importance Dials Called Weights (w)',
        definition: 'A weight (wᵢ) multiplies its matching input (xᵢ), telling the neuron how strongly that clue pushes the decision toward YES (positive) or NO (negative).',
        exposition:
          'Not all clues are equally helpful. If you are deciding whether to bring an umbrella, yesterday’s lunch menu should have weight w = 0 (totally irrelevant!), whereas dark rain clouds deserve a large positive weight like w = +3. Meanwhile, bright sunshine pushes against carrying an umbrella, so it receives a negative weight like w = -2.\n\nIn our kite robot, wind speed x₁ gets a positive weight w₁ = +1 (more breeze helps!), while storm clouds x₂ get a strong negative weight w₂ = -4 (safety first!). Multiplying each input by its weight lets the neuron weigh pros and cons mathematically.',
        formula: 'Weighted Evidence = (w₁ · x₁) + (w₂ · x₂)',
        historicalContext:
          'Frank Rosenblatt (1957) built the Perceptron hardware machine at Cornell Aeronautical Laboratory with physical motor-driven potentiometer dials for weights!',
        realWorldApplication:
          'Email spam shields assign positive spam weights to words like "free-prize-click-now" and negative weights to words from your real school teachers.',
      },
      {
        heading: '3. The Bias Offset (b) & Firing Threshold',
        definition: 'Bias (b) shifts the neuron’s score before checking whether the total exceeds 0, controlling how cautious or eager the neuron is to fire YES.',
        exposition:
          'Suppose even with mild wind, you want the kite robot to stay indoors unless wind reaches at least 8 km/h. By adding a negative bias b = -8, mild 5 km/h breezes give 5 - 8 = -3 (below zero -> stay inside!), while 12 km/h wind gives 12 - 8 = +4 (above zero -> launch the kite!).\n\nThink of bias like setting the starting bar on a high jump. Once we add weighted inputs and bias together into z = w₁x₁ + w₂x₂ + b, a simple step switch checks: if z ≥ 0 output 1 (YES); if z < 0 output 0 (NO).',
        formula: 'z = w₁x₁ + w₂x₂ + b    ⟹    Output = 1 if z ≥ 0 else 0',
        historicalContext:
          'Adding a learnable bias term let perceptrons shift decision lines away from the origin (0, 0), unlocking real-world data separation.',
        realWorldApplication:
          'Wake-word chips inside voice assistants use carefully tuned bias thresholds so background TV chatter rarely triggers false wake-ups.',
      },
    ],
    workedExamples: [
      {
        title: 'Evaluating the Kite Safety Neuron',
        problemStatement: 'A kite-launch neuron has weights w₁ = +2 (wind), w₂ = -5 (storm clouds), and bias b = -6. Should we fly a kite when wind x₁ = 10 and clouds x₂ = 2?',
        givenData: ['w₁ = +2, w₂ = -5', 'b = -6', 'x₁ = 10, x₂ = 2'],
        steps: [
          'Multiply wind clue by its weight: w₁ · x₁ = 2 × 10 = +20.',
          'Multiply storm clue by its weight: w₂ · x₂ = (-5) × 2 = -10.',
          'Add weighted clues plus bias: z = 20 + (-10) + (-6) = +4.',
          'Check threshold z ≥ 0: since +4 ≥ 0, the neuron fires Output = 1 (Safe to fly!).',
        ],
        finalAnswer: 'z = +4 -> Output = 1 (YES, safe to fly)',
        keyInsight: 'Notice how storm clouds carry a big negative weight (-5) so even moderate clouds quickly cancel out good wind!',
      },
      {
        title: 'Adjusting a Weight After a Mistake',
        problemStatement: 'With x₁ = 3, x₂ = 1, w₁ = 1, w₂ = 1, b = -5, the neuron outputs 0 (NO), even though the true answer should be 1 (YES). Nudge w₁ using learning rate η = 0.5.',
        givenData: ['Current z = 1(3) + 1(1) - 5 = -1 (Pred = 0)', 'Target = 1', 'Error = Target - Pred = +1', 'η = 0.5'],
        steps: [
          'Compute error signal: e = 1 - 0 = +1 (neuron scored too low).',
          'Apply Perceptron update rule: Δw₁ = η · e · x₁ = 0.5 × 1 × 3 = +1.5.',
          'New weight w₁_new = 1 + 1.5 = 2.5 (and Δb = 0.5 × 1 = +0.5 -> b_new = -4.5).',
          'Re-test z_new = 2.5(3) + 1(1) - 4.5 = 7.5 + 1 - 4.5 = +4.0 -> Output = 1!',
        ],
        finalAnswer: 'w₁_new = 2.5, b_new = -4.5 (Now classifies correctly!)',
        keyInsight: 'Training is simply nudging weights up when the prediction was too low, and down when too high.',
      },
    ],
    commonMisconceptions: [
      {
        myth: 'Artificial neurons copy human biological brains completely.',
        reality: 'Artificial neurons are simplified mathematical weighted sums; real biological neurons fire timed electrochemical spikes across thousands of complex dendrites.',
        diagnosticTip: 'Remember that AI weights are numbers optimized by calculus/updates rather than living cells.',
      },
      {
        myth: 'A larger input number automatically means that feature is more important.',
        reality: 'An input like height in millimeters (1,500) looks huge compared to age in years (9), which is why learned weights and feature scaling matter!',
        diagnosticTip: 'Always scale inputs to comparable ranges (e.g., 0 to 1) before feeding them to a perceptron.',
      },
      {
        myth: 'One single neuron can solve every pattern puzzle.',
        reality: 'One neuron draws only ONE straight line. Puzzles like XOR need a hidden layer combining two or more neurons.',
        diagnosticTip: 'Test whether you can separate blue and orange dots with one straight ruler before assuming one neuron suffices.',
      },
    ],
    flashcards: [
      {
        id: 'fc-ai-n1',
        front: 'Write the weighted-sum equation z for a two-input artificial neuron.',
        back: 'z = w₁x₁ + w₂x₂ + b',
        formula: 'z = Σ(wᵢxᵢ) + b',
        hint: 'Multiply each input by its weight, sum them, and add bias.',
      },
      {
        id: 'fc-ai-n2',
        front: 'What does a negative weight wᵢ < 0 tell the neuron about input xᵢ?',
        back: 'As xᵢ grows larger, it pushes the total score DOWN toward outputting 0 (NO).',
        hint: 'Think of storm clouds lowering a kite-flying safety score.',
      },
      {
        id: 'fc-ai-n3',
        front: 'What is the job of the bias term b?',
        back: 'It shifts the decision boundary line away from the origin, setting how easy or strict it is for the neuron to fire.',
        hint: 'Acts like a starting threshold offset.',
      },
      {
        id: 'fc-ai-n4',
        front: 'Why can a single perceptron NOT solve the XOR pattern?',
        back: 'Because XOR points sit on opposite diagonals of a square, which cannot be separated by any single straight line.',
        hint: 'Try separating (0,0),(1,1) from (0,1),(1,0) with one ruler.',
      },
    ],
    assessment: [
      {
        id: 'q-ai-n1',
        tier: 'Conceptual',
        question: 'In an artificial neuron predicting whether a puppy is sleepy, what does a weight of w = 0 on "day of the week" represent?',
        options: [
          'That clue has zero influence on the neuron decision.',
          'The neuron automatically crashes with division by zero.',
          'Every prediction becomes 0 regardless of other clues.',
          'The bias must also be set to zero.',
        ],
        correctAnswer: 'That clue has zero influence on the neuron decision.',
        explanation: 'Multiplying any input x by w = 0 contributes 0 to the weighted sum, effectively ignoring irrelevant clues.',
      },
      {
        id: 'q-ai-n2',
        tier: 'Computational',
        question: 'Compute z for inputs x₁ = 4, x₂ = 3 with weights w₁ = 2, w₂ = -3, and bias b = +2.',
        options: ['+1', '+19', '-3', '+5'],
        correctAnswer: '+1',
        explanation: 'z = (2 × 4) + (-3 × 3) + 2 = 8 - 9 + 2 = +1.',
      },
      {
        id: 'q-ai-n3',
        tier: 'Applied',
        question: 'In our Neural Perceptron Lab, you want a line to move strictly upward/downward without changing its tilt angle. Which parameter should you adjust?',
        options: ['Bias (b)', 'Input x₁', 'Learning rate only', 'Activation type'],
        correctAnswer: 'Bias (b)',
        explanation: 'Weights w₁ and w₂ control slope/orientation, while bias b shifts the boundary line rigidly.',
      },
      {
        id: 'q-ai-n4',
        tier: 'Error Analysis',
        question: 'A student notices their neuron makes 0% errors on 10 training dots, then fails badly on 20 brand-new dots. What most likely happened?',
        options: [
          'The small training set did not represent the true pattern cleanly (poor generalization).',
          'The weights multiplied numbers backwards.',
          'Bias b should always equal 100.',
          'Neurons cannot output 0 and 1.',
        ],
        correctAnswer: 'The small training set did not represent the true pattern cleanly (poor generalization).',
        explanation: 'Models tested only on tiny or narrow training samples often fail to generalize to unseen data.',
      },
      {
        id: 'q-ai-n5',
        tier: 'Synthesis',
        question: 'Why does connecting multiple neurons into layers unlock image and speech recognition?',
        options: [
          'Early layers combine lines into shapes, and deeper layers combine shapes into objects—carving curved non-linear boundaries.',
          'More neurons bypass the need for training data entirely.',
          'Hidden layers convert binary numbers into English automatically without weights.',
          'Each extra layer forces all weights to stay positive.',
        ],
        correctAnswer: 'Early layers combine lines into shapes, and deeper layers combine shapes into objects—carving curved non-linear boundaries.',
        explanation: 'Multi-layer networks compose linear boundaries + non-linear activations to approximate complex hierarchical patterns.',
      },
    ],
    furtherInquiry: [
      'Open the Neural Perceptron Lab tab and train a neuron to solve the Boolean AND and OR rules—then test what happens on XOR!',
      'Explore why replacing a sharp 0/1 step switch with a smooth Sigmoid curve lets calculus gradient descent optimize weights.',
      'Investigate how a single neuron relates to linear equations ax + by + c = 0 in coordinate geometry.',
    ],
    source: 'reference-compendium',
    generatedAt: '2026-11-26T00:00:00.000Z',
    depthLevel: 'standard',
  },

  'networking-g2-u6-m3': {
    moduleId: 'networking-g2-u6-m3',
    topic: 'The Friendly Three-Way Handshake',
    subtitle: 'How TCP uses SYN, SYN-ACK, and ACK packets to verify reliable connections before sending data.',
    grade: 2,
    subjectName: 'Computer Networking',
    estimatedStudyMinutes: 30,
    prerequisites: [
      'Knowing that messages travel across wires and Wi-Fi in small packets',
      'Understanding that a Client asks and a Server replies',
      'Basic familiarity with IP addresses and port numbers',
    ],
    learningObjectives: [
      'Trace all three steps of the TCP handshake: SYN, SYN-ACK, and ACK.',
      'Explain why two-way communication needs confirmation from BOTH sides.',
      'Contrast reliable TCP setup with fast connectionless UDP packets.',
      'Diagnose why blocked firewall ports prevent a SYN-ACK reply.',
    ],
    coreConcepts: [
      {
        heading: '1. Calling a Friend Before Telling a Story',
        definition: 'Before TCP sends a web page, homework file, or game update, the client and server perform a quick 3-packet greeting called the Three-Way Handshake.',
        exposition:
          'Imagine calling your friend on walkie-talkies across the playground. You wouldn’t blurt out a whole secret recipe without checking if your friend’s radio is turned on and listening! First you say, "Hey Maya, can you hear me?" Maya replies, "Yes, I hear you! Can you hear me?" You answer, "Loud and clear—here comes the story!"\n\nOn the internet, TCP (Transmission Control Protocol) does the exact same three polite checks in milliseconds so neither computer sends packets into thin air.',
        formula: '1) Client → SYN    2) Server → SYN-ACK    3) Client → ACK',
        historicalContext:
          'Designed by Vint Cerf and Bob Kahn in the 1974–1981 TCP specification (RFC 793) so unreliable networks could still guarantee zero lost bytes.',
        realWorldApplication:
          'Every time you open an HTTPS website, download a game update, or submit homework, your device completes this handshake before loading a single picture.',
      },
      {
        heading: '2. Inside SYN, SYN-ACK & Sequence Numbers',
        definition: 'SYN stands for Synchronize (starting a packet counter), and ACK stands for Acknowledge (confirming receipt of the other computer’s counter).',
        exposition:
          'During Step 1 (SYN), your tablet picks a starting tracking number—say Seq = 100—and sends it to the server. During Step 2 (SYN-ACK), the server replies: "I got your 100 (Ack = 101), and my starting counter is Seq = 500!"\n\nDuring Step 3 (ACK), your tablet confirms: "Got your 500 (Ack = 501)!" Now both sides know two vital facts: the road works in BOTH directions, and both sides agree on the exact packet numbering so missing puzzle pieces can be spotted instantly.',
        formula: 'Ack Number = Received Sequence Number + 1',
        historicalContext:
          'Randomized initial sequence numbers protect connections against old stray packets from earlier conversations or forged guesses.',
        realWorldApplication:
          'Network engineers read SYN / SYN-ACK / ACK timestamps in packet analyzers to measure exact server ping time.',
      },
      {
        heading: '3. When TCP Handshakes Fail or Get Slow',
        definition: 'If a server is offline or blocked by a firewall, the client’s SYN receives either a silent timeout or a polite Reset (RST) refusal.',
        exposition:
          'What happens if you send a SYN packet and wait, and wait, with zero SYN-ACK coming back? Your device retries politely a few times—waiting 1 second, then 2 seconds, then 4 seconds—before showing "Connection Timed Out."\n\nAnd why do live video calls or fast multiplayer racing games sometimes skip TCP and use UDP instead? Because UDP sends fast postcards with zero 3-way handshake delay—trading reliability checks for instant speed!',
        formula: 'TCP Setup Cost = 1 Round-Trip Time (RTT) before first data byte',
        historicalContext:
          'Modern HTTP/3 (QUIC) merges transport and encryption setup together to trim handshake round trips even further.',
        realWorldApplication:
          'Go to our Packet Router Simulator tab and toggle between TCP and UDP to watch handshakes and packet loss in action!',
      },
    ],
    workedExamples: [
      {
        title: 'Tracing Sequence & Ack Numbers',
        problemStatement: 'A tablet opens a TCP connection with Client Seq = 300. The server chooses Server Seq = 900. Fill in the Ack numbers for Steps 2 and 3.',
        givenData: ['Client initial Seq = 300', 'Server initial Seq = 900'],
        steps: [
          'Step 1 (Client -> Server): Sends SYN with Seq = 300.',
          'Step 2 (Server -> Client): Sends SYN-ACK with Seq = 900 and Ack = 300 + 1 = 301.',
          'Step 3 (Client -> Server): Sends ACK with Ack = 900 + 1 = 901.',
        ],
        finalAnswer: 'Step 2 Ack = 301; Step 3 Ack = 901',
        keyInsight: 'Ack always points to the NEXT sequence number expected from the partner.',
      },
      {
        title: 'Measuring Round-Trip Time (RTT)',
        problemStatement: 'Your tablet sends SYN at t = 10 ms and receives SYN-ACK at t = 46 ms. How long is one full round trip, and when can data start flowing?',
        givenData: ['SYN sent at 10 ms', 'SYN-ACK received at 46 ms'],
        steps: [
          'Subtract timestamps: RTT = 46 ms - 10 ms = 36 ms.',
          'Client sends Step 3 ACK immediately at t = 46 ms (often piggybacking its HTTP GET request!).',
          'Server receives ACK + request half an RTT later: 46 + 18 = 64 ms.',
        ],
        finalAnswer: 'RTT = 36 ms',
        keyInsight: 'One RTT measures the full two-way travel time between client and server.',
      },
    ],
    commonMisconceptions: [
      {
        myth: 'Two steps (SYN then SYN-ACK) are enough for TCP.',
        reality: 'After SYN-ACK, the server knows the client can hear? Not yet! Only Step 3 (ACK) proves to the server that its own reply reached the client.',
        diagnosticTip: 'Walk through the walkie-talkie analogy: both speakers must hear an explicit confirmation.',
      },
      {
        myth: 'TCP is always better than UDP.',
        reality: 'During a live soccer video stream, retrying a missed frame from 3 seconds ago freezes the video! UDP skips retransmission so live streams stay fresh.',
        diagnosticTip: 'Files & web pages need TCP accuracy; live audio/video often prefer UDP speed.',
      },
    ],
    flashcards: [
      {
        id: 'fc-net-1',
        front: 'Name the three packets sent in order during a TCP Three-Way Handshake.',
        back: '1. SYN (Client -> Server), 2. SYN-ACK (Server -> Client), 3. ACK (Client -> Server).',
        formula: 'SYN -> SYN-ACK -> ACK',
        hint: 'First synchronize, then synchronize + acknowledge, then acknowledge.',
      },
      {
        id: 'fc-net-2',
        front: 'If Client sends SYN with Seq = 450, what Ack number does the Server send back in SYN-ACK?',
        back: 'Ack = 451 (received sequence number + 1).',
        hint: 'Add 1 to confirm receipt and name the next expected number.',
      },
      {
        id: 'fc-net-3',
        front: 'Why does TCP need the third packet (ACK) instead of stopping after SYN-ACK?',
        back: 'The server needs proof that its own SYN-ACK reply actually made it back across the network to the client.',
        hint: 'Two-way roads require checking both lanes.',
      },
      {
        id: 'fc-net-4',
        front: 'Which protocol skips the 3-way handshake for faster live voice/video streams: TCP or UDP?',
        back: 'UDP (User Datagram Protocol).',
        hint: 'Fast postcards with zero setup wait.',
      },
    ],
    assessment: [
      {
        id: 'q-net-1',
        tier: 'Conceptual',
        question: 'What is the main purpose of the TCP Three-Way Handshake?',
        options: [
          'To verify both devices can hear each other and synchronize starting sequence numbers before sending data.',
          'To compress large video files into smaller ZIP archives.',
          'To guess the user password automatically.',
          'To turn Wi-Fi radio waves into copper electricity.',
        ],
        correctAnswer: 'To verify both devices can hear each other and synchronize starting sequence numbers before sending data.',
        explanation: 'SYN, SYN-ACK, and ACK prove bidirectional reachability and align sequence counters.',
      },
      {
        id: 'q-net-2',
        tier: 'Computational',
        question: 'A server receives a client SYN with Seq = 1,200. What Ack number will the server put inside its SYN-ACK packet?',
        options: ['1,201', '1,200', '1,199', '2,400'],
        correctAnswer: '1,201',
        explanation: 'Ack = Seq + 1 = 1,200 + 1 = 1,201.',
      },
      {
        id: 'q-net-3',
        tier: 'Applied',
        question: 'You are building a real-time multiplayer laser-tag game where showing players’ positions right NOW matters more than resending old frames from 2 seconds ago. Which transport protocol fits best?',
        options: ['UDP', 'Only HTTP', 'Paper mail', 'Static MAC tables'],
        correctAnswer: 'UDP',
        explanation: 'UDP avoids handshake and retransmission stalls, keeping real-time gameplay responsive.',
      },
      {
        id: 'q-net-4',
        tier: 'Error Analysis',
        question: 'A student sends a TCP SYN to port 22 on a school firewall and receives zero reply after 5 seconds. What does silence usually mean?',
        options: [
          'A firewall silently dropped the unsolicited packet or the server is unreachable.',
          'The TCP handshake finished successfully in 0 ms.',
          'UDP automatically replaced TCP.',
          'The browser deleted the IP address.',
        ],
        correctAnswer: 'A firewall silently dropped the unsolicited packet or the server is unreachable.',
        explanation: 'Security firewalls often drop blocked port SYNs silently without returning SYN-ACK.',
      },
      {
        id: 'q-net-5',
        tier: 'Synthesis',
        question: 'Why does a server 9,000 km away (RTT = 150 ms) make a plain TCP+HTTP page load feel slightly slower than a nearby server (RTT = 15 ms)?',
        options: [
          'Every handshake round trip multiplies by the 150 ms distance delay before data finishes arriving.',
          'Far servers use lower binary voltage.',
          'IPv4 addresses expire after 5,000 km.',
          'Distant servers only accept uppercase letters.',
        ],
        correctAnswer: 'Every handshake round trip multiplies by the 150 ms distance delay before data finishes arriving.',
        explanation: 'Because light in fiber travels finite speed, CDNs place servers closer to users to cut RTT.',
      },
    ],
    furtherInquiry: [
      'Open the Packet Router & TCP/IP Lab tab to watch a live SYN -> SYN-ACK -> ACK exchange and test packet loss!',
      'Compare what happens when a firewall drops packets vs. sends a TCP RST (Reset).',
      'Research why QUIC combines transport and encryption handshakes to save round trips.',
    ],
    source: 'reference-compendium',
    generatedAt: '2026-11-26T00:00:00.000Z',
    depthLevel: 'standard',
  },

  'cybersecurity-g3-u1-m2': {
    moduleId: 'cybersecurity-g3-u1-m2',
    topic: 'The Avalanche Effect in SHA-256',
    subtitle: 'How cryptographic one-way hashes create unique 256-bit digital fingerprints that flip dramatically on tiny edits.',
    grade: 3,
    subjectName: 'Cybersecurity & Defense',
    estimatedStudyMinutes: 35,
    prerequisites: [
      'Understanding bits (0/1) and hexadecimal digits (0–9, A–F)',
      'Knowing why passwords must never be stored in plain readable text',
      'Difference between two-way encryption and one-way fingerprinting',
    ],
    learningObjectives: [
      'Distinguish one-way hashing from reversible encryption.',
      'Observe the Avalanche Effect: a 1-character edit scrambles ~50% of hash bits.',
      'Verify software download integrity using SHA-256 checksums.',
      'Explain why web logins store salted password hashes rather than raw passwords.',
    ],
    coreConcepts: [
      {
        heading: '1. Hashing Is a One-Way Digital Blender',
        definition: 'A cryptographic hash function (like SHA-256) turns any input message—short password or giant 4 GB game—into a fixed 256-bit (64 hex character) fingerprint.',
        exposition:
          'Encryption is like locking a diary in a box: if you hold the key, you can unlock it and read every word back. Hashing is totally different—it works like a fruit blender! You can blend strawberries and bananas into a purple smoothie, and every time you use the exact same recipe, you get the exact same purple smoothie.\n\nBut once blended, nobody can reverse the blender to pull whole strawberries back out! Because SHA-256 is deterministic (same input -> identical 64-char output) yet practically irreversible, websites use it to verify passwords and check whether downloaded files were altered.',
        formula: 'SHA-256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
        historicalContext:
          'SHA-256 (Secure Hash Algorithm 256-bit) was published in 2001 as part of the SHA-2 family, replacing older broken hashes like MD5 and SHA-1.',
        realWorldApplication:
          'Operating system installers, Git code commits, HTTPS digital certificates, and password vaults all rely on SHA-256 or stronger hashes to detect tampering.',
      },
      {
        heading: '2. The Avalanche Effect: Tiny Change, Total Scramble',
        definition: 'In a healthy hash function, changing even a single bit or capital letter in the input flips roughly half of all 256 output bits unpredictably.',
        exposition:
          'Suppose a bad checksum just added up letter numbers: changing "CAT" to "CAU" would only nudge the output by +1, making it easy for tricksters to swap numbers around invisibly. SHA-256 avoids that completely through 64 rounds of bit-rotations, XORs, and modular additions.\n\nChange just one letter from "cat" to "bat", and the output doesn’t shift by 1—it turns into a completely unrelated 64-character hex string! Try it yourself in the Crypto & SHA-256 Lab tab to watch ~128 bits flip instantly.',
        formula: '1-bit input change  ⟹  ~50% (~128 of 256) output bits flip',
        historicalContext:
          'Horst Feistel coined the term "avalanche effect" in the 1970s while designing foundational block ciphers.',
        realWorldApplication:
          'Even if a hacker changes a single `+` to a `-` inside a 10-megabyte banking app installer, the SHA-256 checksum mismatches completely and blocks installation!',
      },
      {
        heading: '3. Protecting Passwords With Salts',
        definition: 'Adding a unique random "salt" string to each kid’s password before hashing ensures two students with the same password get totally different database hashes.',
        exposition:
          'Think: if two classmates both pick "BlueDragon99" and the website runs plain SHA-256("BlueDragon99"), both accounts would show identical hashes in the database! An attacker with a giant precomputed lookup table ("rainbow table") could recognize common hashes instantly.\n\nBy prepending a unique random salt to each user (e.g., `salt1 = "9fK2!x"`), the database stores `SHA-256("9fK2!x" + "BlueDragon99")`. Now every user’s fingerprint looks unique even if passwords match!',
        formula: 'Stored Record = (unique_salt,  SlowHash(unique_salt + password))',
        historicalContext:
          'Per-user salting became standard Unix practice in the late 1970s under Robert Morris and Ken Thompson.',
        realWorldApplication:
          'Modern login backends combine random salts with slow memory-hard functions (like Argon2id) so stolen password files stay protected.',
      },
    ],
    workedExamples: [
      {
        title: 'Verifying a Coding Kit Download',
        problemStatement: 'An official robotics website lists the SHA-256 checksum of `robot-kit.zip` ending in `...9a4f`. You download the file and compute `...7c12`. What should you do?',
        givenData: ['Official published hash ends in ...9a4f', 'Your downloaded file hash ends in ...7c12'],
        steps: [
          'Compare the two hexadecimal strings character by character.',
          'Because SHA-256 is deterministic, an intact unmodified file MUST match all 64 characters identically.',
          'A mismatch proves the file was either corrupted during Wi-Fi transfer or tampered with along the way.',
          'Delete the mismatched download immediately and fetch again over verified HTTPS.',
        ],
        finalAnswer: 'Reject file (Checksum Mismatch) — never run unverified installers!',
        keyInsight: 'Even one corrupted or altered byte triggers the Avalanche Effect and changes the entire checksum.',
      },
      {
        title: 'Counting SHA-256 Search Space',
        problemStatement: 'How many hexadecimal characters long is a 256-bit SHA-256 digest, and why?',
        givenData: ['Output size = 256 bits', '1 hex digit (0–9, a–f) = 4 bits (2⁴ = 16 values)'],
        steps: [
          'Divide total bits by bits per hexadecimal digit: 256 bits ÷ 4 bits/hex-char.',
          '256 ÷ 4 = 64 hexadecimal characters.',
          'Total possible hashes = 2²⁵⁶ ≈ 1.15 × 10⁷⁷ (more than atoms in the Milky Way!).',
        ],
        finalAnswer: '64 hexadecimal characters (2²⁵⁶ possible fingerprints)',
        keyInsight: 'Each hex digit packs 4 binary bits cleanly.',
      },
    ],
    commonMisconceptions: [
      {
        myth: 'You can decrypt a SHA-256 hash back to the original file if you have the right key.',
        reality: 'Hashing has NO decryption key! It is strictly one-way compression from any length down to 256 bits.',
        diagnosticTip: 'A 10 GB movie produces a 32-byte hash—you cannot magically reconstruct 10 GB out of 32 bytes!',
      },
      {
        myth: 'SHA-256 hides who sent a message like encryption does.',
        reality: 'Hashing proves integrity (nothing changed), NOT secrecy. Anyone can hash the word "hello" and match its digest unless salted or keyed (HMAC).',
        diagnosticTip: 'Use Encryption (AES/TLS) for secrecy, and Hashing/HMAC for integrity.',
      },
    ],
    flashcards: [
      {
        id: 'fc-cyb-1',
        front: 'What does "Avalanche Effect" mean in SHA-256?',
        back: 'Changing even 1 single bit of the input scrambles roughly 50% of the output hash bits unpredictably.',
        hint: 'Tiny snowball -> massive avalanche.',
      },
      {
        id: 'fc-cyb-2',
        front: 'How many hexadecimal characters are in a full SHA-256 digest?',
        back: '64 hex characters (because 256 bits ÷ 4 bits per hex digit = 64).',
        formula: '256 / 4 = 64 hex chars',
        hint: 'Each hex character holds 4 binary bits.',
      },
      {
        id: 'fc-cyb-3',
        front: 'Why can’t a server "un-hash" your forgotten password to email it back to you?',
        back: 'Because cryptographic hashes are one-way functions; the server only stores the digest, so it sends a reset link instead.',
        hint: 'Blender analogy: you cannot un-blend a smoothie.',
      },
      {
        id: 'fc-cyb-4',
        front: 'What is a password "salt", and why is it added before hashing?',
        back: 'A unique random string mixed into each user password so identical passwords produce totally different database hashes.',
        hint: 'Defeats precomputed rainbow lookup tables.',
      },
    ],
    assessment: [
      {
        id: 'q-cyb-1',
        tier: 'Conceptual',
        question: 'Which statement accurately describes the difference between Encryption and Hashing?',
        options: [
          'Encryption is reversible using a key; hashing is a one-way fingerprint.',
          'Hashing makes files larger so anyone can read them; encryption deletes files.',
          'Encryption only works on numbers; hashing only works on images.',
          'They are identical names for the exact same operation.',
        ],
        correctAnswer: 'Encryption is reversible using a key; hashing is a one-way fingerprint.',
        explanation: 'AES/TLS encrypt and decrypt with keys, while SHA-256 produces a one-way 256-bit digest.',
      },
      {
        id: 'q-cyb-2',
        tier: 'Computational',
        question: 'A 1-terabyte hard drive backup and a 3-letter word "cat" are both run through SHA-256. How do their output digest lengths compare?',
        options: [
          'Both outputs are exactly 256 bits (64 hex characters) long.',
          'The 1 TB backup produces a 1 TB hash.',
          'The 3-letter word produces a 3-character hash.',
          'SHA-256 rejects files larger than 1 MB.',
        ],
        correctAnswer: 'Both outputs are exactly 256 bits (64 hex characters) long.',
        explanation: 'Hash functions always map arbitrary-length inputs to a fixed-size digest.',
      },
      {
        id: 'q-cyb-3',
        tier: 'Applied',
        question: 'When downloading a Python coding installer, you compare its SHA-256 checksum against the developer’s official website and every single character matches. What does this prove?',
        options: [
          'The file arrived byte-for-byte identical without corruption or tampering.',
          'The installer requires zero RAM to run.',
          'Your computer automatically encrypted your Wi-Fi.',
          'The file contains zero bugs.',
        ],
        correctAnswer: 'The file arrived byte-for-byte identical without corruption or tampering.',
        explanation: 'Matching SHA-256 digests certify file integrity against corruption or modification.',
      },
      {
        id: 'q-cyb-4',
        tier: 'Error Analysis',
        question: 'A beginner programmer hashes all student passwords with plain `SHA256(password)` without salts. What weakness appears immediately in the database?',
        options: [
          'Any two students who pick the same password end up with identical visible hashes, exposing matches to rainbow tables.',
          'Plain SHA-256 cannot hash numbers.',
          'Passwords become readable plain English after 24 hours.',
          'The database crashes whenever a password has uppercase letters.',
        ],
        correctAnswer: 'Any two students who pick the same password end up with identical visible hashes, exposing matches to rainbow tables.',
        explanation: 'Unique per-user random salts + slow hashing prevent duplicate-hash leaks and precomputed lookups.',
      },
      {
        id: 'q-cyb-5',
        tier: 'Synthesis',
        question: 'Suppose you change "TechHub2026!" to "techHub2026!" (just lowercase `t`) and hash both with SHA-256. Roughly how many bits change?',
        options: [
          'About 50% (~128 out of 256 bits) flip unpredictably due to the Avalanche Effect.',
          'Exactly 1 bit changes in the very first hex letter.',
          'Zero bits change because hashing ignores capitalization.',
          'All 256 bits turn into zeros.',
        ],
        correctAnswer: 'About 50% (~128 out of 256 bits) flip unpredictably due to the Avalanche Effect.',
        explanation: 'The Avalanche Effect ensures single-bit input changes cascade across roughly half the digest bits.',
      },
    ],
    furtherInquiry: [
      'Open the Crypto & SHA-256 Lab tab and compare SHA-256("TechHub") vs. SHA-256("Techhub") live!',
      'Explore why MD5 and SHA-1 were retired after researchers found real collision attacks.',
      'Investigate how HMAC-SHA256 adds a secret key to verify both integrity AND sender authenticity.',
    ],
    source: 'reference-compendium',
    generatedAt: '2026-11-26T00:00:00.000Z',
    depthLevel: 'standard',
  },
};

export function getBuiltInMonograph(moduleId: string): DeepLessonContent | null {
  return BUILT_IN_MONOGRAPHS[moduleId] || null;
}

export function buildSyllabusBriefLesson(mod: CurriculumModule): DeepLessonContent {
  return {
    moduleId: mod.id,
    topic: mod.title,
    subtitle: `${mod.unitTitle} — Class ${mod.grade} ${mod.subjectName} Syllabus Guide`,
    grade: mod.grade,
    subjectName: mod.subjectName,
    estimatedStudyMinutes: mod.estimatedMinutes,
    prerequisites: [
      `Core Class ${Math.max(1, mod.grade - 1)} ${mod.subjectName} foundations`,
      `Unit ${mod.unitNumber} concepts: ${mod.unitTitle}`,
    ],
    learningObjectives: [
      `Master the core concepts of "${mod.title}" at ${mod.difficulty} depth for Class ${mod.grade}.`,
      `Experiment with live parameters in the paired Tech Simulation Workbench (${mod.simType}).`,
      `Verify understanding through spaced-repetition flashcards and the 5-tier mastery exam.`,
    ],
    coreConcepts: [
      {
        heading: `Module Overview: ${mod.title}`,
        definition: mod.summary,
        exposition: `This ${mod.difficulty}-tier lesson sits inside Unit ${mod.unitNumber} (${mod.unitTitle}) of Class ${mod.grade} ${mod.subjectName} on TECH HUB.\n\nClick "Synthesize Deep Monograph" above to generate the full age-calibrated textbook guide, real-world kid analogies + formal engineering formulas, 3 worked examples, misconception checks, 6 active-recall flashcards, and a 5-tier mastery exam—automatically saved to your offline IndexedDB Knowledge Vault.`,
        historicalContext: `Module ${mod.moduleNumber} of ${mod.unitTitle}, bridging playful intuitive models to authentic AI, Networking, and Cybersecurity engineering.`,
        realWorldApplication: `Connected directly to our live Tech Lab (${mod.simType}) so you can test inputs, packets, weights, or ciphers hands-on.`,
      },
    ],
    workedExamples: [],
    commonMisconceptions: [],
    flashcards: [],
    assessment: [],
    furtherInquiry: [
      `Synthesize the full AI Monograph for "${mod.title}" to unlock worked examples, flashcards, and the 5-tier mastery exam.`,
      `Open the Interactive Simulation tab to experiment directly with ${mod.unitTitle}.`,
    ],
    source: 'reference-compendium',
    generatedAt: new Date().toISOString(),
    depthLevel: 'standard',
  };
}

const VALID_TIERS = ['Conceptual', 'Computational', 'Applied', 'Error Analysis', 'Synthesis'] as const;

export function normalizeDeepLessonContent(
  raw: unknown,
  fallback?: Partial<DeepLessonContent>
): DeepLessonContent {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const moduleId =
    typeof obj.moduleId === 'string' && obj.moduleId
      ? obj.moduleId
      : fallback?.moduleId || 'unknown-module';
  const topic =
    typeof obj.topic === 'string' && obj.topic ? obj.topic : fallback?.topic || 'Study Monograph';
  const subjectName =
    typeof obj.subjectName === 'string' && obj.subjectName
      ? obj.subjectName
      : fallback?.subjectName || 'Artificial Intelligence';
  const grade =
    typeof obj.grade === 'number' && Number.isFinite(obj.grade)
      ? obj.grade
      : fallback?.grade ?? 5;

  const toStrArray = (val: unknown): string[] =>
    Array.isArray(val) ? val.filter((v): v is string => typeof v === 'string' && v.trim().length > 0) : [];

  const coreConcepts = Array.isArray(obj.coreConcepts)
    ? obj.coreConcepts
        .filter((s): s is Record<string, unknown> => Boolean(s && typeof s === 'object'))
        .map((s, idx) => ({
          heading: typeof s.heading === 'string' && s.heading ? s.heading : `Section ${idx + 1}`,
          definition: typeof s.definition === 'string' ? s.definition : '',
          exposition: typeof s.exposition === 'string' ? s.exposition : '',
          formula: typeof s.formula === 'string' && s.formula ? s.formula : undefined,
          historicalContext: typeof s.historicalContext === 'string' ? s.historicalContext : '',
          realWorldApplication: typeof s.realWorldApplication === 'string' ? s.realWorldApplication : '',
        }))
    : [];

  const workedExamples = Array.isArray(obj.workedExamples)
    ? obj.workedExamples
        .filter((e): e is Record<string, unknown> => Boolean(e && typeof e === 'object'))
        .map((e, idx) => ({
          title: typeof e.title === 'string' && e.title ? e.title : `Example ${idx + 1}`,
          problemStatement: typeof e.problemStatement === 'string' ? e.problemStatement : '',
          givenData: toStrArray(e.givenData),
          steps: toStrArray(e.steps),
          finalAnswer: typeof e.finalAnswer === 'string' ? e.finalAnswer : '',
          keyInsight: typeof e.keyInsight === 'string' ? e.keyInsight : '',
        }))
    : [];

  const commonMisconceptions = Array.isArray(obj.commonMisconceptions)
    ? obj.commonMisconceptions
        .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === 'object'))
        .map((m) => ({
          myth: typeof m.myth === 'string' ? m.myth : '',
          reality: typeof m.reality === 'string' ? m.reality : '',
          diagnosticTip: typeof m.diagnosticTip === 'string' ? m.diagnosticTip : '',
        }))
    : [];

  const flashcards = Array.isArray(obj.flashcards)
    ? obj.flashcards
        .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === 'object'))
        .map((c, idx) => ({
          id: typeof c.id === 'string' && c.id ? c.id : `${moduleId}-fc-${idx + 1}`,
          front: typeof c.front === 'string' ? c.front : '',
          back: typeof c.back === 'string' ? c.back : '',
          formula: typeof c.formula === 'string' && c.formula ? c.formula : undefined,
          hint: typeof c.hint === 'string' ? c.hint : '',
        }))
    : [];

  const assessment = Array.isArray(obj.assessment)
    ? obj.assessment
        .filter((q): q is Record<string, unknown> => Boolean(q && typeof q === 'object'))
        .map((q, idx) => {
          const tier =
            typeof q.tier === 'string' && (VALID_TIERS as readonly string[]).includes(q.tier)
              ? (q.tier as (typeof VALID_TIERS)[number])
              : VALID_TIERS[idx % VALID_TIERS.length];
          const options = toStrArray(q.options);
          const safeOptions = options.length > 0 ? options : ['Option A', 'Option B', 'Option C', 'Option D'];
          const correctAnswer =
            typeof q.correctAnswer === 'string' && q.correctAnswer
              ? q.correctAnswer
              : safeOptions[0];
          return {
            id: typeof q.id === 'string' && q.id ? q.id : `${moduleId}-q-${idx + 1}`,
            tier,
            question: typeof q.question === 'string' ? q.question : '',
            options: safeOptions,
            correctAnswer,
            explanation: typeof q.explanation === 'string' ? q.explanation : '',
          };
        })
    : [];

  return {
    moduleId,
    topic,
    subtitle:
      typeof obj.subtitle === 'string' && obj.subtitle
        ? obj.subtitle
        : fallback?.subtitle || `${subjectName} — Class ${grade}`,
    grade,
    subjectName,
    estimatedStudyMinutes:
      typeof obj.estimatedStudyMinutes === 'number' && Number.isFinite(obj.estimatedStudyMinutes)
        ? obj.estimatedStudyMinutes
        : fallback?.estimatedStudyMinutes ?? 30,
    prerequisites: toStrArray(obj.prerequisites),
    learningObjectives: toStrArray(obj.learningObjectives),
    coreConcepts,
    workedExamples,
    commonMisconceptions,
    flashcards,
    assessment,
    furtherInquiry: toStrArray(obj.furtherInquiry),
    source: obj.source === 'ai-monograph' ? 'ai-monograph' : 'reference-compendium',
    generatedAt:
      typeof obj.generatedAt === 'string' && obj.generatedAt
        ? obj.generatedAt
        : new Date().toISOString(),
    depthLevel: obj.depthLevel === 'olympiad' ? 'olympiad' : 'standard',
  };
}
