import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Cpu, Network } from 'lucide-react';

export default function Hero() {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30, mass: 0.5 });
  
  // Hand off the transition from MainLoader (scroll 0-500)
  // Hero components fade in underneath
  const contentOpacity = useTransform(smoothY, [200, 500], [0, 1]);
  const contentScale = useTransform(smoothY, [200, 500], [0.95, 1]);
  const contentY = useTransform(smoothY, [200, 500], [30, 0]);
  
  // Specifically fade in the "DEVANSH" text as the MainLoader morph finishes
  const heroTextOpacity = useTransform(smoothY, [450, 500], [0, 1]);

  return (
    <section id="home" className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        <motion.div
          style={{ opacity: contentOpacity, scale: contentScale, y: contentY }}
          className="z-10 text-center max-w-5xl"
        >
        <div className="inline-flex items-center gap-2 px-6 py-2 mb-10 rounded-full liquid-glass text-blue-400 text-sm font-mono tracking-[0.2em] uppercase">
          <Cpu size={14} />
          Full-Stack Developer & AI Researcher
        </div>
        
        <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter mb-8 leading-[0.8] uppercase flex flex-col items-center">
          <motion.span style={{ opacity: heroTextOpacity }} className="block w-full text-center">DEVANSH</motion.span>
          <span className="block bg-gradient-to-r from-white via-white to-blue-500 bg-clip-text text-transparent">
            AI & ML Engineer.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 font-light tracking-wide leading-relaxed p-6 liquid-glass rounded-2xl">
          Crafting immersive web experiences and intelligent systems through 
          the intersection of creative design and advanced engineering.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="#projects"
            className="group btn-primary px-10 py-5 rounded-full"
          >
            <span className="relative z-10 flex items-center gap-3 text-lg">
              View My Work <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          
          <a 
            href="mailto:devanshdangwal73@gmail.com"
            className="group btn-secondary px-10 py-5 rounded-full text-lg"
          >
            <span className="relative z-10 flex items-center gap-3 text-lg">
              Connect Now
              <Network size={18} className="group-hover:rotate-12 transition-transform" />
            </span>
          </a>
        </div>
      </motion.div>
      </div>
    </section>
  );
}

