"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { resetGameState } from "@/redux/game/gameSlice";

const GameOverModal = () => {
  const dispatch = useDispatch();
  const { isGameOver, winner } = useSelector((state: RootState) => state.game);

  // If game isn’t over, don’t show anything
  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-cyan-400">Game Over</h1>
        <p className="text-white mt-4 text-lg">
          🏆 Winner: <span className="font-semibold">{winner}</span>
        </p>

        <button
          onClick={() => dispatch(resetGameState())}
          className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;