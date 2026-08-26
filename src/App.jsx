import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import BootSequence from "./components/BootSequence";
import ScrollGauge from "./components/ScrollGauge";
import KeyboardNav from "./components/KeyboardNav";
import CommandPalette from "./components/CommandPalette";
import AskBot from "./components/AskBot";
import BackToTop from "./components/BackToTop";

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="relative">
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      <CustomCursor />
      <div className="scanlines" />
      <div className="noise" />
      <ScrollGauge />
      <KeyboardNav />
      <CommandPalette />
      <AskBot />
      <BackToTop />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
