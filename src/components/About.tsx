import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Database, Brain, Eye, Code2, Award } from 'lucide-react';

const stats = [
  { label: 'Modern Web Stack', value: 92, color: 'bg-blue-400' },
  { label: 'Python / AI', value: 90, color: 'bg-indigo-400' },
  { label: 'UI/UX Design', value: 88, color: 'bg-purple-400' },
  { label: 'Cloud Solutions', value: 85, color: 'bg-blue-600' },
];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={containerRef} id="about" className="relative min-h-screen flex items-center py-24 px-4 overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute top-[-25%] left-0 w-full h-[150%] z-0 opacity-[0.15] pointer-events-none"
        style={{ y }}
      >
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="Abstract Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </motion.div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-blue-400 font-mono tracking-widest uppercase mb-6 block"
            >
              Professional Summary
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-10 leading-[1.1] tracking-tight">
              Designing Digital <br />
              <span className="text-blue-500">Masterpieces.</span>
            </h2>
            <p className="text-xl text-white/60 mb-12 leading-relaxed font-light">
              I am a Computer Science student at Shivalik College of Engineering, specializing 
              in AI & ML while mastering the art of Modern Web Development. My expertise lies 
              in building responsive web applications and integrating intelligent features 
              that enhance user experience. I bridge the gap between creative design 
              and technical implementation.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: Database, title: 'Engineering', desc: 'System Architecture, Scalable Databases, API Design' },
                { icon: Brain, title: 'AI & Data', desc: 'Python, NumPy, Scikit-learn, OpenCV, NLTK' },
                { icon: Eye, title: 'Creative', desc: 'UI/UX Design, Figma, Motion Graphics, Branding' },
                { icon: Code2, title: 'Tools', desc: 'Git, GitHub, Vercel, Firebase, VS Code' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-3"
                >
                  <item.icon className="text-blue-500" size={24} />
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-white/40">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="liquid-glass p-10 rounded-[2rem] border-white/5">
              <h3 className="text-2xl font-bold text-white mb-8">Technical Proficiency</h3>
              <div className="space-y-8">
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-mono tracking-wider">
                      <span className="text-white/60 uppercase">{stat.label}</span>
                      <span className="text-blue-400">{stat.value}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                        className={`h-full ${stat.color} shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 liquid-glass rounded-2xl border-white/5">
                <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                  <Award size={18} /> Certifications
                </h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Python for Data Science Certification
                  </li>
                </ul>
              </div>

              <div className="mt-6 p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 liquid-glass">
                <h4 className="text-blue-400 font-bold mb-2">Key Achievement</h4>
                <p className="text-sm text-blue-300 font-light italic">
                  "Led teams in two hackathons and delivered working AI prototypes within tight deadlines."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
