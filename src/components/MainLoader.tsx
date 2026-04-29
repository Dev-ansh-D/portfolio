import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface MainLoaderProps {
  onDone: () => void;
}

export default function MainLoader({ onDone }: MainLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30, mass: 0.5 }); // Added spring for smoothing

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768; // md breakpotin

  // Morphing 'DEVANSH' based on scroll
  // Desktop: starts 16rem, ends 10rem (scale: 0.625)
  // Mobile: starts 8xl (6rem), ends 7xl (4.5rem) (scale: 0.75)
  const targetScale = isMobile ? 0.75 : 0.625;
  const targetY = isMobile ? -windowHeight * 0.15 : -windowHeight * 0.11;

  const textScale = useTransform(smoothY, [0, 500], [1, targetScale]);
  const textY = useTransform(smoothY, [0, 500], [0, targetY]); // Move up slightly to overlap
  const textX = useTransform(smoothY, [0, 500], [0, 0]); // Keep centered horizontally
  
  // Fade out the morphing text right as it aligns, revealing the identical hero text
  const textOpacity = useTransform(smoothY, [450, 500], [1, 0]); 
  
  // The black curtain fades out
  const overlayOpacity = useTransform(smoothY, [200, 500], [1, 0]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5; 
      });
    }, 15); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !isReady) {
      setIsReady(true);
      onDone();
    }
  }, [progress, isReady, onDone]);

  const letters = "DEVANSH".split('');

  const getDirection = (i: number) => {
    const directions = [
      { x: -300, y: -200 }, { x: 0, y: -300 }, { x: 300, y: -200 },
      { x: -300, y: 200 }, { x: 0, y: 300 }, { x: 300, y: 200 }, { x: 200, y: -400 }
    ];
    return directions[i % directions.length];
  };

  return (
    <>
      {/* Pinned Black Background */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center pointer-events-none"
      >
        {!isReady && (
          <div className="absolute bottom-32 w-72 h-[2px] bg-white/5 overflow-hidden rounded-full font-mono">
            <motion.div 
              className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
            <div className="absolute top-4 left-0 w-full text-center text-[8px] tracking-[0.5em] text-white/20 uppercase mt-2">
              Syncing Systems... {Math.floor(progress)}%
            </div>
          </div>
        )}
        
        {isReady && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 0], y: 0 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-32 text-[10px] font-mono tracking-[1.5em] text-white/40 uppercase"
          >
            Scroll to begin
          </motion.div>
        )}
      </motion.div>

      {/* The Morphing Name */}
      <motion.div 
        className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none"
        style={{ 
          scale: textScale,
          y: textY,
          x: textX,
          opacity: textOpacity
        }}
      >
        <div className="flex">
          {letters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ 
                opacity: 0, 
                x: getDirection(i).x, 
                y: getDirection(i).y,
                scale: 2
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                y: 0, 
                scale: 1 
              }}
              transition={{ 
                duration: 1.8, 
                delay: i * 0.08, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="text-8xl md:text-[16rem] font-black tracking-tighter relative"
              style={{
                WebkitTextStroke: '2px rgba(255,255,255,0.05)',
                color: 'transparent',
              }}
            >
              {char}
              <motion.span
                className="absolute inset-0 overflow-hidden text-blue-500"
                style={{
                  height: `${progress}%`,
                  color: 'rgb(59, 130, 246)',
                  textShadow: '0 0 60px rgba(59, 130, 246, 0.3)'
                }}
              >
                {char}
              </motion.span>
            </motion.span>
          ))}
        </div>
      </motion.div>
    </>
  );
}


