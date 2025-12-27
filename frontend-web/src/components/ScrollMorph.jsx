'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollMorph() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ১. HERO TEXT (শুরুতে থাকবে, স্ক্রল করলে জুম হয়ে গায়েব হবে)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.5]); // লেখা বড় হবে
  const heroBlur = useTransform(scrollYProgress, [0, 0.3], ["0px", "10px"]);

  // ২. STATS TEXT (শুরুতে গায়েব, স্ক্রল করলে জুম হয়ে আসবে)
  const statsOpacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
  const statsScale = useTransform(scrollYProgress, [0.4, 0.8], [0.8, 1]); // ছোট থেকে বড় হবে

  return (
    <section ref={containerRef} className="relative h-[200vh] -mt-[10vh] mb-20 pointer-events-none">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        
        {/* Hero Title Layer */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, filter: `blur(${heroBlur})` }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <h1 className="text-6xl md:text-9xl font-bold text-white text-center font-tech leading-tight tracking-tighter">
            Dominate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              The Algorithm
            </span>
          </h1>
        </motion.div>

        {/* Stats Title Layer */}
        <motion.div 
          style={{ opacity: statsOpacity, scale: statsScale }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <h2 className="text-5xl md:text-8xl font-bold text-white text-center font-tech mb-6 tracking-tight">
            Platform <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Statistics
            </span>
          </h2>
          <p className="text-xl text-gray-400 mt-4 font-light">Live data from the engine</p>
        </motion.div>

      </div>
    </section>
  );
}