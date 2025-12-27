'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Server, RefreshCw, BarChart3, ShieldCheck, BrainCircuit, Radio, Database, Wifi, Lock, Fingerprint } from 'lucide-react';

// --- ANIMATED COUNTER (For Mining Card) ---
function AnimatedCounter({ from, to }) {
    const [count, setCount] = useState(from);
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => (prev < to ? prev + 7 : from)); 
        }, 50);
        return () => clearInterval(interval);
    }, [from, to]);
    return <span>{count.toLocaleString()}</span>;
}

const steps = [
  // --- STEP 1: CONNECTION ---
  {
    id: 1,
    title: "System Integration",
    desc: "Connect your channel to our secure neural network. AI instantly analyzes your content signature.",
    icon: Server,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    uiTitle: "Sync Status",
    renderUI: () => (
        <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
                <span>Handshake Protocol...</span>
                <span className="text-blue-500 font-bold">Encrypted</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-full w-[50%] bg-blue-500 rounded-full"
                />
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <Wifi size={12} className="text-blue-500 animate-pulse" /> Channel Linked
            </div>
        </div>
    )
  },

  // --- STEP 2: SECURITY (NEW) ---
  {
    id: 2,
    title: "Security Protocol",
    desc: "Before any action, our 'Anti-Bot' shield verifies session integrity to prevent spam bans.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    uiTitle: "Integrity Check",
    renderUI: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="relative">
                <Fingerprint size={48} className="text-emerald-500/50" />
                <motion.div 
                    initial={{ height: "0%" }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-0 left-0 w-full bg-emerald-500/20 border-b-2 border-emerald-500"
                />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <Lock size={12} className="text-emerald-500" />
                <span className="text-xs font-bold text-emerald-500">Session Verified</span>
            </div>
        </div>
    )
  },

  // --- STEP 3: MINING ---
  {
    id: 3,
    title: "Interaction Mining",
    desc: "Engage to mine 'Credits'. The 1+1 Loop Logic guarantees every interaction is banked.",
    icon: RefreshCw,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    uiTitle: "Live Wallet",
    renderUI: () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Database size={16} className="text-purple-500" />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Credits</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 animate-pulse">
                    Mining...
                </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                +<AnimatedCounter from={2400} to={3000} />
            </div>
        </div>
    )
  },

  // --- STEP 4: CAMPAIGN ---
  {
    id: 4,
    title: "Campaign Launch",
    desc: "Convert mined credits into active campaigns. Watch real users trigger algorithmic spikes.",
    icon: BarChart3,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    uiTitle: "Active Campaign",
    renderUI: () => (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Subs Goal</span>
                <span className="text-orange-500 font-bold text-lg">84%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "84%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                />
            </div>
            <div className="flex justify-between gap-1 mt-1">
                 {[1,2,3,4,5,6,7].map((bar) => (
                    <motion.div 
                        key={bar}
                        animate={{ height: [5, 20, 5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: bar * 0.1 }}
                        className="w-full bg-orange-500/20 rounded-sm h-4"
                    />
                 ))}
            </div>
        </div>
    )
  },

  // --- STEP 5: OPTIMIZATION (NEW) ---
  {
    id: 5,
    title: "AI Optimization",
    desc: "Our engine analyzes performance data to optimize your reach and suggest viral improvements.",
    icon: BrainCircuit,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    uiTitle: "Neural Analysis",
    renderUI: () => (
        <div className="relative h-full w-full flex items-center justify-center">
             {/* Spinning AI Core */}
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-24 h-24 border-2 border-dashed border-pink-500/30 rounded-full"
             />
             <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-16 h-16 border-2 border-pink-500/50 rounded-full"
             />
             <div className="z-10 bg-pink-500/10 p-2 rounded-full backdrop-blur-sm">
                <BrainCircuit size={24} className="text-pink-500" />
             </div>
             <div className="absolute bottom-0 text-[10px] font-mono text-pink-500">
                Optimization: 98%
             </div>
        </div>
    )
  }
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <section ref={containerRef} className="relative py-32 bg-slate-50 dark:bg-[#020617] overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-4 inline-block border border-indigo-100 dark:border-indigo-500/20">
                Workflow
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                Engineered for <span className="text-indigo-600 dark:text-indigo-400">Growth</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
                From security checks to viral optimization—everything is automated.
            </p>
        </div>

        <div className="relative">
            {/* Animated Connecting Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800 -translate-x-1/2 hidden md:block">
                <motion.div 
                    style={{ scaleY, originY: 0 }}
                    className="absolute top-0 left-0 w-full h-full bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1]"
                />
            </div>

            {/* Steps Container */}
            <div className="space-y-24">
                {steps.map((step, index) => (
                    <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: index * 0.1 }}
                        className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
                            index % 2 === 0 ? "md:flex-row-reverse" : ""
                        }`}
                    >
                        
                        {/* 1. Text Content Side */}
                        <div className="flex-1 text-center md:text-left">
                             <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${step.bg} ${step.color} border ${step.border}`}>
                                    <step.icon size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    Phase 0{step.id}
                                </span>
                             </div>
                             
                             <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
                             <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg mb-8">
                                {step.desc}
                             </p>

                             {/* Dynamic Badges based on Step */}
                             <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="px-3 py-1 rounded-md bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                                    {index < 2 ? "Secure" : "Automated"}
                                </span>
                                <span className="px-3 py-1 rounded-md bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                                    Real-time
                                </span>
                             </div>
                        </div>

                        {/* 2. Middle Node */}
                        <div className="relative z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-[#020617] border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        </div>

                        {/* 3. Visual Side (LIVE DASHBOARD CARD) */}
                        <div className="flex-1 w-full">
                            <div className="relative group p-1 rounded-2xl bg-gradient-to-br from-slate-200 to-white dark:from-slate-800 dark:to-slate-900 shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-500">
                                
                                {/* Inner Card */}
                                <div className="relative bg-white dark:bg-[#0F172A] rounded-xl p-6 h-[240px] border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col">
                                    
                                    {/* Card Header */}
                                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                            <Radio size={10} className="text-emerald-500 animate-pulse" /> Live
                                        </div>
                                    </div>

                                    {/* MAIN LIVE UI CONTENT */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                                            {step.uiTitle}
                                        </div>
                                        {step.renderUI()}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}