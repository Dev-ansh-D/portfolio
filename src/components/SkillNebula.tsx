import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const SKILLS = [
  { name: 'Python', size: 100, color: '#3b82f6' },
  { name: 'React', size: 120, color: '#60a5fa' },
  { name: 'OpenCV', size: 90, color: '#10b981' },
  { name: 'Node.js', size: 110, color: '#8b5cf6' },
  { name: 'ML', size: 130, color: '#f43f5e' },
  { name: 'Figma', size: 80, color: '#f59e0b' },
  { name: 'SQL', size: 70, color: '#06b6d4' },
  { name: 'AI', size: 140, color: '#2563eb' },
  { name: 'Docker', size: 85, color: '#1d4ed8' },
  { name: 'GCP', size: 95, color: '#4285F4' },
];

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  name: string;
  color: string;
}

export default function SkillNebula() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      if (ballsRef.current.length === 0) {
        ballsRef.current = SKILLS.map(skill => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: skill.size / 2.5,
          name: skill.name,
          color: skill.color
        }));
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const balls = ballsRef.current;

      for (let i = 0; i < balls.length; i++) {
        const b1 = balls[i];

        // Advanced Attraction & Physics
        for (let j = 0; j < balls.length; j++) {
          if (i === j) continue;
          const b2 = balls[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minContext = (b1.radius + b2.radius) * 1.8;

          if (dist < minContext) {
            const force = (minContext - dist) * 0.0002;
            b1.vx -= dx * force;
            b1.vy -= dy * force;
          }
        }

        // Mouse Interaction (The "Catch" mechanic)
        const mdx = mouseRef.current.x - b1.x;
        const mdy = mouseRef.current.y - b1.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        
        if (mdist < 150) {
          const mforce = (150 - mdist) * 0.002;
          b1.vx += mdx * mforce;
          b1.vy += mdy * mforce;
          
          // Visual link when close
          ctx.beginPath();
          ctx.moveTo(b1.x, b1.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `${b1.color}44`;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Bounds with bounce
        if (b1.x < b1.radius) { b1.x = b1.radius; b1.vx *= -0.8; }
        if (b1.x > canvas.width - b1.radius) { b1.x = canvas.width - b1.radius; b1.vx *= -0.8; }
        if (b1.y < b1.radius) { b1.y = b1.radius; b1.vy *= -0.8; }
        if (b1.y > canvas.height - b1.radius) { b1.y = canvas.height - b1.radius; b1.vy *= -0.8; }

        b1.x += b1.vx;
        b1.y += b1.vy;
        b1.vx *= 0.98; 
        b1.vy *= 0.98;

        // 3D Visuals
        const highlightX = b1.x - b1.radius * 0.3;
        const highlightY = b1.y - b1.radius * 0.3;
        
        const gradient = ctx.createRadialGradient(
          highlightX, highlightY, b1.radius * 0.1, 
          b1.x, b1.y, b1.radius
        );
        gradient.addColorStop(0, '#ffffff'); // Spectral inner highlight
        gradient.addColorStop(0.2, b1.color); // Solid base color
        gradient.addColorStop(0.8, b1.color + 'aa'); // Slightly darker/transparent towards edge
        gradient.addColorStop(1, '#050505'); // Ambient shadow at edge

        ctx.beginPath();
        ctx.arc(b1.x, b1.y, b1.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Removed stroke to let the shadow define the edge of the sphere

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px font-mono';
        ctx.textAlign = 'center';
        ctx.fillText(b1.name, b1.x, b1.y);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      
      // Hit detection for scoring
      ballsRef.current.forEach(ball => {
        const dx = nx - ball.x;
        const dy = ny - ball.y;
        if (Math.sqrt(dx*dx + dy*dy) < ball.radius) {
           setScore(s => s + 1); // Hover scoring
        }
      });

      mouseRef.current = { x: nx, y: ny };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 block"
            >
              Interactive Nebula
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white"
            >
              Mastering <br />
              <span className="text-blue-500 text-glow">The Grid.</span>
            </motion.h2>
          </div>
          
          <div className="p-8 liquid-glass border border-white/10 rounded-3xl min-w-[200px] text-center">
            <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-2 font-bold">Resonance Level</p>
            <p className="text-6xl font-black text-white font-mono">{Math.floor(score / 50)}</p>
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-blue-500" 
                 animate={{ width: `${(score % 50) * 2}%` }}
               />
            </div>
          </div>
        </div>

        <div className="relative h-[700px] w-full bg-black/40 rounded-[4rem] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.1)] group">
          <canvas 
            ref={canvasRef}
            className="w-full h-full cursor-none"
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          
          <div className="absolute bottom-10 left-10 flex items-center gap-4 text-white/40 text-[10px] uppercase font-bold tracking-widest">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            Hover to Influence the Skills
          </div>
        </div>
      </div>
    </section>
  );
}
