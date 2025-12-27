'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function IntroLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // ২.৫ সেকেন্ড পর লোডার গায়েব হয়ে যাবে
    const timer = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, y: -50 }} // চলে যাওয়ার এনিমেশন
          transition={{ duration: 0.8 }}
        >
          
          {/* রকেট এনিমেশন */}
          <motion.div
            initial={{ y: 500, scale: 0.5, opacity: 0 }}
            animate={{ 
              y: [500, 0, -1000], // নিচ থেকে মাঝে, তারপর একদম উপরে চলে যাবে
              scale: [1, 1.5, 0.5],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2, 
              times: [0, 0.4, 1], // টাইমিং কন্ট্রোল
              ease: "easeInOut" 
            }}
            className="relative flex flex-col items-center"
          >
            {/* রকেটের আগুন (Tail Fire) */}
            <div className="absolute top-16 w-2 h-32 bg-gradient-to-t from-transparent via-cyan-500 to-white blur-md"></div>
            
            {/* রকেট আইকন */}
            <div className="relative z-10 p-4 bg-cyan-500/20 rounded-full border border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.8)] backdrop-blur-xl">
               <Rocket size={64} className="text-white drop-shadow-lg -rotate-45" />
            </div>

            {/* স্পিড লাইনস (Speed Lines) */}
            <motion.div 
               animate={{ y: [0, 100] }} 
               transition={{ repeat: Infinity, duration: 0.5 }}
               className="absolute top-0 w-full h-full opacity-30"
            >
               <div className="absolute left-[-20px] top-10 w-1 h-20 bg-white/20 rounded-full blur-sm"></div>
               <div className="absolute right-[-20px] top-20 w-1 h-16 bg-white/20 rounded-full blur-sm"></div>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}