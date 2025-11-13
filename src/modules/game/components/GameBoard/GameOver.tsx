"use client";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { resetGameState } from "@/redux/game/gameSlice";
import confetti from "canvas-confetti";

const GameOverModal = () => {
  const dispatch = useDispatch();
  const { isGameOver, winner } = useSelector((state: RootState) => state.game);

  // Prevent confetti from firing multiple times
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (isGameOver && !hasFiredRef.current) {
      hasFiredRef.current = true;

      // Burst confetti
      confetti({
        particleCount: 180,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Extra burst for effect
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.5 },
        });
      }, 400);
    }
  }, [isGameOver]);

  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl text-center animate-scaleIn">
        <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg">
          Game Over
        </h1>

        <p className="text-white mt-6 text-xl">
          🏆 Winner:
          <span className="font-bold text-cyan-300 ml-2 animate-glow">
            {winner}
          </span>
        </p>

        <button
          onClick={() => {
            dispatch(resetGameState())
          }}
          className="mt-8 bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg transition shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;