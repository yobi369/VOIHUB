import { SUBJECT_METAS } from '../constants';
import type { CurriculumModule, CurriculumUnit, DifficultyTier, SimulationKind } from '../types';

type RawUnitSpec = [unitTitle: string, simType: SimulationKind, modules: [string, DifficultyTier, string][]];
type GradeCurriculumMap = Record<number, RawUnitSpec[]>;

const AI_CURRICULUM: GradeCurriculumMap = {
  1: [
    ['Smart Helpers vs. Everyday Tools', 'ai-perceptron', [
      ['What Makes a Machine "Smart"?', 'Foundational', 'Comparing simple machines like toasters with pattern-learning computers.'],
      ['Sensors: How Robots See, Hear & Touch', 'Foundational', 'Cameras, microphones, and touch buttons as digital senses for kids.'],
      ['Following Rules vs. Learning from Examples', 'Foundational', 'Why a fixed checklist differs from learning by practicing many tries.'],
      ['Spot the AI Around Your Home', 'Intermediate', 'Voice speakers, photo taggers, and helpful vacuum robots explained simply.'],
    ]],
    ['Pattern Spotting & Sorting Games', 'ai-perceptron', [
      ['Sorting Shapes, Colors & Sizes', 'Foundational', 'Grouping toys by clear traits—just like an AI classifier starts.'],
      ['Guess What Comes Next in Sequences', 'Foundational', 'Finding repeating patterns in numbers, claps, and pictures.'],
      ['Feature Detective: Picking Important Clues', 'Intermediate', 'Choosing whiskers and ears to tell a cat apart from a dog.'],
      ['Odd-One-Out Anomaly Spotting', 'Intermediate', 'How smart computers notice when one item breaks the pattern.'],
    ]],
    ['How Computers See Pictures', 'ai-vision', [
      ['Tiny Colored Squares Called Pixels', 'Foundational', 'Zooming into a screen to discover how pictures are built from grid squares.'],
      ['Dark & Light Brightness Grids', 'Foundational', 'Turning black-and-white drawings into simple grid numbers.'],
      ['Finding Lines, Corners & Circles', 'Intermediate', 'How AI vision looks for edges first before recognizing a whole toy.'],
      ['Drawing & Testing Simple Pixel Letters', 'Intermediate', 'Teaching a tiny grid matcher to tell X from O.'],
    ]],
    ['Teaching With Good Examples', 'ai-perceptron', [
      ['Training Data: Giving Clear Practice Cards', 'Foundational', 'Why an AI needs lots of clear pictures to learn properly.'],
      ['Labels: Naming What Each Picture Shows', 'Foundational', 'Attaching accurate word tags so the computer knows the right answer.'],
      ['Garbage In, Silly Guess Out', 'Intermediate', 'What happens when training photos are blurry or mislabeled.'],
      ['Testing With Brand-New Mystery Cards', 'Intermediate', 'Checking whether AI truly learned or just memorized old cards.'],
    ]],
    ['Yes/No Decision Trees', 'ai-perceptron', [
      ['Playing 20 Questions With Computers', 'Foundational', 'Splitting choices into smart Yes-or-No steps.'],
      ['Branching Paths & Leaf Answers', 'Foundational', 'Drawing tree diagrams that classify animals step by step.'],
      ['Picking the Best First Question', 'Intermediate', 'Why asking about feathers beats asking tiny details first.'],
      ['When Two Trees Disagree', 'Intermediate', 'Combining votes from multiple kid-friendly decision trees.'],
    ]],
    ['Voice Assistants & Word Clues', 'ai-vision', [
      ['Sound Waves to Written Words', 'Foundational', 'How microphones turn spoken voices into squiggly sound patterns.'],
      ['Wake Words & Listening Privacy', 'Foundational', 'Why smart speakers wait for a magic trigger word before recording.'],
      ['Matching Keywords to Helpful Actions', 'Intermediate', 'Connecting "set timer" or "weather" to the right mini-program.'],
      ['Polite & Clear Prompts for Helpers', 'Intermediate', 'Giving clear instructions so a computer assistant stays on track.'],
    ]],
    ['Robots in Action', 'ai-vision', [
      ['Sense-Think-Act Loop', 'Foundational', 'How self-driving toys check sensors, decide, and steer wheels.'],
      ['Obstacle Avoidance Maze Logic', 'Foundational', 'Step-by-step rules for turning away before bumping a wall.'],
      ['Reward Stickers for Robot Learners', 'Intermediate', 'Giving +1 points when a robot reaches the goal faster.'],
      ['Safety Bumpers & Emergency Stops', 'Intermediate', 'Why physical and software safety rules always come first.'],
    ]],
    ['Fairness & Truth in AI', 'ai-perceptron', [
      ['Fairness for Every Kid', 'Foundational', 'Making sure training pictures include diverse people, accents, and sizes.'],
      ['Can Computers Make Mistakes?', 'Foundational', 'Understanding why AI guesses confidently even when it is wrong.'],
      ['Real Photos vs. AI-Made Cartoons', 'Intermediate', 'Checking hands, backgrounds, and clues to spot edited pictures.'],
      ['Humans Stay the Boss', 'Olympiad', 'Why kids and grown-ups—never machines—make important life decisions.'],
    ]],
  ],
  2: [
    ['Data, Features & Labels', 'ai-perceptron', [
      ['Building a Class Dataset Table', 'Foundational', 'Organizing height, color, and weight columns for simple objects.'],
      ['Input Features vs. Target Labels', 'Foundational', 'Separating clues we measure from the answer we want to predict.'],
      ['Balanced vs. Unbalanced Practice Sets', 'Intermediate', 'Why 99 apple photos and 1 banana photo tricks a learner.'],
      ['Cleaning Messy Data Rows', 'Intermediate', 'Fixing missing measurements before training begins.'],
    ]],
    ['How Machines Draw Boundaries', 'ai-perceptron', [
      ['Plotting Points on a 2D Treasure Map', 'Foundational', 'Placing red and blue dots using X and Y coordinates.'],
      ['Drawing a Straight Fence Line', 'Foundational', 'Separating two groups cleanly with a single ruler line.'],
      ['Adjusting Slope & Position', 'Intermediate', 'Tilting and shifting a boundary line until mistakes drop to zero.'],
      ['When Groups Cannot Be Split by One Line', 'Honors', 'Seeing why mixed checkerboards need smarter curved boundaries.'],
    ]],
    ['Pixel Grids & Edge Detectors', 'ai-vision', [
      ['Numbers Behind Grayscale Pixels (0–255)', 'Foundational', 'Mapping 0 for pure black, 255 for bright white, and grays in between.'],
      ['RGB Color Mixing With Red, Green & Blue', 'Foundational', 'How three tiny colored lamps create millions of digital hues.'],
      ['Sliding a 3×3 Magnifying Window', 'Intermediate', 'Moving a small filter box across a picture to spot bright edges.'],
      ['Recognizing Handwritten Digits 0–9', 'Intermediate', 'Counting loops and straight strokes in pixel number grids.'],
    ]],
    ['Rule-Based AI vs. Machine Learning', 'ai-perceptron', [
      ['Rigid If-Then Recipe Programs', 'Foundational', 'Writing exact step rules for simple tic-tac-toe moves.'],
      ['Why Rules Break on Messy Real Photos', 'Foundational', 'Why nobody can write 10,000 rules for every dog breed.'],
      ['Learning Weights From Mistake Signals', 'Intermediate', 'Nudging dials slightly whenever a guess misses the target.'],
      ['Combining Safety Rules With Smart Models', 'Honors', 'Using guardrails around learned AI outputs.'],
    ]],
    ['Language Prediction & Stories', 'ai-vision', [
      ['Next-Word Guessing Games', 'Foundational', 'How computers predict likely next words from story patterns.'],
      ['Word Neighborhoods & Synonyms', 'Foundational', 'Grouping "puppy", "dog", and "bark" close together in meaning.'],
      ['Context Clues Across a Sentence', 'Intermediate', 'Using earlier words to tell "apple fruit" from "Apple laptop".'],
      ['Checking AI Stories Against Facts', 'Intermediate', 'Spotting made-up facts (hallucinations) using trusted books.'],
    ]],
    ['Reward Learning & Game Bots', 'ai-perceptron', [
      ['Trial, Error & High-Score Rewards', 'Foundational', 'How game AI explores moves and remembers winning paths.'],
      ['Explore New Paths vs. Use Best Path', 'Intermediate', 'Balancing curiosity with sticking to proven good choices.'],
      ['Minimax Thinking: Looking Ahead One Turn', 'Intermediate', 'Asking "What will my opponent do next?" in board games.'],
      ['Teaching Virtual Pets Tricks Safely', 'Honors', 'Avoiding sneaky reward shortcuts that violate the spirit of a game.'],
    ]],
    ['Smart Sensors & Everyday Tech', 'ai-vision', [
      ['Recommendation Engines on Video Apps', 'Foundational', 'How playlists guess what cartoon or science clip you might like next.'],
      ['Spam Filters Protecting Your Inbox', 'Foundational', 'Spotting scam words automatically before kids ever see them.'],
      ['Speech Recognition in Noisy Rooms', 'Intermediate', 'Filtering background clatter to isolate human voices.'],
      ['Translate Apps & Cross-Language Mapping', 'Intermediate', 'Bridging English, Spanish, Swahili, and Mandarin patterns.'],
    ]],
    ['Responsible AI Citizenship', 'ai-perceptron', [
      ['Never Share Private Secrets With Chatbots', 'Foundational', 'Keeping home addresses, school names, and passwords out of prompts.'],
      ['Giving Credit to Human Creators', 'Foundational', 'Respecting artists, writers, and coders whose work inspires models.'],
      ['Detecting Altered Images & Audio', 'Intermediate', 'Verifying surprising clips with trusted adults and primary sources.'],
      ['Designing Helpful AI for Schools', 'Olympiad', 'Brainstorming inclusive accessibility tools for every classmate.'],
    ]],
  ],
  3: [
    ['Supervised vs. Unsupervised Learning', 'ai-perceptron', [
      ['Learning With a Teacher (Supervised)', 'Foundational', 'Training with labeled answer keys for classification and prediction.'],
      ['Grouping Without Labels (Clustering)', 'Foundational', 'Letting an algorithm organize seashells or songs into natural piles.'],
      ['Classification vs. Regression Numbers', 'Intermediate', 'Predicting categories ("rainy/sunny") vs. numbers ("24°C").'],
      ['Semi-Supervised Shortcuts', 'Honors', 'Using a few labeled examples to organize a huge unlabeled folder.'],
    ]],
    ['Nearest-Neighbor Pattern Matchers (KNN)', 'ai-perceptron', [
      ['Measuring Straight-Line Distance on Grids', 'Foundational', 'Using map coordinates to find which training dots sit closest.'],
      ['Majority Voting With K = 3 or K = 5', 'Intermediate', 'Polling the nearest neighbors to label an unknown point cleanly.'],
      ['Why K = 1 Can Be Fooled by Noise', 'Intermediate', 'Seeing how a single outlier creates jagged, brittle islands.'],
      ['Scaling Features Fairly (Apples vs. Oranges)', 'Honors', 'Why millimeters vs. kilometers must be normalized before voting.'],
    ]],
    ['Inside a Single Artificial Neuron', 'ai-perceptron', [
      ['Inputs, Weights & Importance Dials', 'Foundational', 'Multiplying each clue by how strongly it matters.'],
      ['Summing Evidence + Bias Threshold', 'Intermediate', 'Adding weighted scores and checking if the neuron fires.'],
      ['Step Function: On (1) vs. Off (0)', 'Intermediate', 'Making a crisp binary decision from a weighted total.'],
      ['Training a Logic Gate Neuron (AND / OR)', 'Honors', 'Finding weights by hand that compute Boolean AND and OR gates.'],
    ]],
    ['Computer Vision & Convolution', 'ai-vision', [
      ['3×3 Convolution Filters Explained', 'Foundational', 'Multiplying tiny overlapping pixel patches by filter numbers.'],
      ['Horizontal vs. Vertical Edge Detection', 'Intermediate', 'Spotting sharp brightness jumps along rooftops and doorways.'],
      ['Pooling: Shrinking Maps While Keeping Clues', 'Intermediate', 'Using Max Pooling to keep the strongest edge in each 2×2 block.'],
      ['From Edges to Eyes, Wheels & Faces', 'Honors', 'Stacking simple edge layers into rich object detectors.'],
    ]],
    ['Decision Trees & Information Gain', 'ai-perceptron', [
      ['Pure vs. Mixed Buckets (Impurity)', 'Foundational', 'Measuring whether a group is cleanly sorted or still jumbled.'],
      ['Picking Splits That Maximize Clarity', 'Intermediate', 'Choosing questions that create the purest child groups.'],
      ['Tree Depth & Over-Memorizing', 'Intermediate', 'Why giant 50-question trees memorize quirks instead of general rules.'],
      ['Random Forests: Wisdom of Many Trees', 'Honors', 'Averaging diverse decision trees for rock-solid predictions.'],
    ]],
    ['Tokens, Text & Language Models', 'ai-vision', [
      ['Chopping Words Into Sub-Word Tokens', 'Foundational', 'Seeing how LLMs break long words into reusable puzzle pieces.'],
      ['Probability Bars for Next-Token Choice', 'Intermediate', 'Comparing high-confidence vs. creative word probabilities.'],
      ['Temperature: Safe Answers vs. Wild Ideas', 'Intermediate', 'Turning creativity dials up or down without breaking grammar.'],
      ['Fact-Checking & Source Verification', 'Intermediate', 'Testing model claims using reliable reference materials.'],
    ]],
    ['Training, Validation & Testing', 'ai-perceptron', [
      ['The Golden Rule: Never Peek at the Test', 'Foundational', 'Splitting data into study flashcards (train) vs. exam day (test).'],
      ['Underfitting: Too Simple to Learn', 'Intermediate', 'Drawing a straight line through a curved rainbow pattern.'],
      ['Overfitting: Memorizing Every Freckle', 'Intermediate', 'Connecting every single noisy dot while failing new examples.'],
      ['Accuracy, Mistakes & Confusion Grids', 'Honors', 'Counting true positives vs. false alarms carefully.'],
    ]],
    ['AI Ethics, Bias & Safety', 'ai-perceptron', [
      ['How Sampling Bias Creeps Into Models', 'Foundational', 'Tracing unfair results back to missing groups in training data.'],
      ['Feedback Loops in Recommendation Feeds', 'Intermediate', 'Why clicking one video makes algorithms show endless look-alikes.'],
      ['Watermarks & Provenance Tags', 'Intermediate', 'Labeling synthetic media transparently so viewers stay informed.'],
      ['Writing Clear AI Prompt Safety Rules', 'Olympiad', 'Spotting trick prompts and building respectful AI usage habits.'],
    ]],
  ],
  4: [
    ['Linear Models & Regression', 'ai-perceptron', [
      ['Fitting a Best-Fit Trend Line', 'Foundational', 'Predicting lemonade sales from afternoon temperature.'],
      ['Measuring Prediction Error (Residuals)', 'Intermediate', 'Drawing vertical error bars from each dot to the line.'],
      ['Mean Squared Error (MSE) Penalty', 'Intermediate', 'Why squaring errors punishes huge mistakes extra hard.'],
      ['Extrapolation Traps Beyond Known Data', 'Honors', 'Why predicting 500 years ahead from a 5-day trend goes wrong.'],
    ]],
    ['Perceptron Learning & Loss', 'ai-perceptron', [
      ['Step-by-Step Weight Update Rule', 'Foundational', 'Increasing weights when output is too low and lowering when too high.'],
      ['Learning Rate: Tiny Steps vs. Big Leaps', 'Intermediate', 'Watching step size overshoot or crawl toward the solution.'],
      ['Smooth Sigmoid Curves (0% to 100%)', 'Intermediate', 'Turning hard 0/1 switches into smooth probability confidence.'],
      ['The XOR Limitation of One Neuron', 'Honors', 'Proving visually why one straight line cannot solve XOR.'],
    ]],
    ['Image Processing & CNNs', 'ai-vision', [
      ['Sharpen, Blur & Emboss Kernels', 'Foundational', 'Testing real 3×3 matrix kernels on custom pixel artwork.'],
      ['Padding & Stride Across Pixel Borders', 'Intermediate', 'Keeping output feature maps aligned cleanly at image corners.'],
      ['Data Augmentation (Flips & Rotations)', 'Intermediate', 'Multiplying small datasets by flipping and tilting photos safely.'],
      ['Object Bounding Boxes vs. Segmentation', 'Honors', 'Drawing rectangles around objects vs. coloring every exact pixel.'],
    ]],
    ['Unsupervised K-Means Clustering', 'ai-perceptron', [
      ['Placing K Cluster Center Flags', 'Foundational', 'Grouping unlabeled points around nearest center beacons.'],
      ['Update-Assign Repeat Loop', 'Intermediate', 'Moving centers to cluster averages until flags stop shifting.'],
      ['Choosing the Right Number of Clusters K', 'Intermediate', 'Spotting the "elbow point" where extra clusters stop helping.'],
      ['Compressing Images With Color Quantization', 'Honors', 'Reducing 16 million colors down to 8 K-means palette shades.'],
    ]],
    ['Natural Language & Embeddings', 'ai-vision', [
      ['Words as Coordinates in Meaning Space', 'Foundational', 'Placing similar words close together on a 2D/3D concept map.'],
      ['Vector Analogies (King - Man + Woman)', 'Intermediate', 'Using arrow arithmetic to capture relationships between concepts.'],
      ['Sentiment Scoring: Positive vs. Negative', 'Intermediate', 'Weighting emotional clue words in book and game reviews.'],
      ['Context Windows & Memory Limits', 'Honors', 'Understanding why LLMs forget details beyond their token budget.'],
    ]],
    ['Reinforcement Learning & Policies', 'ai-perceptron', [
      ['Agent, Environment, State, Action, Reward', 'Foundational', 'Mapping any game or robot task into the 5 RL building blocks.'],
      ['Epsilon-Greedy Exploration Strategy', 'Intermediate', 'Taking occasional random tries to discover hidden shortcuts.'],
      ['Discount Factor: Now vs. Later Rewards', 'Intermediate', 'Weighing immediate points against long-term game victory.'],
      ['Designing Honest Reward Functions', 'Honors', 'Preventing agents from exploiting weird score glitches.'],
    ]],
    ['Hardware for AI: CPUs, GPUs & TPUs', 'net-binary', [
      ['Sequential Chefs (CPU) vs. Kitchen Army (GPU)', 'Foundational', 'Why graphics chips multiply thousands of weights simultaneously.'],
      ['Binary Floating-Point Numbers in Weights', 'Intermediate', 'Storing decimal neural parameters inside 16-bit and 32-bit binary.'],
      ['Energy Cost of Training Giant Models', 'Intermediate', 'Measuring electricity and cooling inside modern AI data centers.'],
      ['On-Device Edge AI on Tiny Microcontrollers', 'Honors', 'Running voice wake-word chips offline with zero cloud round-trips.'],
    ]],
    ['Prompt Engineering & Critical Evaluation', 'ai-vision', [
      ['Role, Context, Constraints & Examples', 'Foundational', 'Structuring clear prompts that yield accurate study explanations.'],
      ['Few-Shot Pattern Demonstrations', 'Intermediate', 'Teaching a desired output format by showing 2–3 examples first.'],
      ['Detecting Sycophancy & False Confidence', 'Intermediate', 'Testing whether an AI agrees with wrong hints just to be polite.'],
      ['Adversarial Prompt Safety Basics', 'Olympiad', 'Understanding why user inputs must never override system safety rules.'],
    ]],
  ],
  5: [
    ['Multi-Layer Neural Networks (MLPs)', 'ai-perceptron', [
      ['Hidden Layers Solve Non-Linear XOR', 'Foundational', 'Combining two straight boundary lines to carve regions in space.'],
      ['Forward Propagation Matrix Flow', 'Intermediate', 'Passing numbers layer by layer from inputs to final scores.'],
      ['ReLU Activation: Keep Positive, Zero Negative', 'Intermediate', 'Why max(0, x) replaced older slow activations in deep nets.'],
      ['Universal Approximation Intuition', 'Honors', 'How stacking simple bends builds any smooth shape or curve.'],
    ]],
    ['Gradient Descent & Optimization', 'ai-perceptron', [
      ['Walking Downhill in a Foggy Loss Valley', 'Foundational', 'Using slope direction to step toward minimum prediction error.'],
      ['Computing Finite-Difference Slopes', 'Intermediate', 'Nudging a weight by +0.01 to see whether loss rises or drops.'],
      ['Local Minima, Plateaus & Momentum', 'Intermediate', 'Adding rolling-ball momentum to glide across flat regions.'],
      ['Mini-Batch Stochastic Gradient Descent', 'Honors', 'Updating weights efficiently on 32 examples at a time.'],
    ]],
    ['Deep Computer Vision Architectures', 'ai-vision', [
      ['Hierarchical Feature Pyramids', 'Foundational', 'Edges -> textures -> parts -> full objects across CNN depth.'],
      ['Residual Skip Connections (ResNets)', 'Intermediate', 'Adding highway shortcuts so deep 100-layer networks keep learning.'],
      ['Transfer Learning & Pre-Trained Backbones', 'Intermediate', 'Reusing general vision filters to classify rare wildlife quickly.'],
      ['Visualizing Saliency & What CNNs Notice', 'Honors', 'Checking heatmaps to verify AI looks at the bird, not just sky!'],
    ]],
    ['Precision, Recall & Calibration', 'ai-perceptron', [
      ['Confusion Matrix: TP, FP, TN, FN', 'Foundational', 'Reading all four quadrants of a medical or spam test cleanly.'],
      ['Precision vs. Recall Trade-Offs', 'Intermediate', 'Balancing false alarms against missed detections by threshold.'],
      ['F1 Harmonic Mean & ROC Intuition', 'Intermediate', 'Scoring imbalanced datasets where 99% of cases are normal.'],
      ['Confidence Calibration Curves', 'Honors', 'Checking if "80% confident" truly turns out right 80% of the time.'],
    ]],
    ['Sequence Models & Attention', 'ai-vision', [
      ['Why Order Matters in Language & Time', 'Foundational', 'Comparing "dog chased cat" vs. "cat chased dog".'],
      ['Recurrent Memory & Vanishing History', 'Intermediate', 'Why reading word-by-word forgets paragraphs from 100 words ago.'],
      ['Self-Attention: Direct Spotlights Between Words', 'Intermediate', 'Connecting pronouns like "it" straight back to "the robot".'],
      ['Multi-Head Attention Perspectives', 'Honors', 'Tracking grammar, meaning, and cause-effect in parallel heads.'],
    ]],
    ['Generative AI & Diffusion Intuition', 'ai-vision', [
      ['Discriminative vs. Generative Models', 'Foundational', 'Telling cats from dogs vs. painting a brand-new cat from scratch.'],
      ['Adding Noise Forward, Denoising Backward', 'Intermediate', 'Understanding how diffusion models sculpt pictures out of static.'],
      ['Latent Space Interpolation', 'Intermediate', 'Smoothly morphing between concepts inside compressed vectors.'],
      ['Deepfake Verification & Forensic Clues', 'Honors', 'Checking metadata, lighting physics, and cryptographic provenance.'],
    ]],
    ['Retrieval-Augmented Generation (RAG)', 'ai-vision', [
      ['Grounding AI in Trusted Textbooks', 'Foundational', 'Looking up verified pages before writing a single answer word.'],
      ['Chunking & Vector Similarity Search', 'Intermediate', 'Finding the top 3 matching paragraphs via cosine closeness.'],
      ['Citations & Traceable Claims', 'Intermediate', 'Requiring every answer to point back to exact verified snippets.'],
      ['Preventing Poisoned Document Injection', 'Honors', 'Checking untrusted retrieved text for hidden prompt tricks.'],
    ]],
    ['AI Governance, Privacy & Careers', 'ai-perceptron', [
      ['Differential Privacy & Data Anonymization', 'Foundational', 'Learning population trends without leaking any kid’s record.'],
      ['Model Cards & Transparency Reports', 'Intermediate', 'Documenting intended uses, limits, and test metrics honestly.'],
      ['Human-in-the-Loop Critical Systems', 'Intermediate', 'Designing medical, transit, and school tools with human override.'],
      ['Capstone: Designing a Safe Class AI Tool', 'Olympiad', 'Specifying data, model, guardrails, and evaluation metrics.'],
    ]],
  ],
  6: [
    ['Backpropagation & Chain Rule', 'ai-perceptron', [
      ['Blame Assignment Across Layers', 'Foundational', 'Tracing how much each hidden weight contributed to final error.'],
      ['Local Derivatives & Computational Graphs', 'Intermediate', 'Breaking big formulas into tiny +, ×, and ReLU blocks.'],
      ['Exploding & Vanishing Gradients', 'Intermediate', 'Why multiplying 20 small numbers shrinks signals near zero.'],
      ['Weight Initialization & Normalization', 'Honors', 'Keeping signal variance balanced across deep network layers.'],
    ]],
    ['Feature Engineering & Regularization', 'ai-perceptron', [
      ['One-Hot & Ordinal Encoding', 'Foundational', 'Turning categories like "TCP/UDP/ICMP" into clean vectors.'],
      ['L1 / L2 Weight Penalties', 'Intermediate', 'Keeping weights modest so models stay smooth and general.'],
      ['Dropout: Randomly Silencing Neurons', 'Intermediate', 'Forcing networks not to rely on one fragile neuron pathway.'],
      ['Cross-Validation K-Fold Splits', 'Honors', 'Testing on 5 rotating validation slices for reliable accuracy.'],
    ]],
    ['Transformer Architecture Deep Dive', 'ai-vision', [
      ['Query, Key & Value Attention Vectors', 'Foundational', 'Matching search queries against indexed keys to blend values.'],
      ['Scaled Dot-Product Attention Formula', 'Intermediate', 'Why dividing by √d keeps softmax probabilities crisp.'],
      ['Positional Encodings (Sine/Cosine & RoPE)', 'Intermediate', 'Injecting token order directly into parallel attention blocks.'],
      ['Decoder Causal Masking for Generation', 'Honors', 'Hiding future tokens so training cannot cheat ahead.'],
    ]],
    ['Tabular ML: Gradient Boosted Trees', 'ai-perceptron', [
      ['Sequential Error-Correcting Trees', 'Foundational', 'Training each new tree to predict what previous trees missed.'],
      ['Why Boosted Trees Dominate Spreadsheets', 'Intermediate', 'Comparing XGBoost-style ensembles against deep nets on tables.'],
      ['Feature Importance & SHAP Values', 'Intermediate', 'Explaining why a specific prediction scored high or low.'],
      ['Detecting Data Leakage in Features', 'Honors', 'Catching future clues that sneak into training columns.'],
    ]],
    ['Reinforcement Learning: Q-Learning', 'ai-perceptron', [
      ['State-Action Value Tables Q(s, a)', 'Foundational', 'Scoring how good each button press is in each maze square.'],
      ['Bellman Update Equation', 'Intermediate', 'Updating estimates from immediate reward + best future value.'],
      ['Deep Q-Networks (DQN) & Replay Buffers', 'Intermediate', 'Using neural nets when states are too huge for tables.'],
      ['Reward Shaping Without Unintended Loops', 'Honors', 'Preventing agents from farming partial progress points forever.'],
    ]],
    ['AI Audio, Speech & Multimodal Models', 'ai-vision', [
      ['Spectrograms: Turning Sound Into Images', 'Foundational', 'Visualizing frequency pitches over time for CNN/Transformer ears.'],
      ['Contrastive Alignment (CLIP Intuition)', 'Intermediate', 'Pulling matching image and caption vectors close together.'],
      ['Text-to-Speech & Acoustic Tokens', 'Intermediate', 'Synthesizing natural prosody from phonetic representations.'],
      ['Voice Cloning Risks & Liveness Checks', 'Honors', 'Defending families against synthetic voice impersonation scams.'],
    ]],
    ['Evaluating & Red-Teaming AI Systems', 'cyber-firewall', [
      ['Automated Benchmarks vs. Real-World Tests', 'Foundational', 'Why memorizing benchmark trivia does not equal true reasoning.'],
      ['Prompt Injection & Jailbreak Mechanics', 'Intermediate', 'How untrusted text tries to hijack instruction hierarchy.'],
      ['Output Filtering & Guardrail Classifiers', 'Intermediate', 'Inspecting generated responses before displaying to young users.'],
      ['System Prompt Isolation & Least Privilege', 'Honors', 'Limiting tool-calling AI agents to safe read-only permissions.'],
    ]],
    ['Applied AI Engineering Project', 'ai-vision', [
      ['Framing Real Community Problems for AI', 'Foundational', 'Knowing when a simple formula beats a heavy neural model.'],
      ['Dataset Documentation & Bias Audits', 'Intermediate', 'Checking class balance across edge cases before deployment.'],
      ['Latency, Memory & Cost Budgets', 'Intermediate', 'Measuring milliseconds per inference and RAM footprint.'],
      ['Monitoring Model Drift Over Time', 'Olympiad', 'Detecting when real-world data shifts away from training history.'],
    ]],
  ],
  7: [
    ['Matrix Calculus & Vectorized Backprop', 'ai-perceptron', [
      ['Vectors, Matrices & Dot Products in ML', 'Foundational', 'Computing an entire layer of 128 neurons in one matrix multiply.'],
      ['Jacobian Gradients Through Linear Layers', 'Intermediate', 'Tracing dL/dW and dL/dX cleanly with matrix transposes.'],
      ['Adam Optimizer: Momentum + RMSProp', 'Intermediate', 'Adapting per-weight learning rates automatically during training.'],
      ['Gradient Clipping & Numerical Stability', 'Honors', 'Preventing NaN overflow inside deep training loops.'],
    ]],
    ['Convolutional Vision & Detection', 'ai-vision', [
      ['YOLO Single-Pass Object Detection', 'Foundational', 'Predicting grid bounding boxes and class scores simultaneously.'],
      ['Intersection over Union (IoU) Metrics', 'Intermediate', 'Measuring exact box overlap accuracy between 0 and 1.'],
      ['U-Net Encoder-Decoder Segmentation', 'Intermediate', 'Pixel-level medical and robotics scene mapping.'],
      ['Adversarial Patch Perturbations', 'Honors', 'How tiny crafted noise fools brittle classifiers—and how to harden them.'],
    ]],
    ['Large Language Models & Fine-Tuning', 'ai-vision', [
      ['Pre-Training Next-Token Prediction at Scale', 'Foundational', 'Self-supervised learning across trillions of tokens.'],
      ['Instruction Fine-Tuning (SFT)', 'Intermediate', 'Shaping base completion models into helpful Q&A assistants.'],
      ['Low-Rank Adaptation (LoRA)', 'Intermediate', 'Updating tiny adapter matrices instead of billions of weights.'],
      ['KV-Cache Memory During Generation', 'Honors', 'Caching past Key/Value tensors for fast streaming tokens.'],
    ]],
    ['Agentic AI & Tool Use', 'cyber-firewall', [
      ['ReAct Loop: Think -> Act -> Observe', 'Foundational', 'Connecting language models to calculators, code sandboxes, and search.'],
      ['Structured JSON Schema Function Calling', 'Intermediate', 'Guaranteeing type-safe tool arguments from probabilistic models.'],
      ['Sandboxing Untrusted Agent Execution', 'Intermediate', 'Running generated code inside isolated containers with zero host access.'],
      ['Preventing Indirect Prompt Injection in Tools', 'Honors', 'Stopping malicious web pages from triggering unauthorized actions.'],
    ]],
    ['Graph Neural Networks & Recommendations', 'net-packets', [
      ['Representing Networks & Molecules as Graphs', 'Foundational', 'Nodes, edges, and adjacency matrices for connected data.'],
      ['Message Passing Across Neighbors', 'Intermediate', 'Aggregating neighbor embeddings in 1-hop and 2-hop layers.'],
      ['Collaborative Filtering Matrix Factorization', 'Intermediate', 'Factoring user-item preference matrices into latent tastes.'],
      ['Detecting Fraud Rings in Transaction Graphs', 'Honors', 'Spotting coordinated bot clusters via graph anomalies.'],
    ]],
    ['AI Security & Adversarial ML', 'cyber-firewall', [
      ['Evasion Attacks vs. Data Poisoning', 'Foundational', 'Fooling test inference vs. corrupting training samples.'],
      ['Model Inversion & Membership Inference', 'Intermediate', 'Testing whether outputs leak private training examples.'],
      ['Adversarial Training & Robust Loss', 'Intermediate', 'Mixing perturbed samples into training to widen safety margins.'],
      ['Securing ML Pipelines & Weight Checksums', 'Honors', 'Verifying SHA-256 signatures on downloaded model weights.'],
    ]],
    ['Edge AI & Model Compression', 'net-binary', [
      ['FP32 -> FP16 -> INT8 Quantization', 'Foundational', 'Shrinking model weights 4× while keeping accuracy intact.'],
      ['Magnitude Weight Pruning', 'Intermediate', 'Dropping near-zero connections for sparse acceleration.'],
      ['Knowledge Distillation (Teacher -> Student)', 'Intermediate', 'Training compact fast student networks from giant teachers.'],
      ['Running TinyML on Microcontrollers', 'Honors', 'Gesture and anomaly detection inside 256 KB RAM.'],
    ]],
    ['AI Safety, Alignment & Society', 'ai-perceptron', [
      ['Specification Gaming & Goodhart Law', 'Foundational', 'When optimizing a proxy score undermines the real goal.'],
      ['RLHF & Preference Modeling', 'Intermediate', 'Training reward models from human pairwise rankings.'],
      ['Red-Teaming High-Risk Capabilities', 'Intermediate', 'Structured adversarial audits before releasing powerful models.'],
      ['Algorithmic Accountability & Audits', 'Olympiad', 'Evaluating fairness, explainability, and fail-safe overrides.'],
    ]],
  ],
  8: [
    ['Deep Learning Foundations & PyTorch Concepts', 'ai-perceptron', [
      ['Tensors, Broadcasting & Autograd Graphs', 'Foundational', 'Dynamic computation graphs and automatic reverse-mode differentiation.'],
      ['BatchNorm vs. LayerNorm Mechanics', 'Intermediate', 'Stabilizing hidden activations across batches vs. token features.'],
      ['Cross-Entropy Loss & Softmax Geometry', 'Intermediate', 'Connecting information entropy and KL divergence to classification.'],
      ['Learning Rate Warmup & Cosine Decay', 'Honors', 'Scheduling optimization dynamics cleanly for stable convergence.'],
    ]],
    ['Transformers, FlashAttention & Scaling', 'ai-vision', [
      ['Quadratic Attention Bottleneck O(N²)', 'Foundational', 'Why long 100k-token contexts strain GPU memory bandwidth.'],
      ['Tiling & Memory-Efficient Attention', 'Intermediate', 'Computing exact softmax incrementally in fast SRAM blocks.'],
      ['Mixture-of-Experts (MoE) Sparse Routing', 'Intermediate', 'Activating only top-2 expert sub-networks per token.'],
      ['Chinchilla Compute-Optimal Scaling Laws', 'Honors', 'Balancing parameter count against training token budgets.'],
    ]],
    ['Generative Vision & Multimodal Systems', 'ai-vision', [
      ['Variational Autoencoders (VAE) Latent Space', 'Foundational', 'Compressing images into smooth probabilistic bottleneck distributions.'],
      ['Score Matching & Noise Schedules in Diffusion', 'Intermediate', 'Understanding DDPM noise prediction and classifier-free guidance.'],
      ['Vision Transformers (ViT) Patch Tokens', 'Intermediate', 'Splitting images into 16×16 tiles processed like text tokens.'],
      ['Multimodal Hallucination & Grounding Checks', 'Honors', 'Testing visual QA reliability on adversarial diagrams.'],
    ]],
    ['Reinforcement Learning & Reasoning', 'ai-perceptron', [
      ['Policy Gradient & REINFORCE Variance', 'Foundational', 'Increasing probabilities of actions leading to high returns.'],
      ['Actor-Critic & PPO Clipped Objectives', 'Intermediate', 'Keeping policy updates within safe trust regions.'],
      ['Monte Carlo Tree Search (AlphaZero Style)', 'Intermediate', 'Pairing neural policy/value priors with guided lookahead search.'],
      ['Test-Time Compute & Chain-of-Thought Search', 'Honors', 'Allocating extra inference verification steps on hard problems.'],
    ]],
    ['Retrieval, Knowledge Graphs & Memory', 'net-packets', [
      ['HNSW Approximate Nearest Neighbor Graphs', 'Foundational', 'Searching millions of dense embeddings in milliseconds.'],
      ['Hybrid BM25 Lexical + Dense Vector Search', 'Intermediate', 'Combining exact keyword matching with semantic retrieval.'],
      ['Cross-Encoder Reranking Pipelines', 'Intermediate', 'Scoring top-50 candidate passages with deep pairwise attention.'],
      ['Evaluating RAG Faithfulness & Recall', 'Honors', 'Separating retriever misses from generator hallucinations.'],
    ]],
    ['AI Red-Teaming & Defensive Engineering', 'cyber-firewall', [
      ['Threat Modeling LLM Applications (OWASP LLM)', 'Foundational', 'Prompt injection, insecure output handling, and excessive agency.'],
      ['Dual-LLM Quarantine Pattern', 'Intermediate', 'Isolating untrusted data parsing from privileged tool execution.'],
      ['Canary Tokens & Prompt Leak Detection', 'Intermediate', 'Catching unauthorized extraction of confidential system instructions.'],
      ['Defending AI Supply Chains & Pickle Risks', 'Honors', 'Using Safetensors over unsafe arbitrary deserialization formats.'],
    ]],
    ['Distributed Training & Systems', 'net-packets', [
      ['Data Parallelism & All-Reduce Gradients', 'Foundational', 'Synchronizing weight updates across clusters via Ring-AllReduce.'],
      ['Tensor & Pipeline Model Parallelism', 'Intermediate', 'Sharding giant layers that exceed single-accelerator VRAM.'],
      ['Mixed Precision (BF16) & Loss Scaling', 'Intermediate', 'Doubling throughput while preserving exponent dynamic range.'],
      ['Speculative Decoding for Fast Inference', 'Honors', 'Verifying draft model token bursts in one parallel forward pass.'],
    ]],
    ['Interpretability & Frontier Alignment', 'ai-perceptron', [
      ['Linear Probes & Representation Engineering', 'Foundational', 'Testing what concepts internal hidden layers linearly encode.'],
      ['Sparse Autoencoders & Polysemanticity', 'Intermediate', 'Disentangling superposed features inside dense neurons.'],
      ['Constitutional AI & Critique Revisions', 'Intermediate', 'Training models to self-critique against transparent principles.'],
      ['Deceptive Alignment & Eval Integrity', 'Olympiad', 'Designing rigorous un-gameable evaluations for autonomous agents.'],
    ]],
  ],
  9: [
    ['Optimization Theory & Information Geometry', 'ai-perceptron', [
      ['Convexity, Hessians & Saddle Points', 'Foundational', 'Why high-dimensional neural losses are dominated by saddle points.'],
      ['Information Theory: Entropy, KL & Mutual Info', 'Intermediate', 'Quantifying bits of uncertainty and distribution divergence.'],
      ['Double Descent & Implicit Regularization', 'Honors', 'Why over-parameterized networks generalize beyond classic bias-variance.'],
      ['Muon & Second-Order Shampoo Intuition', 'Olympiad', 'Preconditioning gradient geometry across weight matrices.'],
    ]],
    ['Frontier Transformer Mechanics', 'ai-vision', [
      ['Grouped-Query & Multi-Head Latent Attention', 'Foundational', 'Compressing KV caches cleanly for long-context serving.'],
      ['State-Space Models (Mamba) vs. Attention', 'Intermediate', 'Comparing linear-time recurrent scans with quadratic attention.'],
      ['Long-Context RoPE Frequency Scaling', 'Honors', 'Extending positional context smoothly from 8k to 1M tokens.'],
      ['Reasoning Verifiers & Process Supervision', 'Olympiad', 'Rewarding intermediate proof correctness over lucky final guesses.'],
    ]],
    ['Autonomous Agents & Multi-Agent Systems', 'cyber-firewall', [
      ['Hierarchical Planning & Memory Architectures', 'Foundational', 'Episodic, semantic, and working state persistence for agents.'],
      ['Tool Sandboxing, Capability Tokens & Quotas', 'Intermediate', 'Cryptographically scoping every external API call an agent makes.'],
      ['Multi-Agent Debate & Verification', 'Honors', 'Catching reasoning errors through structured adversarial critique.'],
      ['Preventing Cascading Agent Loops & Runaway Cost', 'Olympiad', 'Circuit breakers, deterministic budgets, and human checkpoints.'],
    ]],
    ['Adversarial Robustness & AI Forensics', 'cyber-crypto', [
      ['Certified Robustness & Randomized Smoothing', 'Foundational', 'Mathematically bounding prediction stability within L2 balls.'],
      ['Cryptographic Media Provenance (C2PA)', 'Intermediate', 'Signing camera captures and verifying edit chains with PKI.'],
      ['Statistical Watermarking of Token Streams', 'Honors', 'Detecting synthetic green-list token biases without degrading fluency.'],
      ['Defending Federated Learning Against Poisoning', 'Olympiad', 'Byzantine-resilient gradient aggregation across untrusted clients.'],
    ]],
    ['Hardware-Software Co-Design for AI', 'net-binary', [
      ['Arithmetic Intensity & Roofline Models', 'Foundational', 'Identifying memory-bandwidth-bound vs. compute-bound kernels.'],
      ['Systolic Arrays & Tensor Core MatMul', 'Intermediate', 'Dataflow reuse patterns in dedicated matrix accelerators.'],
      ['INT4 Quantization (AWQ / GPTQ Intuition)', 'Honors', 'Preserving salient weight channels at 4-bit precision.'],
      ['Custom Kernel Fusion & Memory Coalescing', 'Olympiad', 'Eliminating round-trips to HBM memory between elementwise ops.'],
    ]],
    ['Causal Inference & Scientific ML', 'ai-perceptron', [
      ['Correlation vs. Intervention (do-Calculus)', 'Foundational', 'Why observational ML confuses ice cream sales with sunburns.'],
      ['Physics-Informed Neural Networks (PINNs)', 'Intermediate', 'Embedding differential equations directly into training loss.'],
      ['Graph & Protein Folding Architectures', 'Honors', 'SE(3) equivariant networks for 3D molecular geometry.'],
      ['Counterfactual Fairness Audits', 'Olympiad', 'Testing whether changing protected attributes alters decisions.'],
    ]],
    ['Production ML Reliability & MLOps', 'net-packets', [
      ['Serving Architecture: Continuous Batching', 'Foundational', 'Interleaving variable-length requests cleanly on inference servers.'],
      ['Shadow Deployments & Canary Rollouts', 'Intermediate', 'Testing new models safely on mirrored traffic before cutover.'],
      ['Feature Stores & Training-Serving Skew', 'Honors', 'Guaranteeing identical feature transforms online and offline.'],
      ['Incident Response for Model Failures', 'Olympiad', 'Rollback playbooks, confidence thresholds, and fallback heuristics.'],
    ]],
    ['AI Alignment & Capstone Architecture', 'ai-vision', [
      ['Mechanistic Interpretability Circuits', 'Foundational', 'Mapping induction heads and algorithmic sub-circuits inside weights.'],
      ['Scalable Oversight & Recursive Critique', 'Intermediate', 'Assisting human evaluators on tasks beyond raw human speed.'],
      ['Formal Verification of Neural Controllers', 'Honors', 'Proving safety bounds in robotics and autonomous navigation.'],
      ['Senior Capstone: End-to-End Safe AI System', 'Olympiad', 'Architecting data, model, security sandbox, and governance spec.'],
    ]],
  ],
};

