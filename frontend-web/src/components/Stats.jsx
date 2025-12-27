'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Users, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

const stats = [
  { 
    label: "Active Creators", 
    value: "12.5K+", 
    desc: "Real humans", 
    icon: Users, 
    iconColor: "text-blue-600 dark:text-blue-400", 
    iconBg: "bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-600 dark:group-hover:bg-blue-500",
    shadow: "group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/50",
    barColor: "bg-blue-600 dark:bg-blue-500" 
  },
  { 
    label: "Tasks Completed", 
    value: "8.4M", 
    desc: "Interactions", 
    icon: Zap, 
    iconColor: "text-amber-600 dark:text-amber-400", 
    iconBg: "bg-amber-50 dark:bg-amber-900/20 group-hover:bg-amber-500 dark:group-hover:bg-amber-500",
    shadow: "group-hover:shadow-amber-200 dark:group-hover:shadow-amber-900/50",
    barColor: "bg-amber-500 dark:bg-amber-500" 
  },
  { 
    label: "Growth Speed", 
    value: "3X", 
    desc: "Organic boost", 
    icon: TrendingUp, 
    iconColor: "text-emerald-600 dark:text-emerald-400", 
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500",
    shadow: "group-hover:shadow-emerald-200 dark:group-hover:shadow-emerald-900/50",
    barColor: "bg-emerald-600 dark:bg-emerald-500" 
  },
  { 
    label: "Security Score", 
    value: "100%", 
    desc: "Verified", 
    icon: ShieldCheck, 
    iconColor: "text-rose-600 dark:text-rose-400", 
    iconBg: "bg-rose-50 dark:bg-rose-900/20 group-hover:bg-rose-600 dark:group-hover:bg-rose-500",
    shadow: "group-hover:shadow-rose-200 dark:group-hover:shadow-rose-900/50",
    barColor: "bg-rose-600 dark:bg-rose-500" 
  },
];

// Staggered Entrance Optimization
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            type: "spring", // স্প্রিং ব্যবহার করলে বাউন্সি ভাব আসে না, স্মুথ হয়
            stiffness: 100, 
            damping: 20 
        } 
    }
};

export default function Stats() {
  const ref = useRef(null);
  
  // 1. Scroll Hook
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // 2. Physics-based Smoothing (Super Smooth)
  // সরাসরি scrollYProgress ব্যবহার করলে হার্ড লাগে, স্প্রিং দিয়ে সেটা লিকুইড করা হলো
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  // 3. Parallax Transforms derived from Smooth Spring
  const yEven = useTransform(smoothProgress, [0, 1], [0, -40]); // জোড় কার্ড উপরে ভাসবে
  const yOdd = useTransform(smoothProgress, [0, 1], [0, 20]);   // বিজোড় কার্ড নিচে নামবে

  return (
    <section 
        ref={ref}
        className="relative w-full py-32 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-20 text-center max-w-3xl mx-auto"
        >
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                Scale Your Presence with <br/>
                <span className="text-indigo-600 dark:text-indigo-400">Real Data.</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400">
                We process millions of interactions daily to ensure your growth is organic, safe, and consistent.
            </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} // ভিউপোর্টে আসার একটু আগেই লোড হবে
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
             const yVal = index % 2 === 0 ? yEven : yOdd;

             return (
                <motion.div 
                    key={index}
                    variants={cardVariants}
                    style={{ y: yVal }} 
                    // 🔥 Will-Change: ব্রাউজারকে বলে দিচ্ছি এটা নড়বে (Performance Boost)
                    className={`will-change-transform group relative h-[320px] p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col justify-between overflow-hidden hover:shadow-2xl dark:hover:shadow-none transition-shadow duration-300 ${stat.shadow}`}
                >
                    <div>
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm ${stat.iconBg}`}>
                            <stat.icon size={28} className={`${stat.iconColor} group-hover:text-white transition-colors duration-300`} />
                        </div>
                        
                        {/* Value & Label */}
                        <h3 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tighter tabular-nums">
                            {stat.value}
                        </h3>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{stat.label}</p>
                    </div>
                    
                    {/* 🔥 Optimized Bar Animation (ScaleX instead of Width) */}
                    {/* Width change করলে Layout Repaint হয় (Slow), ScaleX করলে শুধু Composite হয় (Fast) */}
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2 + (index * 0.1), ease: "circOut" }}
                            style={{ originX: 0 }} // বাম দিক থেকে বড় হবে
                            className={`h-full w-full ${stat.barColor}`}
                        ></motion.div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-2">{stat.desc}</p>
                </motion.div>
             )
          })}
        </motion.div>
      </div>
    </section>
  );
}