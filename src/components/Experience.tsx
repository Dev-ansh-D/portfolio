import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Calendar, MapPin } from 'lucide-react';

const experiences = [
  {
    title: "Data Science Intern",
    company: "Ediglobe Online Services Pvt. Ltd.",
    period: "July 2025 - August 2025",
    location: "Online",
    desc: "Completed structured training in Data Science and worked on real-world datasets. Participated in industrial live projects applying machine learning and data analysis concepts.",
    type: "Internship"
  },
  {
    title: "B.Tech in CSE (AI & ML)",
    company: "Shivalik College of Engineering",
    period: "2023 - 2027",
    location: "Dehradun, India",
    desc: "Relevant Coursework: Data Structures, Machine Learning, NLP, DBMS. Maintaining a strong focus on AI/ML research and application.",
    type: "Education"
  },
  {
    title: "Senior Secondary Education",
    company: "Saraswati Vidya Mandir Inter College",
    period: "Completed",
    location: "Uttarakhand",
    desc: "Uttarakhand Board of School Education.",
    type: "Education"
  },
  {
    title: "Secondary Education",
    company: "Saraswati Vidya Mandir Inter College",
    period: "Completed",
    location: "Uttarakhand",
    desc: "Uttarakhand Board of School Education.",
    type: "Education"
  }
];

export default function Experience() {
  return (
    <section id="experience" className="relative min-h-screen py-32 px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:w-1/2"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-12 text-white">
              A Journey of <br />
              <span className="text-blue-500">Creative Engineering.</span>
            </h2>
            <p className="text-xl text-white/60 mb-16 leading-relaxed font-light max-w-xl">
              My dedication to mastering modern web technologies and AI allows me to build high-impact solutions that prioritize both technical excellence and creative design.
            </p>
            
            <div className="space-y-12">
              {experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative pl-12 border-l border-white/10"
                >
                  <div className="absolute left-[-9px] top-0 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      {exp.type}
                    </span>
                    <span className="text-sm text-white/40 font-mono">{exp.period}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-white">{exp.title}</h3>
                  <div className="flex items-center gap-6 text-white/60 mb-4 font-light">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-blue-500" />
                      {exp.company}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500" />
                      {exp.location}
                    </div>
                  </div>
                  <p className="text-white/40 leading-relaxed max-w-lg">{exp.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden liquid-glass border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=1500" 
                alt="Journey"
                className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 p-10 liquid-glass rounded-[2rem] border-white/10 max-w-xs shadow-2xl">
              <p className="text-lg font-bold text-white mb-4">Designed with a human-centered approach.</p>
              <p className="text-sm text-white/40 font-light leading-relaxed">
                We believe that AI should empower people, not replace them.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