const NETWORKING_CURRICULUM: GradeCurriculumMap = {
  1: [
    ['What Is a Network?', 'net-packets', [
      ['Connecting Friends: Strings, Roads & Wires', 'Foundational', 'Seeing how links connect devices just like roads connect houses.'],
      ['Messages Travel From Sender to Receiver', 'Foundational', 'Every message needs a "From", a "To", and a path between them.'],
      ['Wires vs. Invisible Wi-Fi Waves', 'Foundational', 'Comparing plugged-in cables with invisible radio waves in the air.'],
      ['Local Classroom vs. Whole-World Internet', 'Intermediate', 'Understanding how small home networks join the giant global web.'],
    ]],
    ['Binary Beacons: 0s and 1s', 'net-binary', [
      ['Light On (1) and Light Off (0)', 'Foundational', 'Sending secret yes/no signals using flashlights and switches.'],
      ['Counting in Binary With Fingers & Bulbs', 'Foundational', 'Making numbers 0 through 15 using four glowing bit lamps.'],
      ['Turning Letters Into Number Codes', 'Intermediate', 'How A, B, and C turn into 0s and 1s so wires can carry words.'],
      ['Bits vs. Bytes (8 Bits Make a Byte)', 'Intermediate', 'Bundling eight tiny switches together to store one letter.'],
    ]],
    ['Addresses & Digital Mailboxes', 'net-packets', [
      ['Why Every Computer Needs an Address', 'Foundational', 'Comparing street house numbers with digital IP addresses.'],
      ['The Router: Our Traffic Post Office', 'Foundational', 'How the box with blinking lights directs messages to the right room.'],
      ['Domain Names: Friendly Names for Numbers', 'Intermediate', 'Why typing a simple website name beats memorizing long numbers.'],
      ['What Happens When an Address Is Wrong?', 'Intermediate', 'Understanding "Page Not Found" like an undelivered letter.'],
    ]],
    ['Chopping Messages Into Packets', 'net-packets', [
      ['Why Giant Videos Travel in Tiny Pieces', 'Foundational', 'Splitting a big puzzle into numbered postcards so lines stay fast.'],
      ['Packet Labels: #1 of 4, #2 of 4', 'Foundational', 'Numbering pieces so the receiver puts the picture back in order.'],
      ['Taking Detours Around Busy Roads', 'Intermediate', 'How packets pick a faster path if one wire gets crowded.'],
      ['Checking If Any Packet Got Lost', 'Intermediate', 'Asking the sender to mail a missing puzzle piece again.'],
    ]],
    ['Home Wi-Fi & Everyday Devices', 'net-packets', [
      ['Inside Your Home Network', 'Foundational', 'Tablets, phones, printers, and TVs sharing one Wi-Fi router.'],
      ['Why Walls & Distance Slow Wi-Fi Down', 'Foundational', 'How thick walls weaken radio signals—and moving closer helps!'],
      ['Fiber Optic Cables: Messages Made of Light', 'Intermediate', 'Bouncing super-fast laser pulses through hair-thin glass strands.'],
      ['Undersea Internet Cables Across Oceans', 'Intermediate', 'Discovering that 98% of global internet data travels under oceans!'],
    ]],
    ['Clients, Servers & Websites', 'net-packets', [
      ['Asking a Server Like Ordering at a Bakery', 'Foundational', 'Your tablet (Client) asks politely, and a powerful computer (Server) replies.'],
      ['What Is a Data Center?', 'Foundational', 'Giant air-conditioned rooms full of blinking server racks.'],
      ['Web Browsers as Translators', 'Intermediate', 'Turning downloaded code into colorful pictures and buttons.'],
      ['Uploading vs. Downloading', 'Intermediate', 'Sending drawings out vs. bringing videos into your device.'],
    ]],
    ['Speed, Bandwidth & Waiting Time', 'net-packets', [
      ['Bandwidth: How Wide Is the Highway?', 'Foundational', 'Comparing a 1-lane country path with an 8-lane fiber highway.'],
      ['Latency (Ping): How Fast Is One Trip?', 'Foundational', 'Measuring how many milliseconds a tiny hello-packet takes.'],
      ['Why Video Games Care About Ping', 'Intermediate', 'Understanding lag when packets take a slow detour.'],
      ['Sharing Wi-Fi Fairly With Family', 'Intermediate', 'Why big downloads can pause someone else’s video call.'],
    ]],
    ['Safe & Kind Network Habits', 'cyber-firewall', [
      ['Public Wi-Fi vs. Home Wi-Fi', 'Foundational', 'Why coffee-shop Wi-Fi needs extra caution and grown-up permission.'],
      ['Looking for the HTTPS Padlock', 'Foundational', 'Spotting encrypted connections before entering school logins.'],
      ['Being Respectful on Shared Networks', 'Intermediate', 'Never hogging bandwidth or peeking at other people’s screens.'],
      ['How Internet Helpers Keep Websites Online', 'Olympiad', 'Backup servers and polite traffic rules keep learning sites running.'],
    ]],
  ],
  2: [
    ['Bits, Bytes & Binary Representation', 'net-binary', [
      ['Powers of Two: 1, 2, 4, 8, 16, 32, 64, 128', 'Foundational', 'Lighting up 8-bit switches to build any byte from 0 to 255.'],
      ['ASCII Alphabet Table in Binary', 'Foundational', 'Decoding 01001000 01001001 into "HI!" by hand.'],
      ['Kilobytes, Megabytes & Gigabytes', 'Intermediate', 'Comparing text notes, photos, and movies by byte size.'],
      ['Parity Bits: Catching Single Flipped Bits', 'Honors', 'Adding one extra check bit to spot static noise in transmission.'],
    ]],
    ['Topologies: How Networks Connect', 'net-packets', [
      ['Bus, Ring, Star & Mesh Shapes', 'Foundational', 'Drawing network maps and testing which fails if one wire breaks.'],
      ['Why Homes Use Star Topology (Switches)', 'Foundational', 'Connecting every device to a central switch or router hub.'],
      ['Mesh Networks & Self-Healing Paths', 'Intermediate', 'Why multiple backup links keep the internet running after storms.'],
      ['Hop Count: Counting Steps Across Routers', 'Intermediate', 'Measuring how many routers a packet visits from home to server.'],
    ]],
    ['IP Addresses & Ports', 'net-packets', [
      ['Anatomy of an IPv4 Address (4 Numbers 0–255)', 'Foundational', 'Understanding why each octet lives inside one 8-bit byte!'],
      ['Public vs. Private Home Addresses (192.168.x.x)', 'Intermediate', 'Why millions of homes can safely reuse 192.168.1.x inside.'],
      ['Ports: Apartment Doors Inside One Building', 'Intermediate', 'Port 80/443 for web pages vs. game server doors.'],
      ['Loopback 127.0.0.1: Talking to Yourself', 'Honors', 'Testing apps locally without leaving your own computer.'],
    ]],
    ['DNS: The Internet Phonebook', 'net-packets', [
      ['Translating Names to Numbers', 'Foundational', 'Turning easy domain names into exact IP addresses automatically.'],
      ['Step-by-Step DNS Lookup Journey', 'Intermediate', 'Asking local cache -> resolver -> root -> domain server.'],
      ['Caching: Remembering Recent Lookups', 'Intermediate', 'Why visiting a favorite site the second time loads even faster.'],
      ['Why DNS Errors Break Every Website', 'Honors', 'Seeing what happens when internet works by IP yet DNS fails.'],
    ]],
    ['Packet Switching & Headers', 'net-packets', [
      ['Inside a Packet: Header vs. Payload', 'Foundational', 'Separating the shipping label from the actual message inside.'],
      ['Time-To-Live (TTL): Preventing Endless Loops', 'Intermediate', 'Decrementing a counter at each hop so lost packets expire safely.'],
      ['Circuit Switching vs. Packet Switching', 'Intermediate', 'Why sharing packet lanes beats reserving empty private phone lines.'],
      ['Reassembling Out-of-Order Packets', 'Honors', 'Using sequence numbers to stitch scrambled arrivals back cleanly.'],
    ]],
    ['TCP vs. UDP Delivery Styles', 'net-packets', [
      ['TCP: Registered Mail With Receipts', 'Foundational', 'Checking every single packet arrived intact and in order.'],
      ['UDP: Fast Live Postcards for Video & Games', 'Foundational', 'Choosing speed over waiting when a dropped frame is already old.'],
      ['The Friendly Three-Way Handshake', 'Intermediate', 'SYN ("Hi?"), SYN-ACK ("Hi, ready!"), ACK ("Great, starting!").'],
      ['Picking TCP or UDP for Real Apps', 'Intermediate', 'Matching file downloads, chat, voice calls, and live streams cleanly.'],
    ]],
    ['Wired, Wireless & Satellite Links', 'net-binary', [
      ['Ethernet Copper Pulses vs. Fiber Light', 'Foundational', 'Comparing electrical signals with distortion-free glass fiber.'],
      ['Wi-Fi Radio Frequencies (2.4 GHz vs. 5 GHz)', 'Intermediate', 'Range through walls vs. high-speed crowded neighborhood channels.'],
      ['Bluetooth Short-Range Personal Links', 'Intermediate', 'Low-power wireless pairing for headphones and microcontrollers.'],
      ['Satellites & Cellular Towers', 'Honors', 'How remote villages and moving cars stay connected globally.'],
    ]],
    ['Network Troubleshooting Basics', 'net-packets', [
      ['Using Ping to Test Reachability', 'Foundational', 'Sending echo requests and reading round-trip milliseconds.'],
      ['Traceroute: Mapping Every Router Hop', 'Intermediate', 'Spotting where along the journey a slow bottleneck sits.'],
      ['Checklists: Cable, Wi-Fi, IP, DNS', 'Intermediate', 'Diagnosing "No Internet" systematically like a real network engineer.'],
      ['Reading Bandwidth Speed Tests', 'Olympiad', 'Distinguishing download, upload, jitter, and latency metrics.'],
    ]],
  ],
  3: [
    ['Layered Network Architecture', 'net-packets', [
      ['Why Engineers Stack Protocol Layers', 'Foundational', 'Dividing complex internet delivery into clean independent jobs.'],
      ['Application, Transport, Network & Link', 'Intermediate', 'Tracing a web click down the 4-layer TCP/IP stack.'],
      ['Encapsulation: Wrapping Envelopes Inside Envelopes', 'Intermediate', 'Adding HTTP -> TCP -> IP -> Ethernet headers step by step.'],
      ['Comparing TCP/IP With the 7-Layer OSI Model', 'Honors', 'Mapping Physical through Application layers cleanly.'],
    ]],
    ['MAC Addresses & Local Switches', 'net-binary', [
      ['Burned-In Hardware MAC Addresses (Hex)', 'Foundational', 'Reading 48-bit hexadecimal device IDs on network cards.'],
      ['Hexadecimal Counting (0–9, A–F)', 'Intermediate', 'Packing 4 binary bits cleanly into each single hex digit.'],
      ['How Ethernet Switches Learn Ports', 'Intermediate', 'Building MAC address tables instead of shouting to everyone like hubs.'],
      ['ARP: Finding Who Owns an IP Locally', 'Honors', 'Broadcasting "Who has 192.168.1.1?" to resolve local hardware IDs.'],
    ]],
    ['IPv4 Addressing & Subnets', 'net-binary', [
      ['Network Prefix vs. Host ID', 'Foundational', 'Separating neighborhood ZIP code bits from house number bits.'],
      ['Bitwise AND With Subnet Masks (255.255.255.0)', 'Intermediate', 'Using binary AND gates to discover if two computers are neighbors.'],
      ['Default Gateway: Leaving Your LAN', 'Intermediate', 'Sending packets to your router whenever destination sits outside subnet.'],
      ['DHCP: Automatic Address Assignment (DORA)', 'Honors', 'Discover, Offer, Request, Acknowledge when joining Wi-Fi.'],
    ]],
    ['Routing & Shortest Paths', 'net-packets', [
      ['Reading a Simple Routing Table', 'Foundational', 'Matching destination prefixes to next-hop interface ports.'],
      ['Static Routes vs. Dynamic Routing', 'Intermediate', 'Manual paths vs. routers automatically healing around outages.'],
      ['Graph Shortest Path (Dijkstra Intuition)', 'Intermediate', 'Scoring paths by hop count, speed, and congestion cost.'],
      ['Autonomous Systems & Internet Peering', 'Honors', 'How ISPs exchange global routes across internet exchange points.'],
    ]],
    ['Transport Reliability: TCP Mechanics', 'net-packets', [
      ['Sequence & Acknowledgment Numbers', 'Foundational', 'Tracking exact byte offsets across streaming segments.'],
      ['Timeouts & Packet Retransmission', 'Intermediate', 'Resending missing segments automatically without user effort.'],
      ['Flow Control: Matching Receiver Buffer Speed', 'Intermediate', 'Preventing fast servers from overflowing tiny IoT gadgets.'],
      ['Congestion Avoidance Intuition', 'Honors', 'Slowing sending rate politely when network queues start dropping.'],
    ]],
    ['HTTP & How the Web Works', 'net-packets', [
      ['Anatomy of a URL (Scheme, Host, Path)', 'Foundational', 'Breaking https://techhub.edu/ai/grade3 into exact parts.'],
      ['HTTP Request Methods: GET vs. POST', 'Intermediate', 'Fetching web pages vs. submitting quiz answers safely.'],
      ['HTTP Status Codes: 200, 301, 404, 500', 'Intermediate', 'Reading server health and error signals directly.'],
      ['Cookies & Sessions Across Stateless HTTP', 'Honors', 'Remembering logged-in progress cleanly across page clicks.'],
    ]],
    ['NAT, Firewalls & Wi-Fi Security', 'cyber-firewall', [
      ['Network Address Translation (NAT)', 'Foundational', 'Sharing one public home IP across dozens of family devices.'],
      ['Port Numbers & Service Identification', 'Intermediate', 'Recognizing DNS (53), HTTP (80), HTTPS (443), SSH (22).'],
      ['Stateful Packet Filtering Basics', 'Intermediate', 'Allowing replies back in while blocking unsolicited probes.'],
      ['WPA2 / WPA3 Wireless Encryption', 'Honors', 'Scrambling home radio waves so neighbors cannot eavesdrop.'],
    ]],
    ['Cloud Computing & CDNs', 'net-packets', [
      ['What Makes "The Cloud" Physical?', 'Foundational', 'Understanding servers, storage, and fiber behind cloud apps.'],
      ['Content Delivery Networks (CDNs)', 'Intermediate', 'Caching videos at nearby edge cities for instant playback.'],
      ['Load Balancers Distributing Traffic', 'Intermediate', 'Splitting millions of visitors evenly across healthy servers.'],
      ['Measuring Uptime & Redundancy (99.9%)', 'Olympiad', 'Designing failover paths so school apps stay online.'],
    ]],
  ],
  4: [
    ['Binary, Hex & Bitwise Networking Math', 'net-binary', [
      ['Converting Decimal, Binary & Hex Effortlessly', 'Foundational', 'Fast mental grouping of 4-bit nibbles into hex digits.'],
      ['Bitwise AND, OR & XOR on IP Octets', 'Intermediate', 'Computing network IDs and broadcast addresses cleanly.'],
      ['CIDR Slash Notation (/24, /26, /16)', 'Intermediate', 'Counting available host slots using 2^(32 - prefix) - 2.'],
      ['Subnetting a School Lab Network', 'Honors', 'Dividing one /24 block into 4 clean /26 classroom subnets.'],
    ]],
    ['DNS Hierarchy & Record Types', 'net-packets', [
      ['A, AAAA, CNAME & MX Records', 'Foundational', 'Mapping domains to IPv4, IPv6, aliases, and mail servers.'],
      ['Recursive vs. Authoritative DNS Servers', 'Intermediate', 'Tracing full iterative resolution from root hints downward.'],
      ['DNS TTL & Cache Propagation', 'Intermediate', 'Why website IP updates roll out gradually across the globe.'],
      ['DNS over HTTPS (DoH) Privacy', 'Honors', 'Encrypting domain lookups so local networks cannot spy on browsing.'],
    ]],
    ['Ethernet, Switching & VLANs', 'net-packets', [
      ['Collision Domains vs. Broadcast Domains', 'Foundational', 'Why switches isolate ports while routers contain broadcasts.'],
      ['Ethernet Frame Fields & CRC Checksums', 'Intermediate', 'Detecting corrupted bits at the link layer automatically.'],
      ['VLAN Tagging (802.1Q) Logical Isolation', 'Intermediate', 'Separating student laptops from school security cameras on one switch.'],
      ['Spanning Tree Protocol (STP) Loop Prevention', 'Honors', 'Blocking redundant bridge loops while keeping failover ready.'],
    ]],
    ['TCP State Machine & Sliding Windows', 'net-packets', [
      ['TCP Sliding Window Pipelining', 'Foundational', 'Sending multiple segments in flight instead of stop-and-wait.'],
      ['Bandwidth-Delay Product (BDP)', 'Intermediate', 'Calculating how many bytes fit inside a long fiber pipe.'],
      ['Graceful Teardown: FIN / ACK Close', 'Intermediate', 'Closing both sides of a socket cleanly without losing tail bytes.'],
      ['Head-of-Line Blocking in TCP Streams', 'Honors', 'Why one lost packet pauses later packets—motivating QUIC/HTTP3.'],
    ]],
    ['Web Protocols: HTTP/1.1, HTTP/2 & TLS', 'cyber-crypto', [
      ['Persistent Connections & Multiplexing', 'Foundational', 'Reusing one connection for dozens of images and scripts.'],
      ['HTTPS = HTTP Wrapped Inside TLS', 'Intermediate', 'Encrypting headers, URLs, and payloads end-to-end.'],
      ['REST APIs & JSON Payloads', 'Intermediate', 'How mobile apps fetch structured live data over HTTPS.'],
      ['WebSockets for Real-Time Multiplayer', 'Honors', 'Keeping full-duplex persistent channels open cleanly.'],
    ]],
    ['Wireless Physics & Cellular Networks', 'net-binary', [
      ['Signal-to-Noise Ratio (SNR) & Modulation', 'Foundational', 'Packing more bits per wave symbol when signal is crystal clear.'],
      ['CSMA/CA: Polite Talking Turns on Wi-Fi', 'Intermediate', 'Listen-before-transmit collision avoidance on shared radio airwaves.'],
      ['How 4G/5G Cell Handoffs Work', 'Intermediate', 'Keeping calls unbroken while riding in a fast train between towers.'],
      ['IoT Low-Power Protocols (LoRa & Zigbee)', 'Honors', 'Sending sensor bytes kilometers on coin-cell batteries.'],
    ]],
    ['Network Monitoring & Packet Inspection', 'net-packets', [
      ['Reading Packet Capture Timelines', 'Foundational', 'Tracing DNS -> TCP SYN -> TLS -> HTTP GET in real captures.'],
      ['Diagnosing Packet Loss vs. High Jitter', 'Intermediate', 'Distinguishing dropped packets from uneven delay spikes.'],
      ['Throughput Calculation & Overhead', 'Intermediate', 'Accounting for Ethernet/IP/TCP headers in real transfer speeds.'],
      ['Detecting Network Storms & Loops', 'Honors', 'Spotting abnormal broadcast floods on local switches.'],
    ]],
    ['Resilient Internet Architecture', 'net-packets', [
      ['IPv6: 128-Bit Future Addressing', 'Foundational', 'Why 4.3 billion IPv4 addresses ran out and how hex colons scale.'],
      ['Anycast Routing for Global Services', 'Intermediate', 'Sharing one IP worldwide so packets automatically hit the nearest city.'],
      ['BGP Autonomous System Path Selection', 'Intermediate', 'How giant internet backbones advertise reachability globally.'],
      ['Designing a Zero-Single-Point-of-Failure Lab', 'Olympiad', 'Combining dual ISPs, redundant switches, and Anycast DNS.'],
    ]],
  ],
  5: [
    ['IPv4 Subnetting & VLSM Engineering', 'net-binary', [
      ['Variable Length Subnet Masking (VLSM)', 'Foundational', 'Sizing subnets tightly without wasting scarce IP addresses.'],
      ['Route Summarization & Longest Prefix Match', 'Intermediate', 'How routers pick /26 over /24 in forwarding lookups.'],
      ['Private RFC 1918 Ranges & CGNAT', 'Intermediate', 'Understanding 10.0.0.0/8, 172.16.0.0/12, and carrier NAT.'],
      ['ARP Cache Poisoning Risks & Static Safeguards', 'Honors', 'Why unauthenticated local ARP relies on trust—and DAI defenses.'],
    ]],
    ['Routing Algorithms: Distance-Vector vs. Link-State', 'net-packets', [
      ['Bellman-Ford & Count-to-Infinity', 'Foundational', 'Why naive hop-by-hop gossip struggles when links fail.'],
      ['OSPF Link-State Shortest Path First', 'Intermediate', 'Sharing full topology maps so every router runs Dijkstra locally.'],
      ['OSPF Areas & Hierarchical Scaling', 'Intermediate', 'Preventing massive routing recalculations across campuses.'],
      ['Equal-Cost Multi-Path (ECMP) Hashing', 'Honors', 'Splitting flows evenly across parallel backbone links.'],
    ]],
    ['Transport Layer Engineering & QUIC', 'net-packets', [
      ['Congestion Control: Slow Start & AIMD', 'Foundational', 'Doubling window until loss, then backing off smoothly.'],
      ['CUBIC & BBR Bottleneck Modeling', 'Intermediate', 'Pacing packets by bottleneck bandwidth and min RTT.'],
      ['QUIC Over UDP: 0-RTT & Independent Streams', 'Intermediate', 'Eliminating TCP head-of-line blocking and encrypting headers.'],
      ['Tuning Socket Buffers & Keepalives', 'Honors', 'Optimizing interactive telemetry streams over high-latency links.'],
    ]],
    ['DNS Architecture, Anycast & DNSSEC', 'cyber-crypto', [
      ['Glue Records & Delegation Chains', 'Foundational', 'Resolving circular nameserver lookups at TLD boundaries.'],
      ['Anycast BGP Route Convergence', 'Intermediate', 'Serving global root DNS servers from hundreds of edge pops.'],
      ['DNSSEC Cryptographic RRSIG Signatures', 'Intermediate', 'Signing DNS answers so spoofed cache poisoning is caught.'],
      ['Split-Horizon Internal vs. External DNS', 'Honors', 'Serving internal campus IPs privately while hiding topology.'],
    ]],
    ['Reverse Proxies, Gateways & Caching', 'net-packets', [
      ['Forward Proxy vs. Reverse Proxy', 'Foundational', 'Protecting outbound clients vs. shielding backend origin servers.'],
      ['TLS Termination & Upstream Pooling', 'Intermediate', 'Offloading crypto handshakes cleanly at edge proxies.'],
      ['HTTP Cache-Control & ETag Validation', 'Intermediate', 'Saving 80% bandwidth using conditional 304 Not Modified replies.'],
      ['Rate Limiting: Token Bucket Algorithms', 'Honors', 'Throttling bursty traffic politely without dropping normal users.'],
    ]],
    ['IPv6 Transition & Neighbor Discovery', 'net-binary', [
      ['IPv6 Hex Compression (::) & Scopes', 'Foundational', 'Distinguishing link-local fe80:: from global unicast prefixes.'],
      ['SLAAC Stateless Autoconfiguration', 'Intermediate', 'Generating host addresses from Router Advertisements without DHCP.'],
      ['ICMPv6 Neighbor Discovery Protocol (NDP)', 'Intermediate', 'Replacing IPv4 ARP cleanly using multicast solicitation.'],
      ['Dual-Stack & NAT64/DNS64 Coexistence', 'Honors', 'Bridging IPv6-only networks seamlessly to legacy IPv4 servers.'],
    ]],
    ['Network Security Controls', 'cyber-firewall', [
      ['Stateless ACLs vs. Stateful Inspection', 'Foundational', 'Tracking TCP connection state tables in modern firewalls.'],
      ['IDS vs. IPS Signature & Anomaly Detection', 'Intermediate', 'Alerting vs. actively dropping suspicious network payloads.'],
      ['DMZ Segmentation Architecture', 'Intermediate', 'Isolating public web servers from internal student databases.'],
      ['Encrypted VPN Tunnels (IPsec & WireGuard)', 'Honors', 'Wrapping private packets securely across untrusted public lines.'],
    ]],
    ['Cloud & Software-Defined Networking', 'net-packets', [
      ['Virtual Private Clouds (VPC) & Virtual Subnets', 'Foundational', 'Software-defined routing tables and internet gateways in cloud.'],
      ['Control Plane vs. Data Plane Separation', 'Intermediate', 'Why decoupling routing intelligence from packet forwarding scales.'],
      ['Container Bridge & Overlay Networks', 'Intermediate', 'Connecting microservices across hosts using VXLAN tunnels.'],
      ['Designing Multi-Region Disaster Failover', 'Olympiad', 'Combining health checks, DNS failover, and stateful replication.'],
    ]],
  ],
  6: [
    ['Autonomous Systems & BGP Fundamentals', 'net-packets', [
      ['Tier-1, Tier-2 & Stub Networks', 'Foundational', 'Transit customer-provider economics vs. settlement-free peering.'],
      ['BGP Path Attributes: AS-PATH & LOCAL-PREF', 'Intermediate', 'Steering outbound and inbound internet routes by policy.'],
      ['BGP Hijacks & Route Leaks Explained', 'Intermediate', 'How accidental or malicious prefix announcements misroute traffic.'],
      ['RPKI Origin Validation Defenses', 'Honors', 'Using cryptographic ROAs to reject forged BGP prefix origins.'],
    ]],
    ['High-Performance Switching & Queuing', 'net-packets', [
      ['Cut-Through vs. Store-and-Forward Switching', 'Foundational', 'Trading microsecond latency against link-layer CRC verification.'],
      ['QoS Traffic Shaping & DSCP Markings', 'Intermediate', 'Prioritizing real-time voice/video queues ahead of bulk backups.'],
      ['Bufferbloat & Active Queue Management (FQ-CoDel)', 'Intermediate', 'Why oversized router queues ruin interactive gaming latency.'],
      ['Link Aggregation (LACP) Bonding', 'Honors', 'Combining multiple physical ports for higher throughput and failover.'],
    ]],
    ['TLS 1.3 & Modern Secure Transport', 'cyber-crypto', [
      ['1-RTT Handshake & Forward Secrecy (ECDHE)', 'Foundational', 'Negotiating ephemeral session keys in a single round trip.'],
      ['Eliminating Legacy Weak Ciphers in TLS 1.3', 'Intermediate', 'Why static RSA key exchange and CBC padding were removed.'],
      ['Mutual TLS (mTLS) Service Authentication', 'Intermediate', 'Verifying both client and server certificates in microservices.'],
      ['Certificate Transparency Logs', 'Honors', 'Auditing public ledgers to catch misissued domain certificates.'],
    ]],
    ['Packet Captures & Protocol Forensics', 'net-packets', [
      ['BPF Capture Filters vs. Display Filters', 'Foundational', 'Isolating suspicious flows quickly in high-volume captures.'],
      ['Reassembling TCP Streams & Detecting Drops', 'Intermediate', 'Spotting duplicate ACKs, fast retransmits, and zero-window stalls.'],
      ['Analyzing DNS Tunneling Anomalies', 'Intermediate', 'Recognizing unusually long high-entropy subdomain exfiltration queries.'],
      ['Timing & Metadata Analysis Under Encryption', 'Honors', 'Understanding what packet sizes and timing reveal even over HTTPS.'],
    ]],
    ['Distributed Systems Networking', 'net-packets', [
      ['RPC, gRPC & Protocol Buffers Framing', 'Foundational', 'Compact binary serialization over multiplexed HTTP/2 streams.'],
      ['Consistent Hashing for Distributed Caches', 'Intermediate', 'Minimizing key reshuffling when cluster nodes join or leave.'],
      ['Gossip Protocols & Failure Detection', 'Intermediate', 'Spreading cluster membership state reliably without central brokers.'],
      ['CAP Theorem Trade-Offs During Partitions', 'Honors', 'Choosing Consistency vs. Availability when network links sever.'],
    ]],
    ['Zero-Trust Network Access (ZTNA)', 'cyber-firewall', [
      ['Why Castle-and-Moat Perimeters Failed', 'Foundational', 'Moving identity checks from IP location to every request.'],
      ['Microsegmentation & East-West Firewalls', 'Intermediate', 'Stopping lateral movement between internal servers after breach.'],
      ['802.1X Port-Based Network Access Control', 'Intermediate', 'Requiring device certificates before switch ports forward traffic.'],
      ['Identity-Aware Proxies & Device Posture', 'Honors', 'Verifying OS patch health and user MFA before granting access.'],
    ]],
    ['Optical Fiber & Submarine Backbones', 'net-binary', [
      ['Single-Mode vs. Multi-Mode Fiber Physics', 'Foundational', 'Total internal reflection and modal dispersion across distances.'],
      ['Dense Wavelength Division Multiplexing (DWDM)', 'Intermediate', 'Sending dozens of separate laser colors simultaneously in one strand.'],
      ['Speed of Light in Glass (~200,000 km/s)', 'Intermediate', 'Calculating physical minimum transatlantic ping bounds.'],
      ['Optical Amplifiers & Repeaters on Ocean Floors', 'Honors', 'Boosting signals every ~80 km using erbium-doped fiber.'],
    ]],
    ['Architecting School & Campus Networks', 'net-packets', [
      ['Three-Tier vs. Spine-Leaf Data Center Fabric', 'Foundational', 'Predictable east-west hop counts in modern Clos fabrics.'],
      ['Wi-Fi Channel Planning & Roaming (802.11r)', 'Intermediate', 'Preventing co-channel interference across dense classrooms.'],
      ['Out-of-Band Management Networks', 'Intermediate', 'Keeping admin consoles reachable even during primary outages.'],
      ['Chaos Testing Network Partitions', 'Olympiad', 'Injecting controlled latency and drops to prove system resilience.'],
    ]],
  ],
  7: [
    ['Advanced TCP/IP Internals & Kernel Sockets', 'net-packets', [
      ['Socket States: LISTEN, SYN_RCVD, ESTABLISHED', 'Foundational', 'Tracing kernel listen backlogs and TIME_WAIT recycling.'],
      ['SYN Flood Attacks & SYN Cookies', 'Intermediate', 'Stateless cryptographic sequence numbers defending half-open queues.'],
      ['TCP Fast Open & Nagle Algorithm', 'Intermediate', 'Balancing small-packet coalescing against interactive latency.'],
      ['MTU Discovery & IP Fragmentation Hazards', 'Honors', 'Avoiding black-hole fragmentation via ICMP Path MTU checks.'],
    ]],
    ['Enterprise Routing & MPLS', 'net-packets', [
      ['MPLS Label Switching vs. Longest Prefix', 'Foundational', 'Fast fixed-label forwarding across ISP core routers.'],
      ['VRF Virtual Routing Tables', 'Intermediate', 'Isolating customer routing planes securely on shared hardware.'],
      ['BGP Route Reflectors & Communities', 'Intermediate', 'Scaling full-mesh iBGP topologies cleanly across regions.'],
      ['Anycast + BGP Traffic Engineering', 'Honors', 'Draining regional PoPs gracefully during maintenance windows.'],
    ]],
    ['HTTP/3, QUIC & Edge Compute', 'net-packets', [
      ['QUIC Connection Migration Across Wi-Fi/5G', 'Foundational', 'Preserving downloads seamlessly via Connection IDs when IP changes.'],
      ['QPACK Header Compression', 'Intermediate', 'Compressing repetitive HTTP headers safely without stream blocking.'],
      ['Serverless Edge Workers & Cold Starts', 'Intermediate', 'Executing lightweight logic within 20 ms of end users.'],
      ['DDoS Absorption at Anycast Scrubbing Centers', 'Honors', 'Filtering volumetric UDP amplification floods before origin impact.'],
    ]],
    ['DNS Security, DoT & Split-DNS Forensics', 'cyber-firewall', [
      ['DNS Cache Poisoning & Source Port Randomization', 'Foundational', 'Why Kaminsky-style attacks forced 16-bit port + ID entropy.'],
      ['DNSCrypt, DoT (853) & DoH (443) Trade-Offs', 'Intermediate', 'Balancing user privacy against enterprise visibility.'],
      ['Sinkholing Malicious Command Domains', 'Intermediate', 'Redirecting compromised device beacons safely in blue-team defense.'],
      ['RPZ Response Policy Zones', 'Honors', 'Blocking phishing and malware domains directly at resolver layer.'],
    ]],
    ['Wireless Security & RF Engineering', 'net-binary', [
      ['WPA3 Simultaneous Authentication of Equals', 'Foundational', 'Defeating offline dictionary cracking via Dragonfly handshake.'],
      ['PMF Protected Management Frames (802.11w)', 'Intermediate', 'Blocking forged deauthentication disconnect attacks.'],
      ['Rogue Access Point & Evil Twin Detection', 'Intermediate', 'Spotting spoofed SSID beacons in campus airspaces.'],
      ['Beamforming & MU-MIMO Spatial Streams', 'Honors', 'Focusing phased-array Wi-Fi energy toward individual devices.'],
    ]],
    ['SD-WAN, WireGuard & Overlay Tunnels', 'cyber-crypto', [
      ['WireGuard Cryptokey Routing Simplicity', 'Foundational', 'Binding allowed IP prefixes directly to Curve25519 public keys.'],
      ['MTU Overhead Inside Encapsulated Tunnels', 'Intermediate', 'Subtracting VXLAN/WireGuard headers cleanly to stop fragmentation.'],
      ['NAT Traversal: STUN, TURN & ICE Hole Punching', 'Intermediate', 'Establishing direct peer-to-peer links behind home routers.'],
      ['Multi-Path SD-WAN Link Bonding', 'Honors', 'Steering voice over fiber while failing over seamlessly to 5G.'],
    ]],
    ['Observability, NetFlow & Telemetry', 'net-packets', [
      ['NetFlow / IPFIX Flow Record Aggregation', 'Foundational', 'Summarizing millions of packets into compact flow telemetry.'],
      ['SNMPv3 AuthPriv vs. Streaming gNMI', 'Intermediate', 'Replacing legacy polling with encrypted push-based telemetry.'],
      ['Synthetic Probes & Blackbox Monitoring', 'Intermediate', 'Measuring real user SLA latency from global vantage points.'],
      ['Correlating Network Latency With App Traces', 'Honors', 'Distinguishing DNS stall, TLS handshake, and server CPU delay.'],
    ]],
    ['Satellite Constellations & Delay-Tolerant Nets', 'net-packets', [
      ['GEO (35,786 km) vs. LEO (550 km) Orbits', 'Foundational', 'Why low-earth laser mesh cuts satellite ping from 600 ms to 30 ms.'],
      ['Inter-Satellite Optical Laser Links', 'Intermediate', 'Routing packets faster in vacuum than in bent undersea fiber!'],
      ['Store-Carry-Forward Bundle Protocols', 'Intermediate', 'Networking across intermittent deep-space and Mars relays.'],
      ['Designing Global Resilient Backbone Topology', 'Olympiad', 'Modeling orbital handoffs, ground stations, and congestion paths.'],
    ]],
  ],
  8: [
    ['Linux Networking Stack & Packet Path', 'net-packets', [
      ['NIC Rings, Interrupts & NAPI Polling', 'Foundational', 'Moving frames from wire to kernel sk_buff structures efficiently.'],
      ['Netfilter Hooks & nftables Chains', 'Intermediate', 'Tracing prerouting, forward, and postrouting packet stages.'],
      ['eBPF & XDP Wire-Speed Packet Filtering', 'Intermediate', 'Dropping DDoS floods directly in driver rings before kernel alloc.'],
      ['Network Namespaces & Virtual Ethernet Pairs', 'Honors', 'Isolating independent routing stacks for every Linux container.'],
    ]],
    ['Consensus & Distributed Network Protocols', 'net-packets', [
      ['Logical Clocks & Lamport Timestamps', 'Foundational', 'Ordering distributed events without synchronized physical watches.'],
      ['Raft Leader Election & Log Replication', 'Intermediate', 'Maintaining fault-tolerant configuration state across 3 or 5 nodes.'],
      ['Split-Brain Scenarios & Quorum Math', 'Intermediate', 'Why majority quorums (⌊N/2⌋ + 1) forbid conflicting leaders.'],
      ['Vector Clocks & Conflict Resolution', 'Honors', 'Detecting concurrent writes across partitioned geo-replicas.'],
    ]],
    ['High-Scale Load Balancing & Service Mesh', 'net-packets', [
      ['L4 DSR (Direct Server Return) vs. L7 Proxy', 'Foundational', 'Scaling asymmetric video egress past proxy bottlenecks.'],
      ['Maglev Consistent Hashing Tables', 'Intermediate', 'Even load distribution across backend pools with fast lookup.'],
      ['Circuit Breakers, Retries & Jittered Backoff', 'Intermediate', 'Preventing retry storms from crushing recovering services.'],
      ['Service Mesh Sidecar mTLS Identity (SPIFFE)', 'Honors', 'Rotating short-lived workload certificates automatically.'],
    ]],
    ['Deep BGP & Internet Security', 'cyber-firewall', [
      ['BGP Flowspec & Automated Blackholing', 'Foundational', 'Propagating emergency DDoS mitigation filters upstream.'],
      ['MANRS Best Practices & IRR Filtering', 'Intermediate', 'Enforcing prefix filters between transit providers and peers.'],
      ['ROV + BGPsec Path Validation Challenges', 'Intermediate', 'Understanding why origin crypto deployed faster than full path signing.'],
      ['Analyzing Historical Global Outages', 'Honors', 'Dissecting famous BGP config leaks and DNS failure cascades.'],
    ]],
    ['Cryptography in Transport Protocols', 'cyber-crypto', [
      ['AEAD Ciphers: AES-GCM & ChaCha20-Poly1305', 'Foundational', 'Combining confidentiality and integrity tags in one pass.'],
      ['TLS 1.3 Key Schedule & HKDF Derivation', 'Intermediate', 'Deriving handshake and application traffic secrets cleanly.'],
      ['ECH Encrypted Client Hello Privacy', 'Intermediate', 'Hiding SNI domain names from passive network observers.'],
      ['Zero-RTT Replay Attack Hazards', 'Honors', 'Why 0-RTT early data must only trigger idempotent GET requests.'],
    ]],
    ['Hardware Routing & P4 Programmable Planes', 'net-binary', [
      ['TCAM Ternary Content-Addressable Memory', 'Foundational', 'Matching longest IP prefixes in a single hardware clock cycle.'],
      ['ASIC Switch Pipelines & Match-Action Tables', 'Intermediate', 'Parsing custom headers at multi-terabit port speeds.'],
      ['P4 In-Band Network Telemetry (INT)', 'Intermediate', 'Stamping live queue depth and hop timestamps inside packets.'],
      ['RDMA & RoCEv2 Lossless Fabrics', 'Honors', 'Bypassing OS kernels for microsecond AI cluster communication.'],
    ]],
    ['Zero-Trust Architecture & Secure Remote Access', 'cyber-firewall', [
      ['BeyondCorp Access Model Principles', 'Foundational', 'Replacing VPN trust-all subnets with per-app authorization.'],
      ['Short-Lived SSH Certificates vs. Static Keys', 'Intermediate', 'Eliminating forgotten authorized_keys sprawl across fleets.'],
      ['Microsegmented Egress Controls', 'Intermediate', 'Blocking compromised workloads from reaching unauthorized IPs.'],
      ['Detecting C2 Beaconing via Periodic Flow Analysis', 'Honors', 'Identifying stealthy command-and-control intervals in NetFlow.'],
    ]],
    ['Network Forensics & Defensive Architecture', 'cyber-firewall', [
      ['Full-Packet PCAP Evidence Integrity', 'Foundational', 'Hashing captures and preserving chain of custody.'],
      ['JA3/JA4 TLS Client Fingerprinting', 'Intermediate', 'Spotting anomalous non-browser tools from handshake parameters.'],
      ['Deception Networking & Honeypot Traps', 'Intermediate', 'Detecting intruders immediately when they probe unused dark IPs.'],
      ['Capstone: Enterprise Resilient Zero-Trust Design', 'Olympiad', 'Integrating BGP RPKI, Spine-Leaf, mTLS, XDP, and SOC telemetry.'],
    ]],
  ],
  9: [
    ['Queueing Theory & Network Calculus', 'net-packets', [
      ['Little Law: L = λ · W in Packet Queues', 'Foundational', 'Relating average queue depth, arrival rate, and waiting time.'],
      ['M/M/1 Queue Utilization & Tail Latency', 'Intermediate', 'Why pushing link utilization past 85% causes exponential delay spikes.'],
      ['Pareto Heavy-Tailed Traffic Bursts', 'Honors', 'Why real web traffic is fractal and breaks Poisson assumptions.'],
      ['Pacing & Token-Bucket Worst-Case Bounds', 'Olympiad', 'Bounding deterministic latency in industrial TSN networks.'],
    ]],
    ['Kernel Bypass, XDP & DPDK Systems', 'net-packets', [
      ['System Call & Context-Switch Costs at 100 Gbps', 'Foundational', 'Calculating packet budget: 6.7 nanoseconds per 64B frame!'],
      ['AF_XDP Zero-Copy Rings', 'Intermediate', 'Sharing DMA descriptors safely between NIC and user space.'],
      ['RSS Receive-Side Scaling Across CPU Cores', 'Honors', 'Hashing 5-tuples to avoid cross-core cache lock contention.'],
      ['Designing a 10M PPS DDoS Mitigation Filter', 'Olympiad', 'Combining eBPF maps, syn-proxy, and hardware offloads.'],
    ]],
    ['Distributed Consensus & Geo-Replication', 'net-packets', [
      ['FLP Impossibility & Partial Synchrony', 'Foundational', 'Why deterministic consensus cannot guarantee liveness asynchronously.'],
      ['Multi-Paxos & Raft Performance Bottlenecks', 'Intermediate', 'Batching, pipelining, and read-leases for low-latency quorums.'],
      ['TrueTime & Spanner External Consistency', 'Honors', 'Bounding clock uncertainty to order global transactions safely.'],
      ['Byzantine Fault Tolerance (PBFT 3f+1 Bound)', 'Olympiad', 'Tolerating maliciously lying nodes in adversarial networks.'],
    ]],
    ['Post-Quantum Transport Cryptography', 'cyber-crypto', [
      ['Hybrid X25519 + ML-KEM in TLS 1.3', 'Foundational', 'Protecting today’s traffic against "Harvest Now, Decrypt Later".'],
      ['Handshake Size Expansion & Fragmentation', 'Intermediate', 'Managing larger kilobyte post-quantum keys inside initial packets.'],
      ['Stateless vs. Stateful Post-Quantum Signatures', 'Honors', 'Evaluating ML-DSA bandwidth costs in PKI certificate chains.'],
      ['Crypto-Agility in Long-Lived Network Firmware', 'Olympiad', 'Upgrading embedded routers safely without bricking field devices.'],
    ]],
    ['Internet-Scale Traffic Engineering', 'net-packets', [
      ['Global CDN Anycast & DNS Steering Hybrid', 'Foundational', 'Combining BGP proximity with real-time congestion telemetry.'],
      ['Max-Flow Min-Cut Backbone Optimization', 'Intermediate', 'Allocating WAN tunnels to maximize total throughput under failures.'],
      ['BGP Route Optimization & Peering Economics', 'Honors', 'Minimizing transit cost while maintaining <50ms regional RTT.'],
      ['Simulating Submarine Cable Cuts', 'Olympiad', 'Modeling cascade re-routing across transoceanic fiber meshes.'],
    ]],
    ['Protocol Fuzzing & Implementation Hardening', 'cyber-firewall', [
      ['Parsing Ambiguities & Packet Smuggling', 'Foundational', 'How disagreeing proxies enable HTTP request smuggling.'],
      ['Coverage-Guided Protocol Fuzzing', 'Intermediate', 'Discovering state-machine crashes in custom network parsers.'],
      ['Memory-Safe Network Daemons in Rust', 'Honors', 'Eliminating spatial and temporal memory bugs at wire boundaries.'],
      ['Formal State-Machine Modeling (TLA+ Intuition)', 'Olympiad', 'Proving absence of deadlocks in custom handshake protocols.'],
    ]],
    ['Privacy-Preserving & Anonymous Routing', 'cyber-crypto', [
      ['Onion Routing & Layered Ephemeral Keys', 'Foundational', 'Why each relay peels only one encryption layer and knows one hop.'],
      ['Mixnets & Timing-Correlation Defenses', 'Intermediate', 'Adding cover traffic and batch shuffling against global observers.'],
      ['Oblivious DNS (ODoH) Proxy Separation', 'Honors', 'Separating who asks from what domain was queried cleanly.'],
      ['Traffic Analysis & Website Fingerprinting Limits', 'Olympiad', 'Constant-rate padding vs. bandwidth overhead trade-offs.'],
    ]],
    ['Senior Network Architecture Capstone', 'net-packets', [
      ['Designing Zero-Downtime Multi-Region Clouds', 'Foundational', 'Active-active traffic steering and state conflict strategies.'],
      ['Autonomous Network Remediation Closed Loops', 'Intermediate', 'Streaming telemetry -> anomaly detection -> safe config rollback.'],
      ['Auditing Complete End-to-End Packet Security', 'Honors', 'Verifying L2/L3/L4/L7 isolation and cryptographic authenticity.'],
      ['Mastery Defense: Global Kids Learning Backbone', 'Olympiad', 'Full capacity, latency, RPKI, TLS, and DDoS engineering spec.'],
    ]],
  ],
};

