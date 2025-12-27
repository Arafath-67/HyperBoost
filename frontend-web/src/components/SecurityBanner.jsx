'use client';
import { useRef, useState } from 'react';

export default function SpotlightGrid() {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="absolute inset-0 z-0 overflow-hidden bg-black"
    >
      {/* ১. স্পটলাইট গ্রিড (শুধু মাউসের নিচে দেখা যাবে) */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
            opacity,
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)', 
            backgroundSize: '50px 50px',
            // এই মাস্কিং এর কারণে শুধু মাউসের আশেপাশেই গ্রিড দেখা যাবে
            maskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent)`,
        }}
      />
    </div>
  );
}