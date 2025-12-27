'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ArrowRight, Rocket, Download, Shield, Activity, Youtube, Facebook, Instagram, Smartphone } from 'lucide-react';

// --- CUSTOM TIKTOK ICON ---
const TikTokIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
);

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, className, onClick }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });
    const { x, y } = position;
    return (
        <motion.button
            ref={ref}
            className={className}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
};

// --- NUMBER COUNTER ---
const Counter = ({ from, to, duration }) => {
    const [count, setCount] = useState(from);
    useEffect(() => {
        let startTime;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * (to - from) + from));
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }, [from, to, duration]);
    return <span>{count.toLocaleString()}</span>;
};

// --- PLATFORM DATA ---
const PLATFORMS = [
    { id: 'youtube', name: 'YouTube', label: 'Subscribers', icon: Youtube, color: '#ef4444', bg: 'bg-red-500/20', border: 'border-red-500/30', countStart: 1200, countEnd: 15420 },
    { id: 'facebook', name: 'Facebook', label: 'Followers', icon: Facebook, color: '#3b82f6', bg: 'bg-blue-500/20', border: 'border-blue-500/30', countStart: 800, countEnd: 28100 },
    { id: 'instagram', name: 'Instagram', label: 'Followers', icon: Instagram, color: '#d946ef', bg: 'bg-fuchsia-500/20', border: 'border-fuchsia-500/30', countStart: 2100, countEnd: 45600 },
    { id: 'tiktok', name: 'TikTok', label: 'Followers', icon: TikTokIcon, color: '#2dd4bf', bg: 'bg-teal-500/20', border: 'border-teal-500/30', countStart: 500, countEnd: 89000 },
];