const CYBERSECURITY_CURRICULUM: GradeCurriculumMap = {
  1: [
    ['Secret Keys & Strong Passwords', 'cyber-crypto', [
      ['What Makes a Password Strong?', 'Foundational', 'Comparing easy words like "1234" with secret three-word passphrases.'],
      ['Never Reuse the Same Key Everywhere', 'Foundational', 'Why one house key shouldn’t unlock your bike, diary, and school!'],
      ['Keeping Passwords Private From Friends', 'Foundational', 'Why true friends respect privacy and never share login secrets.'],
      ['Creating Fun Memorable Three-Word Secrets', 'Intermediate', 'Combining silly images like "Purple-Rocket-Panda!" safely.'],
    ]],
    ['Private vs. Public Information', 'cyber-firewall', [
      ['What Is Safe to Share Online?', 'Foundational', 'Favorite color or pet vs. full name, school, and home address.'],
      ['Pictures Carry Hidden Clues', 'Foundational', 'Spotting street signs, school logos, and reflections in photos.'],
      ['Username Safety: Pick a Fun Nickname', 'Intermediate', 'Inventing cool gamer tags that do not reveal your real age or city.'],
      ['Ask a Grown-Up Before Signing Up', 'Intermediate', 'Checking app permissions and age rules with a trusted adult.'],
    ]],
    ['Spotting Tricks & Pop-Up Traps', 'cyber-firewall', [
      ['Too-Good-to-Be-True Free Prizes', 'Foundational', 'Recognizing fake "You won a free tablet!" flashing pop-ups.'],
      ['Look Closely at Strange Links', 'Foundational', 'Hovering and reading web addresses before ever tapping.'],
      ['When Someone Pretends to Be a Friend', 'Intermediate', 'Verifying surprising messages in real life before trusting.'],
      ['Calm Steps If You Click Something Weird', 'Intermediate', 'Close the tab, tell a trusted adult, and never panic!'],
    ]],
    ['Secret Codes & Simple Ciphers', 'cyber-crypto', [
      ['Writing Secret Messages With Shift Wheels', 'Foundational', 'Sliding letters forward by 3 steps (Caesar Cipher) for fun.'],
      ['Decoding Hidden Words Backwards', 'Foundational', 'Using the secret key number to turn scrambled letters back to words.'],
      ['Symbol Substitution Puzzles', 'Intermediate', 'Replacing A, E, I, O, U with stars, moons, and triangles.'],
      ['Why Secret Keys Must Stay Secret', 'Intermediate', 'Seeing how sharing the shift number unlocks every message.'],
    ]],
    ['Padlocks & Safe Websites', 'cyber-crypto', [
      ['Finding the Padlock Icon in Browsers', 'Foundational', 'What HTTPS means: wrapping your message in a locked envelope.'],
      ['Locked Envelope vs. Open Postcard', 'Foundational', 'Why plain HTTP lets eavesdroppers read messages on shared Wi-Fi.'],
      ['Trusted Official Websites vs. Look-Alikes', 'Intermediate', 'Checking spellings like "sch00l.com" vs. "school.edu".'],
      ['Logging Out on Shared School Computers', 'Intermediate', 'Closing your locker cleanly so the next student cannot peek.'],
    ]],
    ['Healthy Devices & Updates', 'cyber-firewall', [
      ['What Is a Computer Bug or Glitch?', 'Foundational', 'Tiny mistakes programmers fix to keep apps safe and smooth.'],
      ['Why Software Updates Are Shield Upgrades', 'Foundational', 'Installing updates patches holes before bad software sneaks in.'],
      ['What Is Malware (Bad Software)?', 'Intermediate', 'Understanding digital germs like annoying pop-ups and hidden trackers.'],
      ['Safe App Stores vs. Unknown Downloads', 'Intermediate', 'Downloading games only from trusted verified stores with parents.'],
    ]],
    ['Backups & Digital Footprints', 'cyber-firewall', [
      ['Saving Backup Copies of Favorite Work', 'Foundational', 'Keeping an extra copy of homework and drawings in case of spills.'],
      ['What Is a Digital Footprint?', 'Foundational', 'Understanding that posts, comments, and scores leave lasting trails.'],
      ['Kindness & Respect in Digital Spaces', 'Intermediate', 'Standing up politely and reporting cyberbullying immediately.'],
      ['Screen Balance & Lock Screens', 'Intermediate', 'Using PINs or biometrics so unattended tablets lock safely.'],
    ]],
    ['Junior Cyber Defender Mission', 'cyber-firewall', [
      ['The CIA Triad for Kids: Secret, Real, Ready', 'Foundational', 'Keeping secrets safe (Confidentiality), unchanged (Integrity), working (Availability).'],
      ['Checking App Permission Requests', 'Intermediate', 'Asking why a flashlight game wants microphone or contacts access!'],
      ['Building a Family Cyber Safety Plan', 'Intermediate', 'Emergency contacts, password safety, and screen-lock habits.'],
      ['Cyber Guardian Graduation Challenge', 'Olympiad', 'Solving 5 mini safety mysteries across links, locks, and codes.'],
    ]],
  ],
  2: [
    ['Passphrases & Password Strength', 'cyber-crypto', [
      ['Why Length Beats Weird Symbols Alone', 'Foundational', 'Comparing 8 tricky characters vs. 4 random words ("CorrectHorse...").'],
      ['How Fast Do Computers Guess Passwords?', 'Intermediate', 'Seeing why 4-digit PINs take milliseconds while 16 chars take centuries.'],
      ['What Is a Password Manager Vault?', 'Intermediate', 'Locking 50 unique passwords behind one strong master passphrase.'],
      ['Two-Factor Authentication (2FA) Magic Shield', 'Honors', 'Something you know (password) + something you have (code/key).'],
    ]],
    ['Classical Cryptography Lab', 'cyber-crypto', [
      ['Caesar Cipher Modular Wrap-Around (Z -> A)', 'Foundational', 'Using clock arithmetic (mod 26) to shift letters cleanly.'],
      ['Cracking Caesar by Brute-Force (25 Tries)', 'Intermediate', 'Testing every possible wheel turn until English words pop out.'],
      ['Monoalphabetic Substitution Ciphers', 'Intermediate', 'Expanding keys from 25 choices to trillions of letter scrambles.'],
      ['Letter Frequency Clues (Why E Shows Up Most)', 'Honors', 'Counting E, T, A, O to crack substitution codes without guessing.'],
    ]],
    ['Phishing & Social Engineering', 'cyber-firewall', [
      ['Why Hackers Trick Humans Instead of Math', 'Foundational', 'Using urgency ("Act in 5 minutes!") to make kids rush clicks.'],
      ['Spotting Look-Alike Sender Emails', 'Intermediate', 'Checking real sender domains behind friendly display names.'],
      ['Fake Login Pages & Credential Traps', 'Intermediate', 'Why typing passwords into unknown links hands over your account.'],
      ['Pretexting & Gaming Skin Scams', 'Honors', 'Recognizing "trade your rare item first" tricks in online games.'],
    ]],
    ['Firewalls & Safe Traffic Gates', 'cyber-firewall', [
      ['The Bouncer at the Network Door', 'Foundational', 'Allowing friendly homework packets while blocking strangers.'],
      ['Ports as Numbered Doors on Your Computer', 'Intermediate', 'Closing unused doors so sneaky programs cannot knock inside.'],
      ['Allow-Lists vs. Block-Lists', 'Intermediate', 'Comparing "only trusted friends allowed" with blocking known troublemakers.'],
      ['Testing Simple Packet Filter Rules', 'Honors', 'Deciding ALLOW or BLOCK on sample incoming packets.'],
    ]],
    ['Malware Families & Defenses', 'cyber-firewall', [
      ['Viruses, Worms & Trojan Horses', 'Foundational', 'Attaching to files vs. spreading on networks vs. hiding inside free gifts.'],
      ['Adware & Spyware Trackers', 'Intermediate', 'Catching sneaky programs that watch browsing or flood ads.'],
      ['Ransomware & Why Offline Backups Win', 'Intermediate', 'Having clean external backups makes ransom demands powerless!'],
      ['How Antivirus Scanners Spot Signatures', 'Honors', 'Matching suspicious file fingerprints against known threat catalogs.'],
    ]],
    ['HTTPS, Certificates & Encryption', 'cyber-crypto', [
      ['Symmetric Encryption: One Shared Key', 'Foundational', 'Using the same secret key to lock and unlock messages fast.'],
      ['The Key-Sharing Puzzle Over Public Wires', 'Intermediate', 'How two strangers agree on a secret without spies hearing the key!'],
      ['Digital Certificates: Website ID Cards', 'Intermediate', 'Checking who verified a website’s identity before trusting it.'],
      ['Mixed Content & Padlock Warnings', 'Honors', 'Why expired or missing certificates trigger bright browser alerts.'],
    ]],
    ['Privacy, Tracking & App Permissions', 'cyber-firewall', [
      ['Cookies & Cross-Site Ad Trackers', 'Foundational', 'Distinguishing helpful login cookies from tracking cookies.'],
      ['Location Metadata (EXIF) in Photos', 'Intermediate', 'Understanding GPS coordinates saved invisibly inside camera files.'],
      ['Principle of Least Privilege for Apps', 'Intermediate', 'Granting camera/mic access "Only While Using App" cleanly.'],
      ['Incognito Mode Myths vs. Reality', 'Honors', 'What private tabs hide locally vs. what networks still see.'],
    ]],
    ['Ethical Hacking & Cyber Hygiene', 'cyber-firewall', [
      ['White-Hat vs. Black-Hat Ethics', 'Foundational', 'Using security skills strictly with permission to protect and repair.'],
      ['Bug Bounties & Responsible Disclosure', 'Intermediate', 'Helping companies fix flaws safely instead of exploiting them.'],
      ['Locking Down a Kid Tablet Step by Step', 'Intermediate', 'Auto-updates, strong PIN, 2FA, private DNS, and clean backups.'],
      ['Defender Decision Simulation', 'Olympiad', 'Handling 6 realistic security alerts calmly and accurately.'],
    ]],
  ],
  3: [
    ['Cryptographic Hash Fingerprints', 'cyber-crypto', [
      ['One-Way Blender Math (Hashing vs. Encrypting)', 'Foundational', 'Why you can verify a smoothie’s recipe yet cannot un-blend it!'],
      ['The Avalanche Effect in SHA-256', 'Intermediate', 'Changing one tiny comma transforms ~50% of output hex bits.'],
      ['Verifying Downloads With Checksums', 'Intermediate', 'Checking file hashes to prove a download was never tampered with.'],
      ['Collision Resistance Intuition', 'Honors', 'Why two different files practically never share the same 256-bit hash.'],
    ]],
    ['Symmetric & Stream Ciphers', 'cyber-crypto', [
      ['XOR (Exclusive OR) Magic Encryption', 'Foundational', 'Why (Message XOR Key) XOR Key returns the exact original message!'],
      ['One-Time Pad: Unbreakable When Used Right', 'Intermediate', 'Truly random single-use keys leave zero statistical clues.'],
      ['Why Reusing a Stream Key Breaks Everything', 'Intermediate', 'XORing two ciphertexts cancels the key and leaks both texts!'],
      ['Vigenère Polyalphabetic Cipher Defense', 'Honors', 'Using repeating keyword shifts—and how Kasiski finds key length.'],
    ]],
    ['Authentication & Access Control', 'cyber-crypto', [
      ['Three Factors: Know, Have, Are', 'Foundational', 'Passwords, hardware security keys, and fingerprint/face biometrics.'],
      ['Why SMS Codes Are Weaker Than Auth Apps', 'Intermediate', 'Comparing SIM-swap risks against time-based TOTP & passkeys.'],
      ['Passwordless Passkeys (Public Key Sign-In)', 'Intermediate', 'Signing logins locally on your device without sending secrets!'],
      ['Role-Based Access Control (RBAC)', 'Honors', 'Separating student, teacher, and administrator permissions cleanly.'],
    ]],
    ['Web Safety & Input Validation', 'cyber-firewall', [
      ['Never Trust User Input Blindly', 'Foundational', 'Checking that age inputs are numbers and names stay plain text.'],
      ['SQL Injection Explained With Mad Libs', 'Intermediate', 'How sneaky quotes turn search boxes into unauthorized database commands.'],
      ['Defending With Parameterized Queries', 'Intermediate', 'Keeping data strictly separate from executable SQL instructions.'],
      ['Cross-Site Scripting (XSS) & Escaping HTML', 'Honors', 'Stopping sneaky `<script>` tags from running inside comment boxes.'],
    ]],
    ['Network Defense & Firewalls', 'cyber-firewall', [
      ['Packet Filtering by IP, Protocol & Port', 'Foundational', 'Writing clean allow/deny rule tables in order of priority.'],
      ['Default-Deny vs. Default-Allow Policies', 'Intermediate', 'Why closing everything except needed services is vastly safer.'],
      ['Detecting Port Scanning Reconnaissance', 'Intermediate', 'Spotting automated probes knocking rapidly on doors 1–1024.'],
      ['Honeypots & Decoy Services', 'Honors', 'Catching intruders early when they touch fake tempting folders.'],
    ]],
    ['Social Engineering & Verification', 'cyber-firewall', [
      ['Six Psychological Triggers Scammers Use', 'Foundational', 'Urgency, authority, fear, greed, curiosity, and fake helpfulness.'],
      ['Spear Phishing vs. Mass Spam', 'Intermediate', 'Targeted scams personalized from public social media profiles.'],
      ['Verifying Out-of-Band Before Acting', 'Intermediate', 'Calling a known real number instead of replying to urgent texts.'],
      ['AI-Generated Phishing & Voice Scams', 'Honors', 'Using family code-words and multi-channel verification safely.'],
    ]],
    ['Endpoint & Device Security', 'cyber-firewall', [
      ['Full-Disk Encryption (BitLocker / FileVault)', 'Foundational', 'Protecting data if a laptop is ever lost or left on a bus.'],
      ['Application Sandboxing on Phones & Browsers', 'Intermediate', 'Confining each tab and app inside strict OS walls.'],
      ['USB Drop Risks & Physical Port Hygiene', 'Intermediate', 'Why unknown found flash drives must never be plugged in.'],
      ['3-2-1 Backup Rule Against Data Loss', 'Honors', '3 copies, 2 different media types, 1 offsite immutable copy.'],
    ]],
    ['Incident Response for Young Defenders', 'cyber-firewall', [
      ['Spot, Contain, Eradicate, Recover', 'Foundational', 'Calm 4-step playbook if an account password leaks.'],
      ['Revoking Sessions & Rotating Passwords', 'Intermediate', 'Using "Sign out of all devices" and changing compromised logins first.'],
      ['Reading Login Activity History Logs', 'Intermediate', 'Checking suspicious unknown cities or midnight sign-in alerts.'],
      ['Lessons Learned & Post-Incident Hardening', 'Olympiad', 'Turning every close call into a stronger permanent defense.'],
    ]],
  ],
  4: [
    ['Asymmetric Public-Key Cryptography', 'cyber-crypto', [
      ['Padlock You Give Away, Key Only You Keep', 'Foundational', 'Why asymmetric keys solve the secret key-sharing problem!'],
      ['Diffie-Hellman Paint Mixing Analogy', 'Intermediate', 'Mixing public and private secrets to reach an identical shared color.'],
      ['Digital Signatures: Proving Authorship', 'Intermediate', 'Signing a hash with a private key so anyone verifies with public key.'],
      ['Why Hybrid Crypto Pairs RSA/ECC With AES', 'Honors', 'Using asymmetric math for keys and symmetric AES for fast bulk data.'],
    ]],
    ['Entropy, Password Cracking & Hashing', 'cyber-crypto', [
      ['Bit Entropy Formula: log₂(N^L)', 'Foundational', 'Measuring true unpredictability in bits across character sets.'],
      ['Offline Hash Cracking vs. Online Throttling', 'Intermediate', 'Why leaked hash databases get tested billions of times per second.'],
      ['Salting Every Password Before Hashing', 'Intermediate', 'Adding unique random salts to defeat precomputed rainbow tables.'],
      ['Slow Memory-Hard Hashing (Argon2 Intuition)', 'Honors', 'Designing hashes intentionally expensive for cracking GPUs.'],
    ]],
    ['Certificates, PKI & Trust Chains', 'cyber-crypto', [
      ['Certificate Authorities (CAs) & Root Stores', 'Foundational', 'How browsers know which digital ID cards to trust out of the box.'],
      ['Intermediate Chains & Expiration Dates', 'Intermediate', 'Verifying cryptographic signatures from leaf cert up to root CA.'],
      ['Man-in-the-Middle (MITM) Defense', 'Intermediate', 'How PKI catches attackers pretending to be your bank or school.'],
      ['DNS CAA & Certificate Revocation', 'Honors', 'Restricting who may issue certs and checking compromised revocations.'],
    ]],
    ['Defensive Web Engineering', 'cyber-firewall', [
      ['Content Security Policy (CSP) Headers', 'Foundational', 'Telling browsers only to run scripts from trusted origins.'],
      ['HttpOnly & SameSite Cookie Flags', 'Intermediate', 'Blocking JavaScript theft and cross-site request forgery (CSRF).'],
      ['CORS Same-Origin Rules Explained', 'Intermediate', 'Controlling which external websites may read API responses.'],
      ['Path Traversal (../../etc/passwd) Defense', 'Honors', 'Canonicalizing file paths and confining uploads outside web roots.'],
    ]],
    ['Malware Analysis & OS Internals', 'cyber-firewall', [
      ['Processes, Threads & Elevated Privileges', 'Foundational', 'Why standard user accounts beat running daily as Administrator.'],
      ['Persistence Mechanisms (Startup & Tasks)', 'Intermediate', 'How defenders check startup folders for unauthorized autoruns.'],
      ['Static Signatures vs. Behavioral Heuristics', 'Intermediate', 'Catching brand-new malware by suspicious actions, not old hashes.'],
      ['Detonating Unknown Files in Virtual Sandboxes', 'Honors', 'Inspecting behavior inside disposable virtual machines safely.'],
    ]],
    ['Defensive Network Monitoring', 'cyber-firewall', [
      ['Reading Firewall Allow/Drop Logs', 'Foundational', 'Correlating timestamps, source IPs, destination ports, and actions.'],
      ['Spotting Brute-Force Login Spikes', 'Intermediate', 'Catching 500 failed SSH/web logins in 60 seconds and rate-limiting.'],
      ['DNS Exfiltration & DGA Domain Clues', 'Intermediate', 'Recognizing algorithmically generated random malware domains.'],
      ['Building Alert Rules Without Alert Fatigue', 'Honors', 'Tuning high-signal detections so defenders do not miss real threats.'],
    ]],
    ['Open-Source Intelligence (OSINT) & Privacy', 'cyber-firewall', [
      ['What Public Records Reveal About Orgs', 'Foundational', 'Auditing exposed subdomains, job posts, and metadata defensively.'],
      ['Stripping EXIF Metadata From Uploads', 'Intermediate', 'Protecting privacy by removing camera model and GPS tags automatically.'],
      ['Data Breach Checks & Credential Stuffing', 'Intermediate', 'Why reusing one forum password compromises unrelated accounts.'],
      ['Minimizing Your Digital Attack Surface', 'Honors', 'Closing unused accounts, old apps, and unneeded public profiles.'],
    ]],
    ['Threat Modeling for Kids Apps', 'cyber-firewall', [
      ['Drawing Data Flow Diagrams (DFD)', 'Foundational', 'Mapping users, browsers, APIs, databases, and trust boundaries.'],
      ['STRIDE Categories Simplified', 'Intermediate', 'Spoofing, Tampering, Repudiation, Info Leak, DoS, Privilege Escalation.'],
      ['Defense-in-Depth Layered Shields', 'Intermediate', 'Combining input validation, auth, encryption, and logging together.'],
      ['Securing a Class Quiz Web App', 'Olympiad', 'Auditing a complete student project from login to database storage.'],
    ]],
  ],
  5: [
    ['Number Theory for Cryptography', 'cyber-crypto', [
      ['Modular Arithmetic & Clock Remainders', 'Foundational', 'Computing (a + b) mod n and fast modular exponentiation cleanly.'],
      ['Primes, GCD & Euclidean Algorithm', 'Intermediate', 'Finding greatest common divisors and modular inverses rapidly.'],
      ['RSA Key Generation Step-by-Step With Small Primes', 'Intermediate', 'Picking p, q, computing n, φ(n), e, and private exponent d!'],
      ['Why Factoring Huge 2048-Bit Primes Is Hard', 'Honors', 'Easy forward multiplication vs. exponential classical factoring.'],
    ]],
    ['Block Ciphers, Modes & Integrity', 'cyber-crypto', [
      ['Why ECB Mode Leaks Penguin Silhouettes', 'Foundational', 'Seeing why identical plaintext blocks produce identical ECB blocks!'],
      ['CBC Chaining & CTR Counter Stream Mode', 'Intermediate', 'Using unique Initialization Vectors (IVs / Nonces) every time.'],
      ['Authenticated Encryption (GCM / Poly1305)', 'Intermediate', 'Detecting even a 1-bit ciphertext tamper before decrypting.'],
      ['HMAC Message Authentication Codes', 'Honors', 'Combining secret keys with SHA-256 to prevent length-extension flaws.'],
    ]],
    ['Identity, OAuth2 & Zero Trust', 'cyber-crypto', [
      ['Authentication (AuthN) vs. Authorization (AuthZ)', 'Foundational', 'Proving who you are vs. verifying what resources you may touch.'],
      ['OAuth 2.0 Tokens & Scopes Intuition', 'Intermediate', 'Letting an app read calendar titles without handing over your password.'],
      ['JWT Signed Tokens & Signature Verification', 'Intermediate', 'Header.Payload.Signature structure and avoiding alg=none traps!'],
      ['WebAuthn / FIDO2 Phishing-Resistant Keys', 'Honors', 'Binding cryptographic signatures directly to exact browser origins.'],
    ]],
    ['Secure Software & Memory Safety', 'cyber-firewall', [
      ['How Stack Frames Store Local Variables', 'Foundational', 'Visualizing function arguments, buffers, and return addresses in RAM.'],
      ['Buffer Overflow Intuition & Bounds Checks', 'Intermediate', 'Writing past fixed arrays—and how bounds checking stops it.'],
      ['Integer Overflows & Logic Bugs', 'Intermediate', 'When 255 + 1 wraps back to 0 in unsigned 8-bit arithmetic!'],
      ['Memory-Safe Languages & Fuzz Testing', 'Honors', 'Eliminating whole classes of memory corruption automatically.'],
    ]],
    ['Web Application Security (OWASP Top 10)', 'cyber-firewall', [
      ['Broken Access Control & IDOR Bugs', 'Foundational', 'Why changing `?id=102` to `?id=103` must check server ownership!'],
      ['Injection Flaws (SQLi, Command Injection)', 'Intermediate', 'Using parameterized APIs and avoiding shell string concatenation.'],
      ['Server-Side Request Forgery (SSRF)', 'Intermediate', 'Blocking user-supplied URLs from probing internal metadata IPs.'],
      ['Security Headers & Rate-Limiting Middleware', 'Honors', 'HSTS, CSP, X-Content-Type-Options, and login lockouts.'],
    ]],
    ['SOC Operations & Log Forensics', 'cyber-firewall', [
      ['Centralized SIEM Log Correlation', 'Foundational', 'Joining firewall, DNS, auth, and endpoint events on one timeline.'],
      ['Indicators of Compromise (IoCs) vs. TTPs', 'Intermediate', 'Why behavior patterns outlast easily changed attacker IPs and hashes.'],
      ['Investigating a Simulated Phishing Alert', 'Intermediate', 'Tracing email -> click -> process spawn -> suspicious outbound DNS.'],
      ['Writing Sigma-Style Detection Logic', 'Honors', 'Encoding repeatable defensive queries cleanly.'],
    ]],
    ['Cloud & Container Security', 'cyber-firewall', [
      ['Shared Responsibility Model in Cloud', 'Foundational', 'Provider secures hardware; builders secure configs, IAM, and data.'],
      ['Least-Privilege IAM Policies & Secrets Vaults', 'Intermediate', 'Banning hardcoded API keys in code repos forever!'],
      ['Container Isolation: Namespaces & Cgroups', 'Intermediate', 'Running non-root read-only containers safely.'],
      ['Dependency & Supply-Chain Auditing (SBOM)', 'Honors', 'Scanning open-source packages for tampered versions before deploy.'],
    ]],
    ['Capture-The-Flag (CTF) Ethical Practice', 'cyber-crypto', [
      ['How Legal CTF Competitions Train Defenders', 'Foundational', 'Practicing cryptography, forensics, and reverse engineering ethically.'],
      ['File Magic Bytes & Steganography Inspection', 'Intermediate', 'Spotting hidden appended files inside PNG or ZIP headers.'],
      ['Structured Note-Taking & Reproducible Reports', 'Intermediate', 'Documenting exact root cause, impact, and verified fix steps.'],
      ['Defensive Blue-Team Hardening Challenge', 'Olympiad', 'Patching 5 intentionally misconfigured mock settings cleanly.'],
    ]],
  ],
  6: [
    ['Elliptic Curve Cryptography Intuition', 'cyber-crypto', [
      ['Elliptic Curve Point Addition Geometry', 'Foundational', 'Line-and-reflection group laws over finite prime fields.'],
      ['ECDLP Discrete Log Trapdoor', 'Intermediate', 'Adding a point k times fast vs. recovering k from the result.'],
      ['Why 256-Bit ECC Matches 3072-Bit RSA', 'Intermediate', 'Smaller faster keys ideal for mobile phones and IoT chips.'],
      ['Nonce Reuse Catastrophe in ECDSA', 'Honors', 'Why signing two messages with the same random k leaks the private key!'],
    ]],
    ['Zero-Knowledge Proofs & Privacy Tech', 'cyber-crypto', [
      ['Proving Age Without Showing Birthdate', 'Foundational', 'Interactive cave and color-blindness analogies for Zero-Knowledge.'],
      ['Completeness, Soundness & Zero-Knowledge', 'Intermediate', 'The three formal guarantees every ZKP protocol must satisfy.'],
      ['Cryptographic Commitments (Hide & Bind)', 'Intermediate', 'Locking a prediction inside a salted hash before reveal day.'],
      ['Private Set Intersection & Anonymous Credentials', 'Honors', 'Checking breached passwords cleanly using k-anonymity prefixes!'],
    ]],
    ['Binary Reverse Engineering Concepts', 'net-binary', [
      ['From High-Level Code to Assembly Instructions', 'Foundational', 'Seeing how compilers translate loops and `if` checks into opcodes.'],
      ['ELF / PE Headers & Imported Libraries', 'Intermediate', 'Inspecting strings and API imports statically without running binaries.'],
      ['Control-Flow Graphs & Decompilation', 'Intermediate', 'Reconstructing program logic from basic blocks and branches.'],
      ['Detecting Obfuscation & Packed Payloads', 'Honors', 'Using Shannon byte entropy to flag compressed/encrypted sections.'],
    ]],
    ['Exploit Mitigations & OS Defenses', 'cyber-firewall', [
      ['DEP / NX: Non-Executable Data Pages', 'Foundational', 'Hardware page flags preventing data buffers from executing as code.'],
      ['ASLR Address Space Layout Randomization', 'Intermediate', 'Shuffling stack, heap, and library addresses on every launch.'],
      ['Stack Canaries Detecting Buffer Overwrites', 'Intermediate', 'Checking a secret guard word before any function returns.'],
      ['Control-Flow Integrity (CFI) & Sandboxes', 'Honors', 'Restricting indirect jumps strictly to valid compile-time targets.'],
    ]],
    ['Enterprise Identity & Federation', 'cyber-crypto', [
      ['Single Sign-On: SAML vs. OIDC', 'Foundational', 'Centralizing identity cleanly without duplicating password databases.'],
      ['PKCE Proof Key for Code Exchange', 'Intermediate', 'Protecting public mobile/SPA OAuth flows against code interception.'],
      ['Short-Lived Credentials & STS Token Exchange', 'Intermediate', 'Replacing permanent static secrets with hourly auto-rotated tokens.'],
      ['Kerberos Tickets & Replay Guards', 'Honors', 'Understanding symmetric ticket-granting architectures in enterprise.'],
    ]],
    ['Threat Intelligence & ATT&CK Mapping', 'cyber-firewall', [
      ['Cyber Kill Chain & Diamond Model', 'Foundational', 'Breaking intrusions into Recon, Delivery, Execution, C2, Impact.'],
      ['MITRE ATT&CK Tactics & Techniques', 'Intermediate', 'Standard vocabulary mapping attacker behaviors to telemetry controls.'],
      ['Pyramid of Pain for Defenders', 'Intermediate', 'Why disrupting TTPs hurts adversaries far more than blocking one IP.'],
      ['Purple-Team Hypothesis Testing', 'Honors', 'Validating detections by running controlled benign simulations.'],
    ]],
    ['Secure SDLC & DevSecOps', 'cyber-firewall', [
      ['Shift-Left Static Analysis (SAST) & Linters', 'Foundational', 'Catching injection and hardcoded secret patterns at commit time.'],
      ['Dynamic Testing (DAST) & Fuzzing', 'Intermediate', 'Probing running staging APIs with boundary and malformed payloads.'],
      ['Signed Commits & Reproducible Builds', 'Intermediate', 'Verifying source-to-binary integrity across CI/CD pipelines.'],
      ['Secret Scanning & Automated Key Rotation', 'Honors', 'Responding within seconds if a developer accidentally pushes a key.'],
    ]],
    ['Digital Forensics & Triage', 'cyber-firewall', [
      ['Order of Volatility (RAM -> Disk -> Logs)', 'Foundational', 'Capturing transient memory state before powering down systems.'],
      ['Filesystem Timelines & MACB Timestamps', 'Intermediate', 'Reconstructing file creation and execution chronology accurately.'],
      ['Browser Artifact & Persistence Triage', 'Intermediate', 'Tracing download history, extensions, and scheduled tasks.'],
      ['Defensive Tabletop Crisis Simulation', 'Olympiad', 'Leading communications, containment, and recovery under time pressure.'],
    ]],
  ],
  7: [
    ['Cryptographic Protocol Engineering', 'cyber-crypto', [
      ['Key Derivation Functions (HKDF Extract & Expand)', 'Foundational', 'Turning shared secrets into independent encryption & MAC subkeys.'],
      ['Signal Protocol Double Ratchet Intuition', 'Intermediate', 'Achieving both Forward Secrecy and Post-Compromise Healing.'],
      ['Constant-Time Comparisons & Timing Leaks', 'Intermediate', 'Why early-exit string loops leak secret HMAC bytes nanosecond-by-nanosecond.'],
      ['Formal Protocol Verification (ProVerif Intuition)', 'Honors', 'Proving authentication properties across symbolic attacker models.'],
    ]],
    ['Web Security Deep Dive', 'cyber-firewall', [
      ['Prototype Pollution & Deserialization Hazards', 'Foundational', 'Why untrusted object merges and pickle/YAML loads execute code.'],
      ['OAuth Redirect URI & State Misconfigurations', 'Intermediate', 'Preventing open-redirect token theft and login CSRF.'],
      ['Race Conditions (TOCTOU) in Transactions', 'Intermediate', 'Using atomic database locks so double-clicks cannot double-spend.'],
      ['Subresource Integrity (SRI) & Trusted Types', 'Honors', 'Hardening frontend DOM sinks and third-party CDN scripts.'],
    ]],
    ['Cloud-Native & Kubernetes Security', 'cyber-firewall', [
      ['RBAC, ServiceAccounts & Metadata IMDSv2', 'Foundational', 'Blocking SSRF access to cloud instance credential endpoints.'],
      ['Pod Security Standards & Seccomp Profiles', 'Intermediate', 'Restricting Linux syscalls per container strictly to what is needed.'],
      ['NetworkPolicies & East-West Pod Isolation', 'Intermediate', 'Denying lateral pod-to-pod access across namespaces by default.'],
      ['Supply Chain Attestations (SLSA Framework)', 'Honors', 'Verifying signed provenance from build runner to production cluster.'],
    ]],
    ['Hardware & Embedded Security', 'net-binary', [
      ['Secure Boot Chains & Root of Trust (TPM)', 'Foundational', 'Measuring bootloader and kernel hashes in hardware registers before boot.'],
      ['JTAG, UART & Physical Debug Port Locks', 'Intermediate', 'Disabling factory serial consoles before shipping consumer devices.'],
      ['Power & Electromagnetic Side Channels', 'Intermediate', 'Constant-time masking against differential power analysis.'],
      ['Rowhammer & Speculative Cache Side Channels', 'Honors', 'How DRAM disturbance and branch speculation cross isolation boundaries.'],
    ]],
    ['Threat Hunting & Endpoint Telemetry', 'cyber-firewall', [
      ['Process Tree Parent-Child Anomalies', 'Foundational', 'Flagging when a PDF viewer or web server spawns an interactive shell.'],
      ['Living-off-the-Land Binary (LOLBin) Detection', 'Intermediate', 'Spotting built-in admin tools misused for stealthy downloads.'],
      ['Memory-Only Injection & Unbacked Pages', 'Intermediate', 'Detecting executable anonymous memory without backed disk DLLs.'],
      ['Building Behavioral Anomaly Baselines', 'Honors', 'Distinguishing rare admin maintenance from genuine lateral movement.'],
    ]],
    ['Vulnerability Research & Responsible Remediation', 'cyber-firewall', [
      ['CVSS Scoring vs. Real Exploitability (EPSS)', 'Foundational', 'Prioritizing actively exploited internet-facing flaws first.'],
      ['Writing Minimal Proof-of-Concept Reproductions', 'Intermediate', 'Demonstrating impact safely without disrupting production systems.'],
      ['Root-Cause Patching vs. Band-Aid Regex', 'Intermediate', 'Fixing architectural parsers instead of brittle blocklists.'],
      ['Coordinated Vulnerability Disclosure (CVD)', 'Honors', 'Working ethically with CERTs and vendors on 90-day patch timelines.'],
    ]],
    ['Privacy Engineering & Anonymity', 'cyber-crypto', [
      ['K-Anonymity, L-Diversity & Re-Identification', 'Foundational', 'Why zip code + birthdate + gender uniquely identifies 87% of people!'],
      ['Differential Privacy Laplace Noise Budgets', 'Intermediate', 'Bounding individual privacy loss mathematically across queries.'],
      ['End-to-End Encrypted Backup Vaults', 'Intermediate', 'Designing zero-knowledge cloud sync recoverable only by user keys.'],
      ['Federated Analytics & Secure Aggregation', 'Honors', 'Computing global averages without revealing any single device input.'],
    ]],
    ['Cyber Defense Architecture Capstone', 'cyber-firewall', [
      ['Zero-Trust Reference Blueprint', 'Foundational', 'Unifying device posture, identity, microsegmentation, and encryption.'],
      ['Chaos & Breach-Simulation Exercises', 'Intermediate', 'Measuring Mean Time to Detect (MTTD) and Contain (MTTC).'],
      ['Designing Ransomware-Proof Recovery Paths', 'Intermediate', 'Immutable air-gapped backups and clean bare-metal rebuilds.'],
      ['Comprehensive Security Audit Defense', 'Olympiad', 'Evaluating an entire school district platform end-to-end.'],
    ]],
  ],
  8: [
    ['Applied Cryptanalysis & Implementation Flaws', 'cyber-crypto', [
      ['Padding Oracle Attacks on Unauthenticated CBC', 'Foundational', 'Why error-message leaks let attackers decrypt byte by byte.'],
      ['Length Extension Attacks on Merkle-Damgård', 'Intermediate', 'Why SHA-256(secret || msg) is broken while HMAC-SHA256 is secure.'],
      ['Small-Exponent & Common-Modulus RSA Traps', 'Intermediate', 'Why proper OAEP padding and independent primes are mandatory.'],
      ['Auditing Real Cryptographic APIs', 'Honors', 'Choosing libsodium/WebCrypto misuse-resistant primitives properly.'],
    ]],
    ['Post-Quantum Cryptography (PQC)', 'cyber-crypto', [
      ['Shor Algorithm Threat to RSA & ECC', 'Foundational', 'Why quantum period-finding breaks integer factoring and discrete logs.'],
      ['Grover Search & Symmetric Key Doubling', 'Intermediate', 'Why AES-256 and SHA-256 stay strong against quantum speedup.'],
      ['Lattice Problems (Learning With Errors - LWE)', 'Intermediate', 'Hiding secret vectors inside noisy high-dimensional grids.'],
      ['NIST Standards: ML-KEM & ML-DSA Migration', 'Honors', 'Planning hybrid classical + post-quantum rollout cleanly.'],
    ]],
    ['Automated Security Testing & Fuzzing', 'cyber-firewall', [
      ['Coverage-Guided Fuzzing (LibFuzzer / AFL++)', 'Foundational', 'Mutating inputs dynamically to explore unseen code branches.'],
      ['Sanitizers: ASan, UBSan & MSan', 'Intermediate', 'Turning silent memory bugs into instant diagnostic stack traces.'],
      ['Symbolic Execution & SAT/SMT Solvers', 'Intermediate', 'Solving path constraints mathematically to reach deep bug states.'],
      ['Writing Fuzz Harnesses for Network Parsers', 'Honors', 'Testing real binary codecs continuously in CI pipelines.'],
    ]],
    ['Browser & Frontend Security Internals', 'cyber-firewall', [
      ['Site Isolation & Spectre Mitigations', 'Foundational', 'Separating cross-origin sites into distinct OS renderer processes.'],
      ['DOM Clobbering, XS-Leaks & Timing Oracles', 'Intermediate', 'Preventing subtle cross-origin state inference across tabs.'],
      ['Extension Permissions & Supply Chain Safety', 'Intermediate', 'Auditing browser add-on capabilities cleanly.'],
      ['Strict CSP With Nonces & Trusted Types', 'Honors', 'Eliminating DOM XSS structurally across large React codebases.'],
    ]],
    ['Advanced Cloud IAM & Workload Identity', 'cyber-firewall', [
      ['IAM Policy Graph Reachability Analysis', 'Foundational', 'Finding unintended indirect privilege escalation paths across roles.'],
      ['Workload Identity Federation (OIDC -> Cloud)', 'Intermediate', 'Eliminating long-lived CI/CD deploy secrets completely.'],
      ['Envelope Encryption & KMS Key Policies', 'Intermediate', 'Separating data-encryption keys from hardware-backed root keys.'],
      ['Immutable Infrastructure & Drift Detection', 'Honors', 'Replacing patched pets with freshly attested cattle builds.'],
    ]],
    ['Detection Engineering & SIEM Pipelines', 'cyber-firewall', [
      ['Normalizing Telemetry (OCSF / ECS Schemas)', 'Foundational', 'Unifying Windows, Linux, cloud, and firewall logs cleanly.'],
      ['Detection-as-Code Testing & CI Validation', 'Intermediate', 'Unit-testing alert rules against replay telemetry datasets.'],
      ['Graph-Based Lateral Movement Detection', 'Intermediate', 'Identifying anomalous shortest paths toward high-value assets.'],
      ['Automated SOAR Containment Guardrails', 'Honors', 'Isolating endpoints safely while avoiding self-inflicted outages.'],
    ]],
    ['AI-Era Cybersecurity', 'ai-vision', [
      ['Securing AI Agents With Capability Firewalls', 'Foundational', 'Enforcing deterministic policy checks outside the LLM loop.'],
      ['Detecting Automated Spear-Phishing Campaigns', 'Intermediate', 'Combining email auth (SPF/DKIM/DMARC) with behavioral scoring.'],
      ['Machine-Speed Triage & SOC Co-Pilots', 'Intermediate', 'Using AI safely for log summarization while verifying ground truth.'],
      ['Protecting Model Weights & Training Pipelines', 'Honors', 'Securing datasets, checkpoints, and inference endpoints.'],
    ]],
    ['Governance, Risk, Compliance & Law', 'cyber-firewall', [
      ['COPPA, GDPR-K & Protecting Children Data', 'Foundational', 'Strict legal and ethical duties for youth platforms and edtech.'],
      ['Quantifying Cyber Risk (FAIR Model Intuition)', 'Intermediate', 'Estimating loss frequency and magnitude instead of vague red/yellow/green.'],
      ['NIST Cybersecurity Framework 2.0', 'Intermediate', 'Govern, Identify, Protect, Detect, Respond, Recover lifecycles.'],
      ['Red vs. Blue Architecture Review Capstone', 'Olympiad', 'Defending security design choices before an engineering panel.'],
    ]],
  ],
  9: [
    ['Formal Cryptography & Security Proofs', 'cyber-crypto', [
      ['IND-CPA & IND-CCA2 Security Games', 'Foundational', 'Formalizing attacker advantage bounds against encryption schemes.'],
      ['Random Oracle Model vs. Standard Model', 'Intermediate', 'Understanding assumptions underlying practical hash proofs.'],
      ['Threshold Signatures & MPC Wallets', 'Honors', 'Signing without ever assembling a full private key in one machine!'],
      ['zk-SNARK Arithmetic Circuits Intuition', 'Olympiad', 'Turning general computation into verifiable polynomial constraints.'],
    ]],
    ['Systems & Hypervisor Isolation', 'cyber-firewall', [
      ['Hardware Virtualization Rings & EPT Isolation', 'Foundational', 'How hypervisors enforce guest OS memory boundaries cleanly.'],
      ['MicroVMs (Firecracker) for Untrusted Code', 'Intermediate', 'Booting isolated minimal sandboxes in <125 ms for cloud runners.'],
      ['Confidential Computing & Attested Enclaves', 'Honors', 'Verifying encrypted VM memory state remotely via hardware quotes.'],
      ['Capability-Based Microkernels (seL4 Intuition)', 'Olympiad', 'Formally verified OS kernels with mathematically proven isolation.'],
    ]],
    ['Software Supply Chain Security', 'cyber-firewall', [
      ['Typosquatting, Dependency Confusion & Maintainer Hijacks', 'Foundational', 'Hardening package managers, lockfiles, and private registries.'],
      ['Sigstore Keyless Signing & Transparency Logs', 'Intermediate', 'Binding artifact signatures cleanly to OIDC build identities.'],
      ['SLSA Level 3 Hermetic Build Pipelines', 'Honors', 'Preventing build-step tampering via isolated ephemeral builders.'],
      ['Detecting Backdoors in Open-Source Builds', 'Olympiad', 'Independent rebuild verification and anomalous diff auditing.'],
    ]],
    ['Memory Corruption & Type-Safe Systems', 'net-binary', [
      ['Use-After-Free & Heap Allocator Metadata', 'Foundational', 'Understanding temporal memory bugs inside modern allocators.'],
      ['Rust Ownership & Borrow Checker Guarantees', 'Intermediate', 'Enforcing alias-XOR-mutability statically at compile time.'],
      ['Hardware Memory Tagging (ARM MTE / CHERI)', 'Honors', 'Catching out-of-bounds pointer dereferences directly in silicon.'],
      ['Formal Static Verification & Fuzzing Integration', 'Olympiad', 'Combining compile-time proofs with continuous runtime fuzzers.'],
    ]],
    ['Post-Quantum Systems Migration', 'cyber-crypto', [
      ['Lattice Cryptography: Ring-LWE & Module-LWE', 'Foundational', 'Structured polynomial rings enabling compact fast post-quantum math.'],
      ['Migrating Root CAs, Firmware & VPNs', 'Intermediate', 'Sequencing crypto inventory discovery and dual-algorithm testing.'],
      ['Side-Channel Hardening in Lattice Implementations', 'Honors', 'Securing rejection sampling and NTT transforms against leaks.'],
      ['Designing Crypto-Agile Enterprise Standards', 'Olympiad', 'Architecting decades-long resilience without breaking compatibility.'],
    ]],
    ['Adversarial Threat Hunting & Forensics', 'cyber-firewall', [
      ['Live Volatile Memory Forensics', 'Foundational', 'Extracting active sockets, kernel modules, and injected threads from RAM.'],
      ['Detecting Kerberoasting & Identity Pivots', 'Intermediate', 'Catching anomalous service ticket spikes and privilege escalation.'],
      ['Cross-Cloud Telemetry & Anomaly Graphs', 'Honors', 'Linking identity, API audit logs, network flows, and container events.'],
      ['Leading Full-Scale Ransomware Recovery', 'Olympiad', 'Forensic root-cause verification before reconnecting clean enclaves.'],
    ]],
    ['Safety-Critical & Cyber-Physical Security', 'net-packets', [
      ['CAN Bus & Automotive Network Isolation', 'Foundational', 'Separating infotainment Wi-Fi from braking and steering controllers.'],
      ['ICS / SCADA Purdue Model Segmentation', 'Intermediate', 'Protecting power grids and water plants with unidirectional gateways.'],
      ['Medical Device & Robotics Safety Bounds', 'Honors', 'Fail-safe watchdogs ensuring cyber faults never cause physical harm.'],
      ['Satellite & Aviation Telemetry Integrity', 'Olympiad', 'Cryptographic authentication of safety-critical control links.'],
    ]],
    ['Senior Cybersecurity Architect Capstone', 'cyber-firewall', [
      ['Holistic Threat Model & Trust Architecture', 'Foundational', 'Synthesizing crypto, OS isolation, network segmentation, and IAM.'],
      ['Quantifying Residual Risk & Control Coverage', 'Intermediate', 'Mapping defenses rigorously against real-world adversary TTPs.'],
      ['Privacy-By-Design for Next-Gen Youth Tech', 'Honors', 'Building safe, verifiable, zero-telemetry-abuse systems for kids.'],
      ['Final Capstone Defense: Secure Tech Platform', 'Olympiad', 'Complete architecture blueprint from silicon root of trust to cloud edge.'],
    ]],
  ],
};

