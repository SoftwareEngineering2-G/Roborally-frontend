import { Middleware } from "@reduxjs/toolkit";
import { audioManager } from "@/modules/audio/AudioManager";
import {
  updateRobotPosition,
  playerLockedIn,
  setGameOver,
  updateRevealedCards,
  setCurrentPhase,
} from "@/redux/game/gameSlice";

export const audioMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (updateRobotPosition.match(action)) {
    audioManager.playSFX("move");
  } else if (playerLockedIn.match(action)) {
    audioManager.playSFX("lock_in");
  } else if (setGameOver.match(action)) {
    audioManager.playSFX("success"); // Or determine if current user won
  } else if (updateRevealedCards.match(action)) {
    // Maybe play a card flip sound or laser if it's a laser register?
    // For now, let's use click or a specific card sound
    audioManager.playSFX("click");
  } else if (setCurrentPhase.match(action)) {
    if (action.payload === "ActivationPhase") {
      audioManager.playSFX("lock_in"); // Phase change sound
    }
  }

  return result;
};
