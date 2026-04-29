import { motion } from 'motion/react';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: "Medical Image Anomaly Detection",
    category: "Computer Vision",
    desc: "Developed a system to detect abnormalities in X-ray and MRI images using OpenCV and Python, assisting in early detection.",
    tags: ["Python", "OpenCV", "AI"],
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    title: "Smart Recommendation Ecosystem",
    category: "Full-Stack AI",
    desc: "Built a content recommendation engine with a polished React frontend and high-performance Python backend.",
    tags: ["React", "Python", "TF-IDF"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=600"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="relative min-h-screen py-32 px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block"
            >
              The Work
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white"
            >
              Defining <br />
              <span className="text-white/40">Digital Excellence.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/50 max-w-sm font-light leading-relaxed"
          >
            A collection of projects spanning from high-end creative web experiences to sophisticated AI-driven engineering solutions.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover="hover"
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col liquid-glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <motion.img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  variants={{
                    hover: { scale: 1.08, filter: "blur(3px)", transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                />
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{project.category}</span>
                  <ArrowUpRight size={20} className="text-white/20 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-white/50 font-light mb-8 line-clamp-2">{project.desc}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/60 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 flex justify-center"
        >
          <a 
            href="https://github.com/Dev-ansh-D"
            target="_blank"
            rel="noopener noreferrer"
            className="group btn-primary px-12 py-5 rounded-full"
          >
            <span className="relative z-10 flex items-center gap-3 text-lg">
              Explore All Projects
              <ExternalLink size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
