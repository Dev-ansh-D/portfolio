import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, MapPin, Send, ArrowRight, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'ceb47b40-4c3c-40b8-a9ea-d8c624208b2e';

      const promises: Promise<any>[] = [
        // 1. Save to Firestore (Backup)
        addDoc(collection(db, 'messages'), {
          ...formData,
          createdAt: serverTimestamp()
        })
      ];

      // 2. Send via Web3Forms (Email)
      if (accessKey) {
        promises.push(
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: accessKey,
              name: formData.name,
              email: formData.email,
              message: formData.message,
              from_name: "Portfolio Contact Form",
              subject: `New Message from ${formData.name}`,
            }),
          }).then(async (res) => {
            if (!res.ok) throw new Error('Email service failed');
            return res.json();
          })
        );
      } else {
        console.warn('Web3Forms Access Key missing. Message saved to Firestore only.');
      }

      await Promise.all(promises);

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-32 px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-blue-200 font-bold uppercase tracking-widest text-sm mb-6 block"
            >
              Get In Touch
            </motion.span>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-12">
              Let's bring the <br />
              <span className="text-blue-900">future to everyone.</span>
            </h2>
            <p className="text-xl text-blue-100 mb-16 leading-relaxed font-light max-w-xl">
              I'm always open to discussing new projects, creative ideas, or 
              opportunities to be part of your visions.
            </p>
            
            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Primary Email', value: 'devanshdangwal73@gmail.com' },
                { icon: MapPin, label: 'Location', value: 'Dehradun, India' },
                { icon: Github, label: 'GitHub', value: 'github.com/Dev-ansh-D' },
                { icon: Phone, label: 'Phone', value: '+91 7900619855' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all duration-500">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-white group-hover:text-blue-900 transition-colors">{item.value}</p>
                  </div>
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
            <div className="liquid-glass p-12 rounded-[3rem] shadow-2xl shadow-blue-900/20">
              <h3 className="text-3xl font-bold text-white mb-10">Send a Message</h3>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-200 uppercase tracking-widest">Your Name</label>
                    <input 
                      type="text" 
                      name="user_name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-200 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      name="user_email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-blue-200 uppercase tracking-widest">Message</label>
                  <textarea 
                    rows={4}
                    name="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button 
                  disabled={status === 'sending'}
                  className="w-full group btn-primary py-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    {status === 'sending' ? 'Sending...' : 'Send Message'} 
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </button>

                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20"
                  >
                    <CheckCircle2 size={20} />
                    <span>Message sent successfully!</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20"
                  >
                    <AlertCircle size={20} />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <div className="text-blue-200 text-sm font-mono">
              © 2026 Devansh Dangwal. All rights reserved.
            </div>
            <div className="text-white/40 text-[10px] font-mono tracking-widest uppercase">
              All details are based until 2025.
            </div>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://www.linkedin.com/in/devanshdangwal" target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-widest">
              LinkedIn
            </a>
            <a href="https://github.com/Dev-ansh-D" target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-widest">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
