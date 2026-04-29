import { useState } from 'react';
import MainLoader from './components/MainLoader';
import Background3D from './components/Background3D';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import SkillNebula from './components/SkillNebula';
import Contact from './components/Contact';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative min-h-screen text-white selection:bg-blue-500/30 selection:text-blue-200 ${!isLoaded ? 'overflow-hidden h-screen' : ''}`}>
      <MainLoader onDone={() => setIsLoaded(true)} />

      <div className="relative z-10">
        <CustomCursor />
        <Navbar />
        <div className="fixed inset-0 z-0">
          <Background3D />
        </div>
        <main>
          <Hero />
          <About />
          <Projects />
          <Experience />
          <SkillNebula />
          <Contact />
        </main>
      </div>
    </div>
  );
}

