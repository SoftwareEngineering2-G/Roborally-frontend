"use client";

import React, { useState, useEffect } from "react";

interface Firework {
  id: string;
  type: "rocket" | "particle";
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  vx?: number;
  vy?: number;
  color: string;
  life?: number;
}

export default function Fireworks() {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  const launchFirework = () => {
    const id = Date.now() + Math.random();
    const startX = Math.random() * (window.innerWidth - 200) + 100;
    const startY = window.innerHeight;
    const explodeX = Math.random() * (window.innerWidth - 200) + 100;
    const explodeY = Math.random() * 300 + 100;

    // Create rocket
    const rocket: Firework = {
      id: id.toString(),
      type: "rocket",
      x: startX,
      y: startY,
      targetX: explodeX,
      targetY: explodeY,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    };

    setFireworks((prev) => [...prev, rocket]);

    // After 800ms, remove rocket and add explosion
    setTimeout(() => {
      setFireworks((prev) => prev.filter((f) => f.id !== id.toString()));

      // Create explosion particles
      const particles: Firework[] = [];
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 2 + Math.random() * 3;
        particles.push({
          id: `${id}-${i}`,
          type: "particle",
          x: explodeX,
          y: explodeY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: `hsl(${Math.random() * 360}, 100%, ${50 + Math.random() * 30}%)`,
          life: 60,
        });
      }

      setFireworks((prev) => [...prev, ...particles]);
    }, 800);
  };

  useEffect(() => {
    // Launch initial batch of fireworks
    const count = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        launchFirework();
      }, i * 300);
    }

    // Continue launching fireworks periodically
    const interval = setInterval(() => {
      launchFirework();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFireworks((prev) => {
        return prev
          .map((fw) => {
            if (fw.type === "rocket") {
              const dx = fw.targetX! - fw.x;
              const dy = fw.targetY! - fw.y;
              return {
                ...fw,
                x: fw.x + dx * 0.1,
                y: fw.y + dy * 0.1,
              };
            } else if (fw.type === "particle") {
              return {
                ...fw,
                x: fw.x + fw.vx!,
                y: fw.y + fw.vy!,
                vy: fw.vy! + 0.1, // gravity
                life: fw.life! - 1,
              };
            }
            return fw;
          })
          .filter((fw) => {
            if (fw.type === "particle") return fw.life! > 0;
            return true;
          });
      });
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute rounded-full"
          style={{
            left: `${fw.x}px`,
            top: `${fw.y}px`,
            width: fw.type === "rocket" ? "6px" : "4px",
            height: fw.type === "rocket" ? "20px" : "4px",
            backgroundColor: fw.color,
            boxShadow: `0 0 ${fw.type === "rocket" ? "20px" : "10px"} ${fw.color}`,
            opacity: fw.type === "particle" ? fw.life! / 60 : 1,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
