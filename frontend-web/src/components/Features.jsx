'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Cpu, Shield, Globe, Zap, BarChart, Rocket } from 'lucide-react';

const features = [
  {
    title: "AI Power Engine",
    desc: "Our proprietary AI analyzes viral trends 24/7 to push your content exactly where it needs to go.",
    icon: Cpu,
    color: "text-blue-600 dark:text-blue-400",
    glowColor: "#3b82f6" // Blue Glow
  },
  {
    title: "Ironclad Security",
    desc: "Zero bots. Zero fake accounts. We use military-grade encryption to protect your channel integrity.",
    icon: Shield,
    color: "text-purple-600 dark:text-purple-400",
    glowColor: "#a855f7" // Purple Glow
  },
  {
    title: "Global Reach",
    desc: "Break local barriers. Get discovered by audiences across 150+ countries instantly.",
    icon: Globe,
    color: "text-orange-600 dark:text-orange-400",
    glowColor: "#f97316" // Orange Glow
  },
  {
    title: "Instant Analytics",
    desc: "Watch your growth in real-time. Our dashboard updates every second with live loop data.",
    icon: BarChart,
    color: "text-green-600 dark:text-green-400",
    glowColor: "#22c55e" // Green Glow
  },
  {
    title: "Smart Automation",
    desc: "Set it and forget it. Our loop logic works while you sleep to keep engagement high.",
    icon: Zap,
    color: "text-yellow-600 dark:text-yellow-400",
    glowColor: "#eab308" // Yellow Glow
  },
  {
    title: "Viral Boost",
    desc: "Get the initial push your content needs to trigger the algorithm and go viral.",
    icon: Rocket,
    color: "text-red-600 dark:text-red-400",
    glowColor: "#ef4444" // Red Glow
  }
];

// --- GLOWING BORDER CARD COMPONENT ---
function FeatureCard({ feature }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div 
            className="group relative rounded-[2rem] bg-slate-200 dark:bg-slate-800 p-[1px] transition-colors duration-300"
            onMouseMove={handleMouseMove}
        >
            {/* 🔥 GLOWING BORDER LAYER (Behind the card) */}
            <motion.div
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            250px circle at ${mouseX}px ${mouseY}px,
                            ${feature.glowColor},
                            transparent 80%
                        )
                    `
                }}
            />

            {/* Extra Blur Layer for "Neon" Effect */}
            <motion.div
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-50 transition duration-300 blur-lg"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            150px circle at ${mouseX}px ${mouseY}px,
                            ${feature.glowColor},
                            transparent 80%
                        )
                    `
                }}
            />

            {/* Content Card (Sitting on top of the glow) */}
            <div className="relative h-full bg-white dark:bg-[#0F172A] rounded-[2rem] px-8 py-10 overflow-hidden z-10">
                
                {/* Subtle Inner Spotlight */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-20"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                400px circle at ${mouseX}px ${mouseY}px,
                                ${feature.glowColor},
                                transparent 80%
                            )
                        `
                    }}
                />

                <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                        <feature.icon size={28} className={feature.color} />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        {feature.desc}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Features() {
  const ref = useRef(null);
  
  // Parallax Logic
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const yCol1 = useTransform(smoothProgress, [0, 1], [0, -60]);
  const yCol2 = useTransform(smoothProgress, [0, 1], [0, 40]);
  const yCol3 = useTransform(smoothProgress, [0, 1], [0, -60]);

  return (
    <section 
        ref={ref}
        className="relative w-full py-32 bg-slate-50 dark:bg-[#0B1120] transition-colors duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-60"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24 max-w-3xl mx-auto"
        >
            <span className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase border border-indigo-100 dark:border-indigo-500/20">
                System Capabilities
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mt-6 mb-6 tracking-tight">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-indigo-400 dark:to-cyan-400">HyperBoost?</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400">
                We don't just provide views. We provide a tactical advantage in the digital battlefield.
            </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <motion.div style={{ y: yCol1 }} className="flex flex-col gap-8 will-change-transform">
                <FeatureCard feature={features[0]} />
                <FeatureCard feature={features[3]} />
            </motion.div>

            <motion.div style={{ y: yCol2 }} className="flex flex-col gap-8 will-change-transform pt-0 lg:pt-12">
                <FeatureCard feature={features[1]} />
                <FeatureCard feature={features[4]} />
            </motion.div>

            <motion.div style={{ y: yCol3 }} className="flex flex-col gap-8 will-change-transform">
                <FeatureCard feature={features[2]} />
                <FeatureCard feature={features[5]} />
            </motion.div>

        </div>
      </div>
    </section>
  );
}