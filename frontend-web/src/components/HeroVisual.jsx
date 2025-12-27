'use client';
import { motion } from 'framer-motion';
import { Youtube, Facebook, Instagram, Music, TrendingUp, TrendingDown, Zap, BarChart2, ScanLine } from 'lucide-react';

const platforms = [
  { id: 1, name: "YouTube", icon: Youtube, color: "bg-[#FF0000]", darkColor: "bg-[#990000]", before: "0 Subs", after: "10K Subs" },
  { id: 2, name: "Facebook", icon: Facebook, color: "bg-[#1877F2]", darkColor: "bg-[#0c3b79]", before: "No Reach", after: "Viral Reach" },
  { id: 3, name: "Instagram", icon: Instagram, color: "bg-[#E1306C]", darkColor: "bg-[#8a1c41]", before: "Low Eng.", after: "Trending" },
  { id: 4, name: "TikTok", icon: Music, color: "bg-white", text: "text-black", darkColor: "bg-gray-400", before: "0 Views", after: "1M Views" },
];

export default function HeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible" style={{ perspective: '1200px' }}>
      
      <div className="relative flex items-center justify-center transform-3d" style={{ transform: 'rotateX(60deg) rotateZ(-45deg)' }}>
         
         {/* ১. রাস্তা (THE ROAD) */}
         <div className="relative w-[3000px] h-[200px] transform-3d">
            <div className="absolute inset-0 bg-[#050505] border-y border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
               <motion.div 
                  animate={{ x: ["0%", "50%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(6,182,212,0.08)_50%)] bg-[size:250px_100%]"
               />
            </div>
            <div className="absolute top-full left-0 w-full h-[40px] bg-[#0a0a0a] origin-top transform rotate-x-[-90deg] border-b border-white/10"></div>


            {/* ==================================================
                ২. আল্ট্রা মডার্ন গেট (HOLOGRAPHIC CYBER GATE)
               ================================================== */}
            <div 
               className="absolute left-1/2 top-1/2 z-20 pointer-events-none"
               style={{ transform: 'translate(-50%, -50%) rotateX(-90deg) rotateY(90deg)' }} 
            >
               <div className="relative w-[340px] h-[280px] flex justify-center items-end">
                  
                  {/* বাম এনার্জি পিলার (No Solid Block) */}
                  <div className="absolute left-0 bottom-[-40px] w-[4px] h-[320px] bg-cyan-400 shadow-[0_0_20px_cyan] rounded-full">
                     {/* ফ্লোটিং রিং */}
                     <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-6 h-10 border border-cyan-400/50 rounded-full"></div>
                     <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-6 h-10 border border-cyan-400/50 rounded-full"></div>
                  </div>

                  {/* ডান এনার্জি পিলার */}
                  <div className="absolute right-0 bottom-[-40px] w-[4px] h-[320px] bg-cyan-400 shadow-[0_0_20px_cyan] rounded-full">
                     <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-6 h-10 border border-cyan-400/50 rounded-full"></div>
                     <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-6 h-10 border border-cyan-400/50 rounded-full"></div>
                  </div>

                  {/* টপ ফ্লোটিং হেডার (Floating Hologram) */}
                  <div className="absolute top-[20px] left-0 right-0 flex flex-col items-center justify-center">
                     <div className="px-4 py-1 bg-black/60 border border-cyan-500/50 rounded-full backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                        <div className="transform rotate-y-180 flex items-center gap-2">
                           <ScanLine size={14} className="text-cyan-400" />
                           <span className="text-[10px] font-bold text-white tracking-[0.3em] text-shadow-glow">
                              GROWTH SCANNER
                           </span>
                        </div>
                     </div>
                     {/* কানেক্টিং লেজার লাইন */}
                     <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2 opacity-50"></div>
                  </div>

                  {/* লেজার পর্দা (Active Scan Field) */}
                  <div className="absolute top-[60px] bottom-0 left-[10px] right-[10px] bg-[linear-gradient(to_bottom,rgba(6,182,212,0.05),transparent)] border-x border-cyan-500/10 backdrop-blur-[1px]">
                     <motion.div 
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-[2px] bg-white shadow-[0_0_40px_cyan]"
                     />
                  </div>

               </div>
            </div>


            {/* ৩. চলমান কার্ডস (ITEMS) */}
            <div className="absolute inset-0 flex items-center justify-center transform-3d z-10">
               {platforms.map((item, index) => (
                  <ThreeDBlock key={item.id} item={item} delay={index * 2.5} />
               ))}
            </div>

         </div>
      </div>

      <style jsx global>{`
        .transform-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .text-shadow-glow { text-shadow: 0 0 10px rgba(34,211,238,0.8); }
      `}</style>
    </div>
  );
}

// সলিড ৩ডি ব্লক কার্ড
function ThreeDBlock({ item, delay }) {
   const Icon = item.icon;

   return (
      <motion.div
         animate={{ x: [-1500, 1500] }} 
         transition={{ duration: 10, repeat: Infinity, delay: delay, ease: "linear" }}
         className="absolute transform-3d"
      >
         <div className="relative w-60 h-32 transform-3d" style={{ transform: 'translateY(-30px)' }}>
            
            {/* ====== অবস্থা ১: স্ক্যানারের আগে (BEFORE) ====== */}
            {/* টাইম: 55% পর্যন্ত এটা থাকবে (গেট পার হওয়ার ঠিক আগ মুহূর্ত পর্যন্ত) */}
            <motion.div 
               animate={{ opacity: [1, 1, 0, 0] }}
               transition={{ duration: 10, repeat: Infinity, delay: delay, times: [0, 0.55, 0.56, 1] }}
               className="absolute inset-0 transform-3d"
            >
               <div className="absolute inset-0 bg-[#151515] border border-gray-700 rounded-xl flex flex-col items-center justify-center transform translate-z-[15px] shadow-lg">
                  <div className="absolute top-3 left-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{item.name}</div>
                  <div className="flex items-center gap-3 mt-2">
                     <div className="p-2 bg-gray-800 rounded-full grayscale opacity-50"><Icon size={28} className="text-white" /></div>
                     <div>
                        <div className="text-2xl font-bold text-gray-500">{item.before}</div>
                        <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-900/10 px-2 py-0.5 rounded w-fit mt-1">
                           <TrendingDown size={14} /> LOW REACH
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute right-0 top-0 w-[15px] h-full bg-[#111] origin-right transform rotate-y-90 border-r border-gray-700 rounded-r-md"></div>
               <div className="absolute bottom-0 left-0 w-full h-[15px] bg-[#000] origin-bottom transform rotate-x-[-90deg] border-b border-gray-700 rounded-b-md"></div>
            </motion.div>

            {/* ====== অবস্থা ২: স্ক্যানারের পরে (AFTER) ====== */}
            {/* টাইম: 56% থেকে শুরু (গেট থেকে বের হওয়ার পর) */}
            <motion.div 
               animate={{ opacity: [0, 0, 1, 1] }}
               transition={{ duration: 10, repeat: Infinity, delay: delay, times: [0, 0.55, 0.56, 1] }}
               className="absolute inset-0 transform-3d"
            >
               <div className={`absolute inset-0 ${item.color} rounded-xl flex flex-col items-center justify-center transform translate-z-[15px] shadow-[0_0_50px_rgba(255,255,255,0.2)]`}>
                  <div className={`absolute top-3 left-4 text-[10px] font-bold uppercase tracking-widest ${item.text || "text-white/80"}`}>{item.name}</div>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-xl pointer-events-none"></div>
                  <div className="flex items-center gap-3 mt-2 relative z-10">
                     <div className="p-2 bg-black/20 rounded-full border border-white/30 backdrop-blur-sm">
                        <Icon size={28} className={item.text || "text-white"} />
                     </div>
                     <div>
                        <div className={`text-2xl font-black tracking-wide ${item.text || "text-white"}`}>{item.after}</div>
                     </div>
                  </div>
               </div>
               <div className={`absolute right-0 top-0 w-[15px] h-full ${item.darkColor} origin-right transform rotate-y-90 brightness-75 rounded-r-md`}></div>
               <div className={`absolute bottom-0 left-0 w-full h-[15px] ${item.darkColor} origin-bottom transform rotate-x-[-90deg] brightness-50 rounded-b-md`}></div>

               {/* ========================================================
                   🔥 গ্রোথ আইকন (1 SECOND DELAY)
                   গেট পার: 0.55 (5.5s)
                   আইকন পপ: 0.65 (6.5s) -> ঠিক ১ সেকেন্ড পর
                  ======================================================== */}
               <motion.div
                  initial={{ scale: 0, opacity: 0, y: 0 }}
                  animate={{ scale: [0, 0, 1.5, 1.5], opacity: [0, 0, 1, 1], y: [0, 0, -80, -80] }} 
                  transition={{ duration: 10, repeat: Infinity, delay: delay, times: [0, 0.65, 0.68, 1] }} 
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-50 pointer-events-none"
                  style={{ transform: 'rotateX(-45deg)' }} 
               >
                  <TrendingUp size={60} className="text-[#39ff14] drop-shadow-[0_0_30px_rgba(57,255,20,1)] stroke-[3px]" />
                  <span className="text-[#39ff14] font-black text-sm bg-black/80 px-3 py-1 rounded backdrop-blur-md mt-1 border border-[#39ff14]/50 shadow-lg">+500%</span>
               </motion.div>
            </motion.div>
         </div>
      </motion.div>
   )
}