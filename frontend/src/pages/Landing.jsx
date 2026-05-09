import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle2, BarChart3, Zap } from 'lucide-react';
import heroImage from '../assets/hero.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen transition-colors duration-300 overflow-x-hidden" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-card/95 backdrop-blur-sm border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Shield size={24} fill="currentColor" fillOpacity={0.2} />
            </div>
            <span className="text-2xl font-black tracking-tight">SmartMS</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex items-center space-x-8 text-[15px] font-bold">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <button onClick={() => navigate('/login')} className="hover:text-primary transition-colors">Login</button>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-44 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl lg:text-[85px] font-black leading-[1.05] tracking-tight mb-8"
            >
              Manage Your<br />Organization<br />
              <span className="text-primary">Smarter</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted max-w-xl mb-12 leading-relaxed font-medium"
            >
              The all-in-one platform for role-based access, record tracking, and real-time analytics. Build for modern companies, schools, and hospitals.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start mb-16"
            >
              <button 
                onClick={() => navigate('/register')}
                className="btn-primary h-16 px-10 rounded-xl font-black text-lg flex items-center space-x-3 transition-all w-full sm:w-auto justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight size={22} strokeWidth={3} />
              </button>
              
              <button 
                onClick={() => navigate('/login')}
                className="btn-secondary h-16 px-10 rounded-xl font-black text-lg transition-all w-full sm:w-auto"
              >
                Live Demo
              </button>
            </motion.div>
            
            {/* Checkmarks */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4"
            >
              {[
                "Secure JWT Auth", 
                "Role-based Access", 
                "Analytics Dashboard"
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-2 text-[14px] font-bold text-muted">
                  <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={3} />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-border">
               <img 
                 src={heroImage} 
                 alt="Dashboard Mockup"
                 className="w-full object-cover"
               />
            </div>
          </motion.div>
        </div>
      </main>

      <section id="features" className="py-32" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Everything You Need</h2>
            <p className="text-muted max-w-2xl mx-auto font-medium">
              Our system is designed to streamline operations and provide deep insights into your business metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-12 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4">Role-Based Control</h3>
              <p className="text-muted leading-relaxed font-medium">
                Granular permissions for Admins, Operators, and Users.
              </p>
            </div>

            <div className="bg-background p-12 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4">Real-time Analytics</h3>
              <p className="text-muted leading-relaxed font-medium">
                Interactive charts and reports updated in real-time.
              </p>
            </div>

            <div className="bg-background p-12 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4">Activity Tracking</h3>
              <p className="text-muted leading-relaxed font-medium">
                Monitor every change and action within the system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-muted text-sm font-bold border-t border-border">
        © 2026 Smart Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
