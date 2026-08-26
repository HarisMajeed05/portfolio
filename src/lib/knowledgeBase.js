// Every fact here is pulled directly from Haris's resume. The chatbot only
// ever answers from this list, it never generates free-form text, so it
// cannot hallucinate facts or drift off-topic.

const KB = [
  {
    keywords: ["who", "haris", "about", "introduce", "yourself"],
    answer:
      "Haris Majeed Raja is an AI Engineer at MLBench Pvt Ltd, based in Lahore, Pakistan. He builds computer vision and full-stack AI systems, and is finishing a BS in Computer Science at ITU Lahore.",
  },
  {
    keywords: ["education", "university", "degree", "cgpa", "gpa", "itu", "study", "studying"],
    answer:
      "Haris is completing a BS in Computer Science at Information Technology University (ITU) Lahore, August 2022 to June 2026, with a CGPA of 3.28/4.0.",
  },
  {
    keywords: ["job", "work", "current", "role", "mlbench", "employer", "company"],
    answer:
      "Haris currently works as an AI Engineer at MLBench Pvt Ltd (since June 2026), building computer vision pipelines including a document field detection system built on a fine-tuned RF-DETR model.",
  },
  {
    keywords: ["rf-detr", "rfdetr", "precision", "recall", "f1", "field detection", "document"],
    answer:
      "At MLBench, Haris replaced a client's three-model document field detection pipeline (YOLO, FFDNet/FFDetr, and a geometry classifier) with a single fine-tuned RF-DETR model, reaching 0.9335 precision and 0.8496 recall, improving F1 from 0.8568 to 0.8896.",
  },
  {
    keywords: ["ta", "teaching", "assistant", "mentor", "student", "course"],
    answer:
      "Haris is a Teaching Assistant for Software Engineering and Artificial Intelligence at ITU (Aug 2025 – Jun 2026), covering system design, version control, testing, search algorithms, and ML fundamentals.",
  },
  {
    keywords: ["intern", "internship", "certura", "arch technologies", "incredibles", "salesforce"],
    answer:
      "Haris has interned as a Front-End Intern at Certura (web apps with HTML/CSS/JS), a Machine Learning Intern at Arch Technologies (spam detection, price prediction, classification models), and a Salesforce Admin Intern at Incredibles (data modeling, flows, Apex).",
  },
  {
    keywords: ["fyp", "final year", "thesis", "deepfake", "vlm", "sultani"],
    answer:
      "Haris's final year project is Multimodal Deepfake Detection using VLMs, supervised by Dr. Waqas Sultani. He designed ExDDV-Judge, a detect-explain-judge pipeline that replaces large 11B/7B parameter VLMs with lightweight alternatives, cutting model size by over 80% while running on a single consumer GPU. He also fixed a real-frame misclassification bug, taking accuracy from 0% to 83%.",
  },
  {
    keywords: ["legal", "chatbot", "rag", "langchain", "faiss", "groq"],
    answer:
      "Haris built a Legal AI Chatbot, a full-stack RAG-based legal assistant using React, FastAPI, and MongoDB, with LangChain, FAISS, and the Groq API (Llama 3.3 70B) for document-grounded, source-cited Q&A.",
  },
  {
    keywords: ["footfall", "people counting", "bytetrack", "yolo counter"],
    answer:
      "Haris built a Footfall Counter, a real-time people-counting system using YOLO/RT-DETR for detection and ByteTrack for tracking, with directional entry/exit counting via a configurable virtual line, optimized to run entirely on CPU.",
  },
  {
    keywords: ["compiler", "c++ compiler", "lexer", "parser"],
    answer:
      "Haris built a toy C++ Compiler From Scratch, covering lexical analysis, a recursive-descent parser, and semantic checks.",
  },
  {
    keywords: ["search engine", "inverted index"],
    answer:
      "Haris built a custom Search Engine in C++ using an inverted index, with multi-condition query handling and result ranking.",
  },
  {
    keywords: ["skills", "languages", "programming", "tech stack", "tools"],
    answer:
      "Haris works with C++, Python, Java, C, SQL, HTML, CSS, and JS. Frameworks include React, Node.js, Express, FastAPI, Flask, PyTorch, and scikit-learn. His CV stack includes YOLO, RF-DETR, DINOv2, Cellpose-SAM, ByteTrack, and OpenCV.",
  },
  {
    keywords: ["contact", "email", "reach", "hire", "linkedin", "github"],
    answer:
      "You can reach Haris at harismajeed0501@gmail.com, on LinkedIn at linkedin.com/in/harismajeedraja, or GitHub at github.com/HarisMajeed05.",
  },
  {
    keywords: ["resume", "cv", "pdf"],
    answer: "You can view Haris's full resume from the Resume link in the site footer / navigation.",
  },
];

const GREETING =
  "Hi, I'm a scoped assistant that only answers questions about Haris, his work, and his projects. Ask me anything about his experience, skills, or projects.";

const REFUSAL =
  "I can only answer questions about Haris Majeed Raja, his work, education, and projects. Try asking about his experience, skills, or one of his projects.";

export function answerQuestion(rawQuery) {
  const query = rawQuery.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (query.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore >= 3) return best.answer;
  return REFUSAL;
}

export { GREETING };