function buildDisciplineModules(
  subjectId: string,
  subjectName: string,
  map: GradeCurriculumMap
): CurriculumModule[] {
  const modules: CurriculumModule[] = [];
  for (let grade = 1; grade <= 9; grade++) {
    const units = map[grade] || [];
    units.forEach(([unitTitle, simType, modSpecs], uIdx) => {
      const unitNumber = uIdx + 1;
      modSpecs.forEach(([title, difficulty, summary], mIdx) => {
        const moduleNumber = mIdx + 1;
        const estimatedMinutes =
          difficulty === 'Foundational' ? 20 : difficulty === 'Intermediate' ? 30 : difficulty === 'Honors' ? 40 : 50;
        modules.push({
          id: `${subjectId}-g${grade}-u${unitNumber}-m${moduleNumber}`,
          grade,
          subjectId,
          subjectName,
          unitNumber,
          unitTitle,
          moduleNumber,
          title,
          difficulty,
          estimatedMinutes,
          simType,
          summary,
          keywords: [
            subjectName.toLowerCase(),
            `class ${grade}`,
            `grade ${grade}`,
            unitTitle.toLowerCase(),
            title.toLowerCase(),
            difficulty.toLowerCase(),
          ],
        });
      });
    });
  }
  return modules;
}

export const ALL_MODULES: CurriculumModule[] = [
  ...buildDisciplineModules('ai', 'Artificial Intelligence', AI_CURRICULUM),
  ...buildDisciplineModules('networking', 'Computer Networking', NETWORKING_CURRICULUM),
  ...buildDisciplineModules('cybersecurity', 'Cybersecurity & Defense', CYBERSECURITY_CURRICULUM),
];

