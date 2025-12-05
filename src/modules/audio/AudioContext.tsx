"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { audioManager, type SoundType, SOUNDS } from "./AudioManager";

interface AudioContextType {
  playBGM: (key: keyof typeof SOUNDS.bgm) => Promise<void>;
  stopBGM: () => void;
  playSFX: (key: keyof typeof SOUNDS.sfx) => void;
  setVolume: (type: SoundType, value: number) => void;
  toggleMute: () => void;
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [bgmVolume, setBgmVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Sync with manager on mount
    const settings = audioManager.getSettings();
    setBgmVolume(settings.bgmVolume);
    setSfxVolume(settings.sfxVolume);
    setIsMuted(settings.isMuted);
  }, []);

  const playBGM = async (key: keyof typeof SOUNDS.bgm) => {
    await audioManager.playBGM(key);
  };

  const stopBGM = () => {
    audioManager.stopBGM();
  };

  const playSFX = (key: keyof typeof SOUNDS.sfx) => {
    audioManager.playSFX(key);
  };

  const handleSetVolume = (type: SoundType, value: number) => {
    audioManager.setVolume(type, value);
    if (type === "bgm") setBgmVolume(value);
    else setSfxVolume(value);
  };

  const handleToggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  const value = {
    playBGM,
    stopBGM,
    playSFX,
    setVolume: handleSetVolume,
    toggleMute: handleToggleMute,
    bgmVolume,
    sfxVolume,
    isMuted,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
