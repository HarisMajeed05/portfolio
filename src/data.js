// All copy and facts for the site live here. Pulled from my four resumes
// and the READMEs of my public repos, nothing is invented.

export const ME = {
  name: "Haris Majeed Raja",
  role: "AI Engineer",
  org: "MLBench",
  place: "Lahore, Pakistan",
  email: "harismajeed0501@gmail.com",
  // a Formspree endpoint like https://formspree.io/f/abcd1234 turns on the message
  // form in the contact chapter. It comes from the FORM_URL repo variable at build time.
  form: import.meta.env.VITE_FORM_URL || "",
  github: "https://github.com/HarisMajeed05",
  linkedin: "https://www.linkedin.com/in/harismajeedraja",
};

export const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const RESUMES = [
  { label: "AI engineering", file: "Haris-Majeed-Raja-AI.pdf" },
  { label: "Research", file: "Haris-Majeed-Raja-Research.pdf" },
  { label: "Software", file: "Haris-Majeed-Raja-Software.pdf" },
  { label: "General", file: "Haris-Majeed-Raja-General.pdf" },
];

export const CHAPTERS = [
  { id: "intro", label: "Intro" },
  { id: "brief", label: "Brief" },
  { id: "timeline", label: "Timeline" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Toolbox" },
  { id: "contact", label: "Contact" },
];

export const BRIEF = {
  lead: "Started with web apps.",
  em: "Ended up teaching machines to see.",
  body: "I began with full-stack apps, then picked up machine learning through internships in front-end, ML and Salesforce. My final year project went deep on multimodal deepfake detection under Dr. Waqas Sultani. Today I am an AI Engineer at MLBench, turning detection research into pipelines clients can run.",
  ask: "I am looking for AI and computer vision engineering roles, and for graduate research in vision or multimodal learning.",
};

// "Read me as" switch. Each lens reorders the ring, rewrites two lines and points
// at the matching resume. Wording follows the summary on that resume.
export const LENSES = [
  {
    id: "general",
    label: "General",
    resume: "Haris-Majeed-Raja-General.pdf",
    lede: "I build computer vision systems that read documents, count crowds and catch fakes, then ship them as working software.",
    ask: BRIEF.ask,
    first: [],
  },
  {
    id: "ai",
    label: "AI",
    resume: "Haris-Majeed-Raja-AI.pdf",
    lede: "I turn detection research into pipelines clients can run: RF-DETR for document fields, DINOv2 for rice grading, YOLO and ByteTrack for counting people.",
    ask: "Through the AI lens: production computer vision pipelines, from fine-tuned RF-DETR at MLBench to a footfall counter that runs on CPU.",
    first: ["document-field-detection", "rice-grain-quality-analysis", "multimodal-deepfake-detection", "footfall-counter", "object-defect-detection", "legal-ai-chatbot", "scratchgpt"],
  },
  {
    id: "research",
    label: "Research",
    resume: "Haris-Majeed-Raja-Research.pdf",
    lede: "I work on where vision models fail and how they can explain themselves, starting with deepfake detection under Dr. Waqas Sultani.",
    ask: "Through the research lens: I am looking for graduate research in computer vision or multimodal learning, on model robustness, interpretability and efficient AI systems.",
    first: ["multimodal-deepfake-detection", "scratchgpt", "furuta-pendulum-rl", "pashto-speech-recognition", "document-field-detection", "footfall-counter"],
  },
  {
    id: "software",
    label: "Software",
    resume: "Haris-Majeed-Raja-Software.pdf",
    lede: "I build full-stack and backend systems, from React frontends and FastAPI services to a compiler written from scratch.",
    ask: "Through the software lens: React, Node.js, FastAPI and MongoDB apps, plus backend and AI-integrated systems at MLBench.",
    first: ["legal-ai-chatbot", "live-whiteboard", "airbnb-clone-extended", "c-compiler-from-scratch", "ai-meeting-summarizer", "footfall-counter", "scratchgpt"],
  },
];

export const STATS = [
  { from: 0.8568, to: 0.8896, dec: 4, label: "F1 on document field detection, one RF-DETR model against a three-model pipeline" },
  { from: 0, to: 80, dec: 0, prefix: ">", suffix: "%", label: "smaller than the 11B/7B VLMs it replaces, on one consumer GPU (ExDDV-Judge)" },
  { from: 0, to: 83, dec: 0, suffix: "%", label: "real-frame accuracy after the Dual-DB router, up from 0%" },
  { from: 0, to: 3.28, dec: 2, suffix: "/4", label: "CGPA, BS Computer Science at ITU Lahore" },
];

// Gates in the timeline tunnel. Newest first, you fly back in time.
export const ROLES = [
  {
    title: "AI Engineer",
    org: "MLBench Pvt Ltd",
    big: "MLBench",
    time: "Jun 2026 to now",
    conf: "0.98",
    points: [
      "Replaced a client's three-model document field pipeline (YOLO, FFDNet/FFDetr and a geometry classifier) with one fine-tuned RF-DETR-Base.",
      "F1 went from 0.8568 to 0.8896, with 0.9335 precision and 0.8496 recall on an annotated document set.",
      "Compared Tesseract and DocTR as OCR backends. DocTR fixed the checkbox glyph misreads and garbled low-resolution footers.",
      "Trained DINOv2 classifiers that grade rice grains as Full, Broken, Rejected, Weak or Fatty, and identify the variety of Full grains.",
    ],
  },
  {
    title: "Teaching Assistant, Software Engineering and AI",
    org: "Information Technology University",
    big: "ITU",
    time: "Aug 2025 to Jun 2026",
    conf: "0.96",
    points: [
      "Taught system design, version control, testing, search algorithms and machine learning fundamentals.",
      "Mentored student teams on model selection, experiment design and evaluation, with Python, scikit-learn and PyTorch.",
      "Ran code reviews, graded assignments and exams, and wrote feedback students could act on.",
    ],
  },
  {
    title: "Front-End Intern",
    org: "Certura",
    big: "Certura",
    time: "Jul to Aug 2025",
    conf: "0.91",
    points: [
      "Built a responsive portfolio site in HTML, CSS and JavaScript with animations and media queries.",
      "Shipped a to-do app and a weather dashboard on the OpenWeather API, with live fetching and error handling.",
    ],
  },
  {
    title: "Machine Learning Intern",
    org: "Arch Technologies",
    big: "Arch",
    time: "Jun to Aug 2025",
    conf: "0.93",
    points: [
      "Built spam detection with TF-IDF and Naive Bayes, housing price regression, and digit and iris classifiers.",
      "Evaluated every model with accuracy, R2, MAE and MSE using scikit-learn, NLTK and matplotlib.",
    ],
  },
  {
    title: "Salesforce Admin Intern",
    org: "Incredibles",
    big: "Incredibles",
    time: "Jun to Sep 2024",
    conf: "0.89",
    points: [
      "Completed the Salesforce Administrator path on Trailhead through hands-on projects.",
      "Worked with data modeling, reports, dashboards, flows and the basics of Apex.",
    ],
  },
  {
    title: "BS Computer Science",
    org: "Information Technology University, Lahore",
    big: "BSCS",
    time: "Aug 2022 to Jun 2026",
    conf: "0.95",
    points: [
      "CGPA 3.28 out of 4.0.",
      "Final year project on multimodal deepfake detection with vision-language models, supervised by Dr. Waqas Sultani.",
    ],
  },
];

const GH = "https://github.com/HarisMajeed05";

// Cards on the project ring. `art` picks the picture drawn on the card.
export const PROJECTS = [
  {
    title: "Multimodal Deepfake Detection",
    short: "ExDDV-Judge",
    kind: "Final year project",
    year: "2025 to 2026",
    art: "pipeline",
    desc: "ExDDV-Judge detects a fake, explains why, then judges its own explanation. BLIP-2 T5-XL and LLaVA-Mini replace 11B/7B VLMs, over 80% smaller on one consumer GPU. A Dual-DB router with a fine-tuned CLIP encoder took real-frame accuracy from 0% to 83%. A Flask app serves labels, explanations and trust scores.",
    stack: ["PyTorch", "BLIP-2", "LLaVA-Mini", "CLIP", "Flask"],
    href: null,
    note: "Supervised by Dr. Waqas Sultani",
  },
  {
    title: "scratchgpt",
    short: "LLM from scratch",
    kind: "Language models",
    year: "2026",
    art: "tokens",
    desc: "A multimodal decoder LLM codebase built from scratch: its own tokenizer, pretraining, SFT, DPO, verified-reward RL and distillation from an open-weight teacher. The default student is 109M parameters with RoPE, grouped-query attention and SwiGLU. Adds FAISS retrieval, CPU INT8 export and an OpenAI-compatible chat server.",
    stack: ["PyTorch", "DPO", "RL", "FAISS", "INT8"],
    href: `${GH}/scratchgpt`,
  },
  {
    title: "Document Field Detection",
    short: "RF-DETR",
    kind: "MLBench client work",
    year: "2026",
    art: "fields",
    desc: "One fine-tuned RF-DETR-Base model replaced a client's three-model pipeline for finding fields in PDF forms. Precision 0.9335, recall 0.8496, F1 up from 0.8568 to 0.8896. I annotated field geometry, type and role for the training set and compared OCR backends.",
    stack: ["RF-DETR", "DocTR", "Tesseract", "PyTorch"],
    href: null,
    note: "Client work, no public repo",
  },
  {
    title: "Legal AI Chatbot",
    short: "RAG",
    kind: "Full stack",
    year: "Jul 2026",
    art: "graph",
    desc: "A legal assistant that answers from the documents you upload. Retrieval is scoped per project, so one client's files never leak into another's answers, and every reply cites its source. JWT auth, memory and streaming, with the LLM on Groq so the backend needs no GPU.",
    stack: ["React", "FastAPI", "MongoDB", "LangChain", "FAISS", "Groq"],
    href: `${GH}/legal-ai-chatbot`,
  },
  {
    title: "Footfall Counter",
    short: "YOLO + ByteTrack",
    kind: "Computer vision",
    year: "Jun 2026",
    art: "tracks",
    desc: "Counts people entering and leaving a space from video or a webcam. YOLO or RT-DETR finds people, ByteTrack keeps one ID per person, and a virtual line at any angle splits entries from exits. A small tool lets you draw the line for any camera. Runs entirely on CPU.",
    stack: ["YOLO11", "RT-DETR", "ByteTrack", "OpenCV"],
    href: `${GH}/Footfall-counter-Yolo`,
  },
  {
    title: "Rice Grain Quality Analysis",
    short: "DINOv2",
    kind: "MLBench client work",
    year: "2026",
    art: "grains",
    desc: "DINOv2-based classifiers trained at several image resolutions grade each grain as Full, Broken, Rejected, Weak or Fatty, then identify the variety of the Full grains.",
    stack: ["DINOv2", "PyTorch"],
    href: null,
    note: "Client work, no public repo",
  },
  {
    title: "GestVox",
    short: "Gestures + voice",
    kind: "Vision + voice",
    year: "Open source",
    art: "hand",
    desc: "Hands-free control for Windows. MediaPipe hand tracking turns pinches and swipes into clicks, scrolling, zoom and media keys, and a voice assistant handles the rest in English, Urdu and Punjabi. It remembers you between sessions and tells users apart by voice.",
    stack: ["MediaPipe", "OpenCV", "Whisper", "Groq"],
    href: `${GH}/GestVox`,
  },
  {
    title: "Pashto Speech Recognition",
    short: "Whisper",
    kind: "Speech",
    year: "Open source",
    art: "asr",
    desc: "Pashto has about 60 million speakers and little speech data. This fine-tunes Whisper on Common Voice Pashto, then reports Word Error Rate before and after so the gain is measured, not claimed. Training resumes after Ctrl+C from rolling checkpoints.",
    stack: ["Whisper", "Transformers", "PyTorch", "Common Voice"],
    href: `${GH}/pashto-asr`,
  },
  {
    title: "Furuta Pendulum RL",
    short: "SAC to C header",
    kind: "Reinforcement learning",
    year: "Open source",
    art: "pendulum",
    desc: "A SAC agent learns to balance a rod on a spinning arm inside a custom physics simulator, with optional random disturbances in training. The policy exports as one dependency-free C header, two hidden layers of 64 units, ready for a microcontroller loop at about 100 Hz.",
    stack: ["SAC", "Stable-Baselines3", "Gymnasium", "C"],
    href: `${GH}/furuta-pendulum-rl`,
  },
  {
    title: "Object Defect Detection",
    short: "YOLO",
    kind: "Computer vision",
    year: "Open source",
    art: "defect",
    desc: "One YOLO model that spots defects on fruit, bottles, parcels, glass, aluminium and welds. It merges nine Roboflow datasets, and training can be stopped with Ctrl+C and resumed, on CPU or GPU.",
    stack: ["Python", "YOLO", "Roboflow"],
    href: `${GH}/Object-Defect-Detection`,
  },
  {
    title: "AI Meeting Summarizer",
    short: "Whisper + BART",
    kind: "NLP",
    year: "Open source",
    art: "wave",
    desc: "Drop in meeting audio, record live or paste a transcript. Whisper transcribes, BART summarizes, and the app pulls out action items and dates and exports it all as a PDF. A Django web app with a Gradio version of the same pipeline.",
    stack: ["Django", "Whisper", "BART", "Gradio"],
    href: `${GH}/AI-Meeting-Summarizer`,
  },
  {
    title: "Live Whiteboard",
    short: "Realtime canvas",
    kind: "Full stack",
    year: "Open source",
    art: "board",
    desc: "Several people draw on one board and watch each other's named cursors move live. A Fabric.js canvas with pen, shapes, text, undo and redo, FastAPI WebSockets carrying every stroke, JWT login, and boards saved in MongoDB so they reopen where you left them.",
    stack: ["React", "Fabric.js", "FastAPI", "WebSockets", "MongoDB"],
    href: `${GH}/Live-Whiteboard`,
  },
  {
    title: "C++ Compiler From Scratch",
    short: "Lexer to x86",
    kind: "Systems",
    year: "Sep to Dec 2025",
    art: "tree",
    desc: "A compiler for a subset of C++, written in C++. Hand-written lexer, recursive-descent parser with semantic checks, assembly output and a small x86 assembler, plus the same grammar built with Bison.",
    stack: ["C++", "Bison", "x86"],
    href: `${GH}/Cpp-Compiler-From-Scratch`,
  },
  {
    title: "Airbnb Clone (Extended)",
    short: "MERN",
    kind: "Full stack",
    year: "Oct to Dec 2024",
    art: "listings",
    desc: "An Airbnb-style booking app on React, Express and MongoDB. JWT login with role-based pages for users, hosts and admins, listing details, bookings, host-side listing management and admin tools to add listings and manage users.",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    href: `${GH}/Airbnb-Inspired-Homepage`,
  },
];

// The longer write-up behind each card, shown in the case study view. Every line
// comes from my resumes or from what the repo README says, including the limits.
const STORIES = {
  "multimodal-deepfake-detection": {
    why: "Binary deepfake detectors fall to near-chance accuracy on high-quality fakes, and they cannot say why they decided what they did. I benchmarked SBI, AltFreezing and Face Warping Detection on FaceForensics++, Celeb-DF-v2 and HiDF to show it.",
    how: "ExDDV-Judge works in three stages: detect, explain, judge. BLIP-2 T5-XL and LLaVA-Mini stand in for 11B and 7B VLMs, and pairing BLIP-2 with DeepfakeJudge scores how faithful each explanation is. A Dual-DB router with a fine-tuned CLIP encoder fixed a bug in prior work that misclassified real frames.",
    result: "Over 80% smaller than the VLMs it replaces, on one consumer GPU. Real-frame accuracy went from 0% to 83%. A Flask app returns per-frame labels, explanations and trust scores.",
  },
  scratchgpt: {
    why: "A modern multimodal decoder with its own student model and its own tokenizer, covering the path from raw text to a served model.",
    how: "A 32k byte-level BPE tokenizer, then pretraining, SFT, distillation from a local teacher (Qwen3-0.6B by default), DPO and optional RL. The student has 108,989,184 parameters with RoPE, 12 query heads and 3 KV heads, SwiGLU and RMSNorm. FAISS retrieval, an optional VQ-VAE image tokenizer, CPU INT8 export and an OpenAI-compatible server finish it off.",
    limits: "No trained weights are bundled, so the repo is the pipeline, not a finished model. The RL stage is a research baseline, not PPO or production GRPO, and long-context ability is unmeasured.",
  },
  "document-field-detection": {
    why: "A client found the fields in PDF forms with three models in a row: YOLO, FFDNet/FFDetr and a geometry classifier.",
    how: "I annotated field geometry, type and role on the client's PDFs to build the training set, then fine-tuned a single RF-DETR-Base to replace all three. Experiment results were logged to choose between runs. I also compared Tesseract and DocTR as OCR backends.",
    result: "F1 rose from 0.8568 to 0.8896. Precision is 0.9335 and recall 0.8496, against 0.9394 and 0.7875 for the old pipeline, so precision slipped a little and recall gained the most. Tesseract misread checkbox glyphs and corrupted low-resolution footers, and DocTR fixed both.",
  },
  "legal-ai-chatbot": {
    why: "A legal assistant that answers from the documents you upload, with retrieval kept inside one project so a client's files never reach another client's answers.",
    how: "React on Vite, FastAPI and MongoDB. Uploaded PDFs are chunked into FAISS through LangChain, with all-MiniLM-L6-v2 embeddings running on CPU. The chat model runs on Groq, so the backend needs no GPU. Optional OCR handles scanned PDFs.",
    result: "Every answer cites its source, and a badge separates document-based answers from general knowledge. JWT login, conversation memory, streaming replies, rate limits, chat export to PDF and project sharing by email.",
  },
  "footfall-counter": {
    why: "Count the people entering and leaving a space, from a video file or a webcam.",
    how: "YOLO11 or RT-DETR finds people, ByteTrack keeps one ID per person so each is counted once per crossing, and a virtual line at any angle splits entries from exits. A small tool lets you draw the line on the first frame of your own camera.",
    result: "Runs on CPU, no GPU needed. Model size, confidence, IoU, image size and line position are all settings, so you can trade accuracy for speed.",
    limits: "Larger models are slow on CPU, so test on your own machine first.",
  },
  "rice-grain-quality-analysis": {
    why: "A client wanted rice graded grain by grain, and the variety identified for the good ones.",
    how: "I contributed to the tool by training DINOv2-based classifiers at several image resolutions. One grades each grain as Full, Broken, Rejected, Weak or Fatty, and the variety is then identified among the Full grains.",
    limits: "Client work, so there is no public repo and no published numbers.",
  },
  gestvox: {
    why: "Move the mouse, click and scroll with hand gestures, or talk to a full voice assistant, hands free on Windows.",
    how: "MediaPipe tracks the hand. The index finger moves the cursor, a thumb and index pinch clicks or drags, thumb and pinky right-clicks, palm swipes go back and forward or switch windows, and a closed fist toggles voice mode. Voice starts on a wake word, runs speech to text on Groq Whisper or local faster-whisper, replies sentence by sentence and can be interrupted.",
    result: "It hears English, Urdu, Punjabi and Urdu mixed with English, per sentence. It learns from corrections between sessions, tells users apart by voice with separate memory for each, and can use a remote camera over the local network or Tailscale. Destructive PC actions need spoken confirmation.",
  },
  "pashto-speech-recognition": {
    why: "Pashto has about 60 million speakers and Whisper underserves it. The aim is to measure how much fine-tuning improves it, with the relative gain as the result, not a state-of-the-art claim.",
    how: "Mozilla Common Voice Pashto, starting from openai/whisper-small. Training picks a GPU if there is one and falls back to CPU, saves a checkpoint every 200 steps, keeps the last three and resumes after an interruption. The eval script runs the stock model first, then the fine-tuned checkpoint, on up to 100 samples.",
    limits: "It will not reach English-tier accuracy, and community-recorded audio varies in quality. You run the evaluation yourself to get the before and after numbers.",
  },
  "furuta-pendulum-rl": {
    why: "Balance a rod on a spinning arm, a rotary inverted pendulum, with a policy small enough to run on a microcontroller.",
    how: "A SAC agent trains in a custom physics simulator built on the standard Furuta pendulum equations, with optional random disturbance bumps. The policy reads four inputs (theta, theta_dot, alpha, alpha_dot), has two hidden layers of 64 units and exports as one dependency-free C header, furuta_policy_forward(), for a control loop at about 100 Hz.",
    limits: "The mass, length and friction values are placeholders, not measured from hardware, and encoder noise, control delay and motor deadband are not simulated.",
  },
  "object-defect-detection": {
    why: "Tell normal objects from defective ones across fruit, bottles, parcels, glass, aluminium and welds, with one model.",
    how: "A merge script combines nine Roboflow Universe datasets, about 3,400 images by the README's per-dataset counts, into one train and validation split, and maps any class that is not clearly good to defect. YOLO11 trains on two classes, normal and defect. Training resumes after Ctrl+C or a crash, and detect.py reads a USB camera, an image or a video.",
  },
  "ai-meeting-summarizer": {
    why: "Turn meeting audio or a pasted transcript into a summary, action items and key dates, then export it.",
    how: "Whisper (whisper-small) transcribes the audio and BART (bart-large-cnn) writes the summary. The app pulls out action items and important dates with the context for each date, and exports a PDF with the summary, transcript, action items and dates.",
    result: "A Django web app that takes an upload, a drag and drop or a live recording in the browser. A Gradio version runs the same pipeline, and a launcher packages it as a Windows build.",
  },
  "live-whiteboard": {
    why: "Several people draw on one board at the same time and see each other's cursors move live. Boards are saved, so they are there when you come back.",
    how: "React and Fabric.js in the browser, FastAPI with JWT login behind it. Every stroke, shape and text box gets an ID when it is created and goes to everyone on the board over WebSockets, along with cursor positions. MongoDB keeps each object as its own document and does not store cursors. Edits to different objects never conflict, and if two people edit the same one at once, the last write wins.",
    limits: "No zoom or pan, the eraser removes whole objects, and anyone with a board ID can edit that board.",
  },
  "c-compiler-from-scratch": {
    why: "A small compiler for a subset of C++, written in C++ to learn how compilers work.",
    how: "A hand-written lexer, then a recursive-descent parser with basic semantic checks, then assembly generation. A small x86 assembler writes the binary. The same grammar is implemented twice, by hand and with Bison, and written down in grammar.md.",
  },
  "airbnb-clone-extended": {
    why: "Recreate the Airbnb homepage as a working app, with login, listing pages, bookings and separate views for users, hosts and admins.",
    how: "React on Vite with CSS modules for the responsive layout, and Node.js, Express and MongoDB behind it. JWT sign up and login, then role-based pages: a user profile, host listing management, and admin tools to add listings and manage users.",
    result: "A homepage with a navbar, search bar, scrollable categories and listing cards, plus listing details and bookings.",
  },
};

// ids double as deep links, like #work/scratchgpt
PROJECTS.forEach((p) => {
  p.id = slug(p.title);
  p.story = STORIES[p.id];
});

// What shows up across the projects. Every line is a fact from the cards above.
export const NOTES = [
  { k: "Measured", t: "I report a baseline and an after: F1 0.8568 to 0.8896, real-frame accuracy 0% to 83%, Word Error Rate before and after fine-tuning." },
  { k: "Small enough to run", t: "VLMs over 80% smaller on one consumer GPU, people counting on CPU, hosted LLMs so backends need no GPU." },
  { k: "Shipped", t: "Flask, FastAPI and Django apps, a Windows tool you control with your hands, a C header for microcontrollers." },
];


// Short write-ups of things I measured or fixed. Numbers are from my resumes.
export const LAB = [
  {
    id: "recall",
    tag: "Document field detection",
    title: "Precision slipped, recall jumped",
    text: "The client's three-model pipeline scored 0.9394 precision and 0.7875 recall. One fine-tuned RF-DETR-Base scored 0.9335 and 0.8496. Precision is about the same, but the new model finds far more of the fields the old one missed, and F1 went from 0.8568 to 0.8896. I chose between runs from logged experiment results.",
    nums: [
      { v: "0.7875 to 0.8496", l: "recall" },
      { v: "0.8568 to 0.8896", l: "F1" },
    ],
    project: "document-field-detection",
  },
  {
    id: "ocr",
    tag: "Document field detection",
    title: "Some of the errors were the OCR",
    text: "Part of the systematic error downstream came from poor OCR quality, not from the detector. Tesseract misread checkbox glyphs and corrupted text in low-resolution footers. DocTR resolved both, so I compared the two backends instead of tuning the detector further.",
    nums: [
      { v: "2", l: "OCR backends compared" },
      { v: "DocTR", l: "fixed both problems" },
    ],
    project: "document-field-detection",
  },
  {
    id: "zero",
    tag: "Final year project",
    title: "From 0% to 83% on real frames",
    text: "Prior work misclassified real frames outright, with 0% accuracy on them. A Dual-DB routing system with a fine-tuned CLIP encoder took that to 83%. Before that, benchmarking SBI, AltFreezing and Face Warping Detection on FaceForensics++, Celeb-DF-v2 and HiDF had shown binary classifiers falling to near-chance accuracy on high-quality deepfakes, with no way to explain a prediction.",
    nums: [
      { v: "0% to 83%", l: "real-frame accuracy" },
      { v: "3", l: "benchmark datasets" },
    ],
    project: "multimodal-deepfake-detection",
  },
  {
    id: "small",
    tag: "Final year project",
    title: "Smaller models that still explain",
    text: "ExDDV-Judge detects, explains, then judges. BLIP-2 T5-XL and LLaVA-Mini stand in for 11B and 7B VLMs, which cuts model size by over 80% and fits on a single consumer GPU. Pairing BLIP-2 with DeepfakeJudge gives explanations that carry a faithfulness score.",
    nums: [
      { v: ">80%", l: "smaller" },
      { v: "1", l: "consumer GPU" },
    ],
    project: "multimodal-deepfake-detection",
  },
  {
    id: "baseline",
    tag: "Pashto speech recognition",
    title: "Measure the stock model first",
    text: "The Pashto repo is built around a baseline: run the stock Whisper model on the samples, fine-tune, then run the same samples again. The README says plainly that the result will not reach English-tier accuracy, and that the relative gain is the point.",
    nums: [
      { v: "~60M", l: "Pashto speakers" },
      { v: "200", l: "steps between checkpoints" },
    ],
    project: "pashto-speech-recognition",
  },
];

// Shown under the hero buttons
export const STATUS = [
  { k: "Now", t: "Computer vision, document AI and RAG systems for MLBench clients" },
  { k: "Open to", t: "AI and computer vision roles, graduate research" },
];

// Every other public repo worth listing. tags: ai, web, sys, game
export const FILTERS = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI and vision" },
  { id: "web", label: "Web and apps" },
  { id: "sys", label: "Systems" },
  { id: "game", label: "Games" },
];