// --- MOBILE SCREEN ANIMATION ---
const MobileScreenAnimation = () => {
    // Stages: 'home' -> 'move_cursor' -> 'press' -> 'launching' -> 'splash' -> 'dashboard'
    const [stage, setStage] = useState('home');
    const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);

    // Precise Timing Control for Animation
    useEffect(() => {
        let timeout;
        if (stage === 'home') timeout = setTimeout(() => setStage('move_cursor'), 1500); // 1.5s wait
        else if (stage === 'move_cursor') timeout = setTimeout(() => setStage('press'), 800); // 0.8s for cursor to move
        else if (stage === 'press') timeout = setTimeout(() => setStage('launching'), 400); // 0.4s press hold
        else if (stage === 'launching') timeout = setTimeout(() => setStage('splash'), 600); // Transition to splash
        else if (stage === 'splash') timeout = setTimeout(() => setStage('dashboard'), 2000); // Splash screen duration
        else if (stage === 'dashboard') {
            const totalDuration = PLATFORMS.length * 2500; 
            timeout = setTimeout(() => {
                setStage('home');
                setCurrentPlatformIndex(0);
            }, totalDuration);
        }
        return () => clearTimeout(timeout);
    }, [stage]);

    // Platform Rotator
    useEffect(() => {
        if (stage !== 'dashboard') return;
        const interval = setInterval(() => {
            setCurrentPlatformIndex((prev) => (prev + 1) % PLATFORMS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [stage]);

    const currentPlatform = PLATFORMS[currentPlatformIndex];

    return (
        <div className="relative w-full h-full bg-[#050505] overflow-hidden flex flex-col items-center justify-center font-sans select-none">
             
             {/* Nebula Background */}
             <div className="absolute inset-0 z-0">
                <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 bg-[conic-gradient(from_0deg,transparent_0deg,#4f46e5_90deg,transparent_180deg,#ec4899_270deg,transparent_360deg)] blur-[80px]"
                />
             </div>

            <AnimatePresence mode="wait">
                
                {/* --- HOME SCREEN --- */}
                {(stage === 'home' || stage === 'move_cursor' || stage === 'press' || stage === 'launching') && (
                    <motion.div 
                        key="home"
                        exit={{ scale: 3, opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-10 flex flex-col pt-12 px-5"
                    >
                        {/* App Grid */}
                        <div className="grid grid-cols-4 gap-y-6 gap-x-4 mt-8">
                            {[...Array(12)].map((_, i) => {
                                const isTarget = i === 6; 
                                return (
                                    <div key={i} className="flex flex-col items-center gap-1.5">
                                        <div className={`relative w-[58px] h-[58px] rounded-[16px] ${isTarget ? 'bg-gradient-to-br from-indigo-600 to-violet-700 shadow-lg shadow-indigo-500/40' : 'bg-white/5 border border-white/10 backdrop-blur-sm'}`}>
                                            {isTarget && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Rocket size={26} className="text-white" />
                                                    
                                                    {/* Ripple Effect (Only triggers on 'press' or 'launching') */}
                                                    {(stage === 'press' || stage === 'launching') && (
                                                        <motion.div 
                                                            className="absolute inset-0 bg-white/40 rounded-[16px]"
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1.5, opacity: 0 }}
                                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* App Name */}
                                        <div className="h-3 flex items-center justify-center">
                                            {isTarget ? (
                                                <span className="text-[9px] font-medium text-white tracking-tight">HyperBoost</span>
                                            ) : (
                                                <div className="w-8 h-1.5 bg-white/10 rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* --- REFINED FINGER CURSOR ANIMATION --- */}
                        {(stage === 'move_cursor' || stage === 'press' || stage === 'launching') && (
                             <motion.div
                                initial={{ x: 60, y: 120, opacity: 0, scale: 1 }}
                                animate={
                                    stage === 'move_cursor' ? { x: 0, y: 0, opacity: 1, scale: 1 } : // Move to icon
                                    stage === 'press' ? { x: 0, y: 0, opacity: 1, scale: 0.85 } : // Press down (shrink)
                                    { opacity: 0, scale: 2 } // Fade out on launch
                                }
                                transition={{ 
                                    duration: stage === 'move_cursor' ? 0.8 : 0.2, 
                                    ease: "easeInOut" 
                                }}
                                className="absolute top-[38%] left-[62%] z-50 pointer-events-none"
                             >
                                 {/* Finger Visual */}
                                 <div className="w-8 h-8 bg-white/40 rounded-full border-2 border-white/60 shadow-xl backdrop-blur-md relative">
                                    {/* Tap Pulse */}
                                    {stage === 'press' && (
                                        <div className="absolute inset-0 bg-white/60 rounded-full animate-ping"></div>
                                    )}
                                 </div>
                             </motion.div>
                        )}

                        {/* Dock */}
                        <div className="absolute bottom-5 left-4 right-4 h-18 bg-white/5 backdrop-blur-xl rounded-[22px] border border-white/5 flex items-center justify-around px-2 py-3">
                            {[1,2,3,4].map(n => <div key={n} className="w-11 h-11 bg-white/5 rounded-[14px]"></div>)}
                        </div>
                    </motion.div>
                )}

                {/* --- SPLASH SCREEN --- */}
                {stage === 'splash' && (
                    <motion.div 
                        key="splash"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050505]"
                    >
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                            transition={{ type: "spring", duration: 1.5 }}
                            className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[24px] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] mb-6"
                        >
                            <Rocket size={48} className="text-white fill-white/20" />
                        </motion.div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">HyperBoost</h2>
                        <motion.div initial={{ width: 0 }} animate={{ width: 100 }} className="h-1 bg-indigo-500 rounded-full mt-4" />
                    </motion.div>
                )}

                {/* --- DASHBOARD --- */}
                {stage === 'dashboard' && (
                    <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 z-20 flex flex-col p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 mt-2">
                            <div>
                                <h3 className="text-white text-lg font-bold">Live Growth</h3>
                                <p className="text-indigo-300/70 text-[10px] uppercase tracking-wider">Realtime Analytics</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <Activity size={14} className="text-green-400" />
                            </div>
                        </div>

                        {/* CHANGING PLATFORM CARD */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentPlatform.id}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className={`w-full bg-gradient-to-b from-[#111] to-black border ${currentPlatform.border} rounded-[24px] p-5 relative overflow-hidden shadow-2xl`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-[50px] rounded-full pointer-events-none" style={{ backgroundColor: currentPlatform.color }}></div>

                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className={`p-2 rounded-xl ${currentPlatform.bg}`}>
                                        <currentPlatform.icon size={20} style={{ color: currentPlatform.color }} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{currentPlatform.name}</h4>
                                        <p className="text-gray-400 text-[10px]">{currentPlatform.label}</p>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-4xl font-black text-white tracking-tight mb-2">
                                        <Counter from={currentPlatform.countStart} to={currentPlatform.countEnd} duration={2} />
                                    </h2>
                                    <div className="h-16 w-full flex items-end gap-1 opacity-80 mt-4">
                                        {[...Array(15)].map((_, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ height: '10%' }}
                                                animate={{ height: `${30 + Math.random() * 70}%` }}
                                                transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
                                                className="flex-1 rounded-t-sm"
                                                style={{ backgroundColor: currentPlatform.color, opacity: 0.3 + (i/20) }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* --- NEW: MOBILE USER TEXT (Footer) --- */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-8 left-0 w-full flex justify-center"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
                                <Smartphone size={12} className="text-indigo-400" />
                                <p className="text-[10px] text-gray-300 font-medium tracking-wide">Optimized for Mobile Users</p>
                            </div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default function CTA() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const yBg = useTransform(smoothProgress, [0, 1], [0, -100]);
  const yContent = useTransform(smoothProgress, [0, 1], [50, -50]);
  const scaleGlow = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <section ref={containerRef} className="relative min-h-[800px] w-full flex items-center justify-center bg-slate-50 dark:bg-[#020617] overflow-hidden perspective-1000 py-20">
      
      {/* Background & Lighting */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-[150%] -top-[25%] pointer-events-none">
         <div className="w-full h-full bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </motion.div>
      <motion.div style={{ scale: scaleGlow }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ y: yContent }} className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-20">
            
            {/* Left Content (Text) */}
            <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
                <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="mb-8 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl shadow-2xl inline-block">
                    <Shield size={48} className="text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                </motion.div>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 relative">
                    <span className="relative z-10">Ready to <br/> Dominate?</span>
                    <span className="absolute inset-0 text-indigo-500/20 dark:text-indigo-500/30 blur-lg select-none z-0 left-0 md:left-auto" aria-hidden="true">Ready to Dominate?</span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-xl leading-relaxed">
                    Join 12,000+ creators. Download the app and activate the <span className="text-indigo-600 dark:text-indigo-400 font-bold">HyperBoost</span> logic today.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                    <MagneticButton className="group relative px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)] transition-shadow duration-300 w-full sm:w-auto">
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            <Download size={24} /> <span>Download App</span>
                        </div>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></div>
                    </MagneticButton>
                    <MagneticButton className="group px-10 py-5 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-lg rounded-2xl hover:bg-white dark:hover:bg-white/10 backdrop-blur-sm transition-all w-full sm:w-auto">
                        <Link href="/auth/login" className="flex items-center justify-center gap-3 w-full h-full">
                            <LayoutDashboard size={24} /> <span>Web Dashboard</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </MagneticButton>
                </div>
            </div>

            {/* Right Content (Mobile Mockup) */}
            <motion.div 
                className="flex-1 flex justify-center md:justify-end relative"
                initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} viewport={{ once: true }}
            >
                {/* Phone Frame */}
                <motion.div 
                    animate={{ y: [-10, 10, -10], rotateY: [-2, 2, -2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-[300px] h-[600px] sm:w-[320px] sm:h-[640px] bg-slate-950 rounded-[32px] p-[6px] shadow-[0_20px_50px_-20px_rgba(99,102,241,0.4)] border-[3px] border-slate-700 ring-1 ring-slate-500/50 backdrop-blur-md z-20"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40 pointer-events-none rounded-[32px] z-30"></div>
                    <div className="w-full h-full bg-[#050505] rounded-[26px] overflow-hidden relative z-10">
                        
                        {/* --- FIXED: PUNCH HOLE MOVED UP --- */}
                        {/* আগে top-5 ছিল, এখন top-3 করা হয়েছে */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] ring-[1px] ring-black/80 pointer-events-none"></div>
                        
                        {/* ANIMATION COMPONENT */}
                        <MobileScreenAnimation />

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full z-30 pointer-events-none"></div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Decorations */}
            <div className="absolute top-1/2 -left-10 md:left-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-[60px] opacity-40 animate-pulse z-0"></div>
            <div className="absolute bottom-0 -right-10 md:right-10 w-32 h-32 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full blur-[80px] opacity-40 animate-pulse delay-1000 z-0"></div>

        </motion.div>
      </div>
    </section>
  );
}