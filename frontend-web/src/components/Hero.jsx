'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, PlayCircle, TrendingUp, Activity, Zap, ShieldCheck, Eye, UserPlus } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const canvasRef = useRef(null);
  
  // 3D Tilt Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const rotateX = useSpring(useTransform(mouseY, [0, 800], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1600], [-5, 5]), { stiffness: 100, damping: 30 });

  // 🔥 ANTIGRAVITY PARTICLE SYSTEM
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.size = 2;
      }

      draw() {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.4)'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = (dx / distance) * force * this.density;
        let directionY = (dy / distance) * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX * 5; 
          this.y -= directionY * 5;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    let particleArray = [];
    const init = () => {
      particleArray = [];
      for (let y = 0; y < canvas.height; y += 45) {
        for (let x = 0; x < canvas.width; x += 45) {
          particleArray.push(new Particle(x, y));
        }
      }
    };
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section 
        className="relative w-full min-h-screen flex items-center bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white overflow-hidden pt-32 lg:pt-20 transition-colors duration-300"
        onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />

      {/* 🔥 FIX: Gap Massive Increase (gap-24) to separate text and card safely */}
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        
        {/* --- LEFT CONTENT --- */}
        <div className="max-w-2xl relative z-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-white mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Version 3.0 Live
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6 text-slate-900 dark:text-white"
          >
            Scale Real <br />
            <span className="text-indigo-600 dark:text-indigo-500">Engagement.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg font-medium"
          >
            Authentic growth driven by data. No bots, no scripts, just pure organic reach enhancement.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Link href="/auth/register" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl transition-all hover:bg-slate-800 dark:hover:bg-slate-200 hover:scale-105 active:scale-95 shadow-lg shadow-slate-500/20 dark:shadow-none flex items-center justify-center gap-2">
                Start Free Trial <ArrowRight size={18} />
            </Link>

            <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 hover:border-slate-400 dark:hover:border-white/40">
               <PlayCircle size={18} /> Watch Demo
            </button>
          </motion.div>
        </div>

        {/* --- RIGHT CONTENT (MASSIVE 3D CARD) --- */}
        <div className="relative h-[700px] w-full flex items-center justify-center perspective-1000">
           <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-full max-w-[700px] h-[500px]"
           >
              {/* MAIN CARD */}
              <div className="absolute inset-0 bg-white/60 dark:bg-[#0F172A]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-black/60 p-10 flex flex-col justify-between transform translate-z-[10px] overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                  <div className="flex justify-between items-start z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <Activity size={32} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Impressions</p>
                            <h2 className="text-6xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">2.4M</h2>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-xl border border-emerald-500/20">
                            <TrendingUp size={18} /> +124%
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Updated live</p>
                    </div>
                  </div>

                  {/* Graph */}
                  <div className="relative h-56 mt-6 w-full z-10 flex items-end justify-between gap-3">
                    <svg className="absolute inset-0 w-full h-full z-20 overflow-visible pointer-events-none">
                        <motion.path
                            d="M 10 200 L 80 160 L 150 180 L 220 100 L 290 140 L 360 60 L 430 110 L 500 40 L 570 80 L 640 20"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="drop-shadow-lg"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                        />
                        <motion.g
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2.5, type: "spring" }}
                        >
                            <circle cx="640" cy="20" r="8" className="fill-indigo-600 dark:fill-white" />
                            <circle cx="640" cy="20" r="16" className="fill-indigo-600/30 animate-ping" />
                            <foreignObject x="580" y="-40" width="120" height="50">
                                <div className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg text-center">
                                    Peak 2.4M 🚀
                                </div>
                            </foreignObject>
                        </motion.g>
                    </svg>

                    {[25, 45, 30, 60, 40, 80, 55, 90, 65, 100].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                                className="w-full bg-slate-200 dark:bg-slate-700/30 rounded-t-lg hover:bg-indigo-500 dark:hover:bg-indigo-500/80 transition-colors duration-300"
                            />
                        </div>
                    ))}
                  </div>

                  {/* Footer Stats */}
                  <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-6 flex gap-8 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Latency</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">0.2s</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Encryption</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">AES-256</p>
                        </div>
                    </div>
                  </div>
              </div>

              {/* 🔥 SAFE POSITIONS: All Cards Moved Closer (Inward) to avoid overlap */}
              
              {/* 1. Top Right: New Like */}
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
                className="absolute -right-20 top-12 bg-white/90 dark:bg-[#1E293B]/90 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 flex items-center gap-3 transform translate-z-[50px] backdrop-blur-md"
              >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">👍</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">New Like</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Just now</p>
                  </div>
              </motion.div>

              {/* 2. Bottom Left: New Sub (FIX: Changed from -left-6 to left-0/overlapping) */}
              <motion.div 
                animate={{ y: [0, 15, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                className="absolute -left-2 bottom-32 bg-slate-900/90 dark:bg-black/90 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 transform translate-z-[70px] border border-transparent dark:border-white/20 backdrop-blur-md"
              >
                  <div className="w-10 h-10 rounded-xl bg-slate-700 dark:bg-slate-800 flex items-center justify-center font-bold text-lg">👤</div>
                  <div>
                    <p className="text-sm font-bold">New Sub</p>
                    <p className="text-[10px] text-slate-400">@alex_dev</p>
                  </div>
              </motion.div>

              {/* 3. Top Left: New Follower (FIX: Changed from -left-4 to -left-2) */}
              <motion.div 
                animate={{ y: [0, -12, 0] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
                className="absolute -left-20 top-16 bg-white/90 dark:bg-[#1E293B]/90 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 flex items-center gap-3 transform translate-z-[60px] backdrop-blur-md"
              >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg">
                      <UserPlus size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">New Follow</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">TikTok</p>
                  </div>
              </motion.div>

              {/* 4. Bottom Right: New Viewer */}
              <motion.div 
                animate={{ y: [0, 12, 0] }} 
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} 
                className="absolute -right-0 bottom-24 bg-slate-900/90 dark:bg-black/90 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 transform translate-z-[80px] border border-transparent dark:border-white/20 backdrop-blur-md"
              >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center font-bold text-lg text-emerald-500">
                      <Eye size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">New Viewer</p>
                    <p className="text-[10px] text-slate-400">USA • 2s ago</p>
                  </div>
              </motion.div>

           </motion.div>
        </div>
      </div>
    </section>
  );
}