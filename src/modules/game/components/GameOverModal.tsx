"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { clearGameOver, resetGameState } from "@/redux/game/gameSlice";
import Fireworks from "@/components/Fireworks/Fireworks";
import { motion, AnimatePresence } from "framer-motion";

interface GameOverModalProps {
  myUsername: string;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ myUsername }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isGameOver, winner, oldRatings, newRatings } = useSelector(
    (state: RootState) => state.game
  );
  const [animatedRatings, setAnimatedRatings] = useState<Record<string, number>>({});
  const [showChangeAnimation, setShowChangeAnimation] = useState<Record<string, boolean>>({});
  const [animationPhase, setAnimationPhase] = useState<"change" | "counting">("change");

  // Two-phase animation: 1) Show change number jumping, 2) Animate rating change
  useEffect(() => {
    if (!isGameOver || !oldRatings || !newRatings) return;

    // Initialize with old ratings
    setAnimatedRatings(oldRatings);
    setAnimationPhase("change");

    // Phase 1: Show change numbers for 1.5 seconds
    const changeVisibility: Record<string, boolean> = {};
    Object.keys(oldRatings).forEach((username) => {
      changeVisibility[username] = true;
    });
    setShowChangeAnimation(changeVisibility);

    // Phase 2: After 1.5s, start counting animation
    const phaseTimeout = setTimeout(() => {
      setAnimationPhase("counting");

      const duration = 1500; // 1.5 seconds counting animation
      const steps = 45;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const newAnimatedRatings: Record<string, number> = {};
        Object.keys(oldRatings).forEach((username) => {
          const oldRating = oldRatings[username];
          const newRating = newRatings[username];
          const diff = newRating - oldRating;
          newAnimatedRatings[username] = Math.round(oldRating + diff * easeProgress);
        });

        setAnimatedRatings(newAnimatedRatings);

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedRatings(newRatings);
          // Hide change numbers after animation completes
          setShowChangeAnimation({});
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, 1500);

    return () => clearTimeout(phaseTimeout);
  }, [isGameOver, oldRatings, newRatings]);

  const handleReturnHome = () => {
    dispatch(clearGameOver());
    dispatch(resetGameState());
    router.push("/");
  };

  if (!isGameOver || !winner || !oldRatings || !newRatings) return null;

  return (
    <>
      <Fireworks />
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-10 py-8 rounded-3xl shadow-2xl text-center border-2 border-cyan-400/50 max-w-2xl w-full mx-4 relative overflow-hidden"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />

          <div className="relative z-10">
            <motion.h1
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg mb-6"
            >
              GAME OVER
            </motion.h1>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl text-white mb-8"
            >
              <span className="text-yellow-400 text-4xl mr-2">🏆</span>
              Winner:{" "}
              <span className="font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 text-transparent bg-clip-text animate-pulse">
                {winner}
              </span>
            </motion.div>

            {/* Ratings Table */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-cyan-300 mb-4 tracking-wide">
                ⚡ FINAL RATINGS ⚡
              </h2>
              <div className="bg-gray-950/50 rounded-xl overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b-2 border-cyan-500/50">
                      <th className="px-4 py-3 text-left text-cyan-300 font-bold">PLAYER</th>
                      <th className="px-4 py-3 text-right text-cyan-300 font-bold">OLD</th>
                      <th className="px-4 py-3 text-right text-cyan-300 font-bold">NEW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(oldRatings).map((username, index) => {
                      const oldRating = oldRatings[username];
                      const newRating = newRatings[username];
                      const change = newRating - oldRating;
                      const animatedRating = animatedRatings[username] || oldRating;
                      const isCurrentUser = username === myUsername;

                      return (
                        <motion.tr
                          key={username}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className={`border-t border-gray-700/50 ${
                            isCurrentUser
                              ? "bg-cyan-500/20 border-cyan-400/50"
                              : "hover:bg-gray-800/30"
                          }`}
                        >
                          <td className="px-4 py-4 text-left text-white font-bold text-lg">
                            {username}
                            {isCurrentUser && (
                              <span className="ml-2 text-cyan-400 text-sm">(YOU)</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right text-gray-300 font-semibold text-lg">
                            {oldRating}
                          </td>
                          <td className="px-4 py-4 text-right relative">
                            <div className="flex items-center justify-end gap-2">
                              {/* Jumping change indicator */}
                              <AnimatePresence>
                                {showChangeAnimation[username] && change !== 0 && (
                                  <motion.div
                                    initial={{ scale: 0, y: 0 }}
                                    animate={{
                                      scale: [0, 1.5, 1.2, 1.5, 1.2, 1.5],
                                      y: [0, -20, -15, -25, -15, -20],
                                      rotate: [0, 10, -10, 10, -10, 0],
                                    }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className={`absolute -top-2 right-24 font-black text-2xl ${
                                      change > 0 ? "text-green-400" : "text-red-400"
                                    } drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]`}
                                    style={{
                                      filter:
                                        change > 0
                                          ? "drop-shadow(0 0 15px rgba(34, 197, 94, 0.9))"
                                          : "drop-shadow(0 0 15px rgba(239, 68, 68, 0.9))",
                                    }}
                                  >
                                    {change > 0 ? "+" : ""}
                                    {change}
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Animated rating number */}
                              <motion.span
                                key={animatedRating}
                                initial={animationPhase === "counting" ? { scale: 1.2 } : {}}
                                animate={{ scale: 1 }}
                                className={`text-3xl font-black ${
                                  change > 0
                                    ? "text-green-400"
                                    : change < 0
                                    ? "text-red-400"
                                    : "text-cyan-300"
                                }`}
                                style={{
                                  textShadow:
                                    change > 0
                                      ? "0 0 20px rgba(34, 197, 94, 0.8)"
                                      : change < 0
                                      ? "0 0 20px rgba(239, 68, 68, 0.8)"
                                      : "0 0 20px rgba(34, 211, 238, 0.6)",
                                }}
                              >
                                {animatedRating}
                              </motion.span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Return Home Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.8 }}
              type="button"
              onClick={handleReturnHome}
              className="mt-4 px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-black rounded-xl hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 transition-all text-xl shadow-lg shadow-cyan-500/50 border border-cyan-400/50"
            >
              ← RETURN TO HOME
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default GameOverModal;
