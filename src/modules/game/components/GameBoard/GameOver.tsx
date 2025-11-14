"use client";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {clearGameOver, resetGameState} from "@/redux/game/gameSlice";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface GameOverModalProps {
  myUsername: string;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ myUsername }) => {
  const dispatch = useDispatch();
  const { isGameOver, winner } = useSelector((state: RootState) => state.game);
  const router = useRouter();

  // Are YOU the winner?
  const isWinner =
      !!winner &&
      !!myUsername &&
      winner.toLowerCase() === myUsername.toLowerCase();

  // Prevent confetti from firing multiple times
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (isGameOver && isWinner && !hasFiredRef.current) {
      hasFiredRef.current = true;

      // Burst confetti only if I'm the winner
      confetti({
        particleCount: 180,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.5 },
        });
      }, 400);
    }
  }, [isGameOver, isWinner]);

  if (!isGameOver) return null;

  // Animation config for winner vs loser
  const cardAnimation = isWinner
      ? {
        initial: { opacity: 0, y: 40, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.35, ease: "easeOut" },
      }
      : {
        initial: { opacity: 0, y: 0 },
        animate: { opacity: 1, x: [0, -10, 10, -6, 6, 0] },
        transition: { duration: 0.4, ease: "easeInOut" },
      };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn">
        <motion.div
            {...cardAnimation}
            className={`
          relative p-8 rounded-2xl text-center border-2 shadow-2xl
          bg-gray-900/95
          ${
                isWinner
                    ? "border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.8)]"
                    : "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]"
            }
        `}
        >
          {/* Icon / Badge */}
          <div
              className={`
            mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full shadow-lg
            ${
                  isWinner
                      ? "bg-gradient-to-br from-emerald-400 to-cyan-500"
                      : "bg-gradient-to-br from-red-500 to-purple-600"
              }
          `}
          >
          <span className="text-3xl">
            {isWinner ? "🏆" : "💀"}
          </span>
          </div>

          {/* Title */}
          <h1
              className={`
            text-3xl md:text-4xl font-extrabold drop-shadow-lg tracking-[0.2em] uppercase
            ${
                  isWinner
                      ? "bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 text-transparent bg-clip-text"
                      : "bg-gradient-to-r from-red-300 via-rose-300 to-purple-300 text-transparent bg-clip-text"
              }
          `}
          >
            {isWinner ? "VICTORY" : "GAME OVER"}
          </h1>

          {/* Winner line */}
          <p className="text-white mt-3 text-xl">
            🏆 Winner:
            <span
                className={`
              font-bold ml-2
              ${
                    isWinner
                        ? "text-cyan-300 animate-pulse"
                        : "text-amber-300"
                }
            `}
            >
            {winner ?? "Unknown"}
          </span>
          </p>

          <button
              onClick={() => {
                hasFiredRef.current = false; // allow confetti next game
                dispatch(resetGameState());
                dispatch(clearGameOver());
                router.push("/");
              }}
              className={`
            mt-8 px-6 py-2 rounded-lg transition shadow-md text-sm font-semibold uppercase tracking-wide
            ${
                  isWinner
                      ? "bg-cyan-500 hover:bg-cyan-600 text-gray-900"
                      : "bg-red-500 hover:bg-red-600 text-white"
              }
          `}
          >
            {isWinner ? "Play Again" : "Try Again"}
          </button>
        </motion.div>
      </div>
  );
};

export default GameOverModal;
