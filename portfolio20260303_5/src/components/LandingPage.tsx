import React from 'react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden p-8"
      onClick={onEnter}
    >
      <div className="relative w-full max-w-screen-2xl">
        <div className="flex flex-col items-start gap-0">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-[12vw] leading-[0.8] font-black tracking-tighter text-[#7DD3FC] uppercase select-none"
          >
            STUDIO
          </motion.div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-[12vw] leading-[0.8] font-black tracking-tighter text-[#7DD3FC] uppercase select-none self-end"
          >
            CHACHA
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-12 left-12 right-12 flex items-end justify-between"
      >
        <div className="text-[#7DD3FC]/50 text-xs uppercase tracking-[0.4em] font-bold">
          Visual Storytelling & Content Creation
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[#7DD3FC] text-xs uppercase tracking-[0.4em] font-bold mb-2">
            Click to Enter
          </div>
          <div className="w-24 h-[1px] bg-[#7DD3FC]/30" />
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-12 right-12 text-[#7DD3FC]/20 text-[10px] uppercase tracking-[0.5em] font-mono vertical-rl rotate-180">
        EST. 2024 — SEOUL, KOREA
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#7DD3FC]/5 rounded-full blur-[150px] pointer-events-none" />
    </motion.div>
  );
};
