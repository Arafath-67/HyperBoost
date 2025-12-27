'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🔥 Eye যোগ করা হয়েছে
import { ShieldAlert, Hand, Scale, CheckCircle, Eye } from 'lucide-react';

export default function FairPlayModal() {
  const [isOpen, setIsOpen] = useState(true); // পেজে ঢুকলেই ওপেন হবে

  // ইউজার একবার Agree করলে সেশনে আর দেখাবে না
  const handleAgree = () => {
    setIsOpen(false);
    // sessionStorage.setItem('fairPlayAgreed', 'true'); (ভবিষ্যতে অ্যাড করব)
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-lg bg-[#0a0a0a] border border-red-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]"
        >
          
          {/* Header */}
          <div className="bg-red-900/20 p-6 border-b border-red-500/20 flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={28} />
            <div>
              <h2 className="text-xl font-bold text-white">Security Protocol Check</h2>
              <p className="text-xs text-red-400">Read carefully before proceeding</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            
            <div className="flex gap-4">
              <div className="shrink-0 p-2 bg-white/5 rounded-lg h-fit"><Scale size={24} className="text-cyan-400" /></div>
              <div>
                <h3 className="text-white font-bold text-sm">The Law of Exchange</h3>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  This is a community. If you fake your tasks, other users will fake theirs on your channel. 
                  <span className="text-white font-bold"> Do not expect real growth if you give fake engagement.</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 p-2 bg-white/5 rounded-lg h-fit"><Eye size={24} className="text-yellow-400" /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Everything is Recorded</h3>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Our AI analyzes your scroll speed, click patterns, and verification time. 
                  Scam attempts are flagged instantly and manual review will lead to a <span className="text-red-400 font-bold">Permanent Device Ban</span>.
                </p>
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-white/10 bg-white/5 flex flex-col gap-3">
            <button 
              onClick={handleAgree}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
            >
              <Hand size={18} /> I Promise to be Honest
            </button>
            <p className="text-center text-[10px] text-gray-500">
              By clicking above, you agree to our Anti-Fraud Policy.
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}