export function getModulesForGradeSubject(grade: number, subjectName: string): CurriculumModule[] {
  return ALL_MODULES.filter((m) => m.grade === grade && m.subjectName === subjectName);
}

export function getUnitsForGradeSubject(grade: number, subjectName: string): CurriculumUnit[] {
  const mods = getModulesForGradeSubject(grade, subjectName);
  const byUnit = new Map<number, CurriculumUnit>();
  for (const m of mods) {
    let unit = byUnit.get(m.unitNumber);
    if (!unit) {
      unit = { unitNumber: m.unitNumber, title: m.unitTitle, modules: [] };
      byUnit.set(m.unitNumber, unit);
    }
    unit.modules.push(m);
  }
  return Array.from(byUnit.values()).sort((a, b) => a.unitNumber - b.unitNumber);
}

export function findModuleById(id: string): CurriculumModule | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}

export function getSubjectByName(nameOrId: string) {
  return SUBJECT_METAS.find(
    (s) => s.name.toLowerCase() === nameOrId.toLowerCase() || s.id.toLowerCase() === nameOrId.toLowerCase()
  );
}

export function searchCurriculum(query: string, limit = 30): CurriculumModule[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_MODULES.slice(0, limit);
  const terms = q.split(/\s+/).filter(Boolean);
  return ALL_MODULES.filter((mod) => {
    const haystack = `${mod.title} ${mod.unitTitle} ${mod.subjectName} ${mod.summary} class ${mod.grade} grade ${mod.grade}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  }).slice(0, limit);
}