const R = (name, title, lang, tags, text) => ({ name, title, lang, tags, text, href: `${GH}/${name}` });
export const ARCHIVE = [
  R("scratchgpt", "scratchgpt", "Python", ["ai"], "Multimodal decoder LLM from scratch: tokenizer, pretraining, SFT, DPO, RL, INT8 export and a chat server."),
  R("GestVox", "GestVox", "Python", ["ai"], "Hands-free Windows control with hand gestures and a voice assistant in English, Urdu and Punjabi."),
  R("pashto-asr", "Pashto Speech Recognition", "Python", ["ai"], "Fine-tunes Whisper on Pashto Common Voice and reports Word Error Rate before and after."),
  R("furuta-pendulum-rl", "Furuta Pendulum RL", "Python", ["ai"], "A SAC agent balances a rotary inverted pendulum and exports its policy as a C header."),
  R("self-driving-rl", "Self-Driving RL", "Python", ["ai"], "A PPO agent learns to drive among other cars in the highway-env simulator."),
  R("legal-ai-chatbot", "Legal AI Chatbot", "JavaScript", ["ai", "web"], "RAG legal assistant on React, FastAPI, LangChain and FAISS with a Groq-hosted LLM."),
  R("Footfall-counter-Yolo", "Footfall Counter", "Python", ["ai"], "Counts people crossing a line with YOLO and ByteTrack, entries and exits kept apart."),
  R("Object-Defect-Detection", "Object Defect Detection", "Python", ["ai"], "One YOLO model for defects, trained on nine merged Roboflow datasets."),
  R("YOLO-Model-Training-Deployment", "YOLO Training and Deployment", "Python", ["ai"], "Tutorial to train a custom YOLO11 detector and run it on images, video or a webcam."),
  R("AI-Meeting-Summarizer", "AI Meeting Summarizer", "Python", ["ai", "web"], "Django app that transcribes meetings, summarizes them, finds action items and exports a PDF."),
  R("brainbox-ai-chatbot-app", "BrainBox AI Chatbot", "JavaScript", ["ai", "web"], "Mobile-style AI assistant inside a phone frame. React, FastAPI, MongoDB and Groq."),
  R("ai-photo-selector", "AI Photo Selector", "Python", ["ai"], "Groups photos of the same scene, ranks them by quality and copies the best. Originals stay put."),
  R("ai-file-organizer", "AI File Organizer", "Python", ["ai"], "Watches folders, reads each file with a Groq-hosted LLM, then renames and sorts it."),
  R("ai-voice-note-to-task", "Voice Note to Task", "Python", ["ai"], "Telegram bot that turns voice notes into dated tasks and sends reminders."),
  R("Live-Whiteboard", "Live Whiteboard", "JavaScript", ["web"], "Shared whiteboard with live cursors. React, Fabric.js, FastAPI WebSockets, JWT and MongoDB."),
  R("Airbnb-Inspired-Homepage", "Airbnb Clone", "JavaScript", ["web"], "Airbnb-style app with JWT login, role-based pages, listings and bookings."),
  R("hours-planner", "Hours Planner", "JavaScript", ["web"], "Android app on Expo and React Native that plans office hours against a monthly target."),
  R("portfolio", "This portfolio", "JavaScript", ["web"], "The site you are on. React, three.js, postprocessing and Lenis."),
  R("Calculator-C-Sharp", "Scientific Calculator", "C#", ["web"], "Scientific calculator as a C# Windows Forms desktop app."),
  R("Paint-Brush", "Paint Brush", "Python", ["web"], "Paint app in Python and Tkinter with drawing tools, colors, shapes and image save and open."),
  R("Cpp-Compiler-From-Scratch", "C++ Compiler From Scratch", "C++", ["sys"], "Toy C++ compiler: lexer, recursive descent parser, semantic checks and assembly output."),
  R("Kernel_module", "USB Kernel Module", "C", ["sys"], "Linux kernel module that plays a sound and gates access to a file on USB plug and unplug."),
  R("Doss-Shell-Text-Editor", "DOS Shell and Editor", "C++", ["sys"], "DOS-style command shell in C++ with a file tree and a built-in text editor."),
  R("Search-Engine", "Search Engine", "C++", ["sys"], "Document search engine in C++ on an inverted index of words and positions."),
  R("Vending-Machine-Logisim", "Vending Machine Logic", "Logisim", ["sys"], "Vending machine built from an ALU, adders, a comparator, multiplexers and flip-flops."),
  R("Chess-Game", "Chess", "C++", ["game"], "Console chess with a class per piece, move validation and saving."),
  R("Shogi-Game", "Shogi", "C++", ["game"], "Console Shogi with undo, captured piece handling and save support."),
  R("Gomuko-2", "Gomoku", "C++", ["game"], "Five in a row against a computer, with configurable board size and win count."),
  R("Snake-game", "Snake", "C++", ["game"], "Windows console Snake with sound effects and scoring."),
  R("Bcs22017-Bcs22131-Solitaire-Game", "Solitaire", "C++", ["game"], "Windows Solitaire with card images and separate classes for cards, deck, stock and piles."),
];
ARCHIVE.forEach((a) => (a.featured = PROJECTS.some((p) => p.href === a.href)));

