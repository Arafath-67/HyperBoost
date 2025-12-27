'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// React Bits Style Scroll Float Logic
export default function ScrollFloat({ 
  text, 
  className = "", 
  splitBy = "chars", // 'chars' or 'words'
  stagger = 0.05 
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 50%"] // স্ক্রিন এর ৯০% এ আসলে শুরু হবে
  });

  const content = splitBy === "chars" ? text.split("") : text.split(" ");

  return (
    <h2 
      ref={containerRef} 
      className={`flex flex-wrap justify-center overflow-hidden ${className}`}
    >
      {content.map((item, i) => (
        <CharItem 
          key={i} 
          char={item} 
          index={i} 
          progress={scrollYProgress} 
          splitBy={splitBy} 
        />
      ))}
    </h2>
  );
}

const CharItem = ({ char, index, progress, splitBy }) => {
  // ১. এলোমেলো পজিশন থেকে আসবে (Random Rotation & Y)
  // স্ক্রল ০% থাকলে এটা ৫০% নিচে এবং ৪০ ডিগ্রি ঘুরে থাকবে
  // স্ক্রল ১০০% হলে এটা ০ পজিশন এবং ০ ডিগ্রি রোটেশনে আসবে (সোজা হবে)
  
  const y = useTransform(progress, [0, 1], [100 * (index % 2 === 0 ? 1 : -0.5), 0]); // কিছু নিচ থেকে, কিছু উপর থেকে আসবে
  const rotate = useTransform(progress, [0, 1], [45 * (index % 2 === 0 ? 1 : -1), 0]); // বাঁকা হয়ে আসবে
  const opacity = useTransform(progress, [0, 0.8], [0, 1]); // ফেড ইন হবে
  const scale = useTransform(progress, [0, 1], [0.5, 1]); // ছোট থেকে বড় হবে

  return (
    <motion.span
      style={{ y, rotate, opacity, scale }}
      className={`inline-block ${splitBy === 'words' ? 'mr-2' : ''}`}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};