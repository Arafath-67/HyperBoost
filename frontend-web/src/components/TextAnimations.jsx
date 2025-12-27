'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// ১. হিরো টাইটেল ১: Blur Reveal (Social Growth)
export const BlurReveal = ({ text }) => {
  const characters = text.split("");
  return (
    <div className="flex overflow-hidden">
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: "circOut" }}
          className="inline-block font-tech text-white"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

// ২. হিরো টাইটেল ২: True Focus / Letter Pull (Reimagined)
export const LetterPull = ({ text }) => {
    return (
        <motion.div
            initial={{ letterSpacing: "-0.2em", opacity: 0 }}
            animate={{ letterSpacing: "0em", opacity: 1 }}
            transition={{ duration: 1.5, ease: "anticipate", delay: 0.5 }}
            className="font-tech text-white font-bold"
        >
            {text}
        </motion.div>
    )
}

// ৩. স্ট্যাটস টাইটেল: Scroll Float (React Bits Style)
export const ScrollFloat = ({ text }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const characters = text.split("");

  return (
    <div ref={containerRef} className="flex justify-center overflow-hidden">
      {characters.map((char, i) => {
        // স্ক্রল করার সাথে সাথে অক্ষরগুলো দূরে থেকে কাছে আসবে
        const y = useTransform(scrollYProgress, [0, 0.5], [100 + (i * 20), 0]);
        const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
        const rotate = useTransform(scrollYProgress, [0, 0.5], [45 - (i * 5), 0]);

        return (
          <motion.span
            key={i}
            style={{ y, opacity, rotate }}
            className="inline-block font-tech text-white font-bold"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </div>
  );
};