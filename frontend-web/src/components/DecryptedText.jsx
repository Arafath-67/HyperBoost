'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export default function DecryptedText({ text, className }) {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let iterations = 0;
    
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }

      iterations += 1 / 2; // এনিমেশনের স্পিড কন্ট্রোল (কমলে স্লো হবে)
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
    </motion.span>
  );
}