// Three orbits on the toolbox gyroscope.
export const ORBITS = [
  {
    name: "Vision",
    color: "accent",
    words: ["YOLO", "RF-DETR", "DINOv2", "CLIP", "ByteTrack", "OpenCV", "Cellpose-SAM", "DocTR", "Tesseract"],
  },
  {
    name: "Language and retrieval",
    color: "#8fd8ff",
    words: ["PyTorch", "HuggingFace", "LangChain", "FAISS", "RAG", "Groq", "BLIP-2", "Qwen-VL", "scikit-learn"],
  },
  {
    name: "Engineering",
    color: "#ece8df",
    words: ["Python", "C++", "Java", "SQL", "React", "Node.js", "FastAPI", "Flask", "MongoDB", "Git", "Linux", "Salesforce"],
  },
];

// Where a tool shows up: project cards that list it and timeline roles that
// mention it. Matching is plain text, so it only says what the cards say.
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function usesOf(tool) {
  const t = tool.toLowerCase();
  const word = new RegExp(`(^|[^a-z0-9])${esc(t)}([^a-z0-9]|$)`, "i");
  const cards = PROJECTS.filter((p) => p.short.toLowerCase() === t || p.stack.some((x) => x.toLowerCase().startsWith(t)));
  const roles = ROLES.filter((r) => r.points.some((pt) => word.test(pt)));
  return { cards, roles };
}
