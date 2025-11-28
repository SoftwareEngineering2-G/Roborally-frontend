export type SoundType = "bgm" | "sfx";

export const SOUNDS = {
  bgm: {
    lobby: "/audio/bgm/lobby.mp3",
    game: "/audio/bgm/game.mp3",
  },
  sfx: {
    click: "/audio/sfx/click.wav",
    move: "/audio/sfx/move.wav",
    laser: "/audio/sfx/laser.wav",
    damage: "/audio/sfx/damage.wav",
    collision: "/audio/sfx/collision.wav",
    success: "/audio/sfx/success.wav",
    error: "/audio/sfx/error.wav",
    lock_in: "/audio/sfx/lock_in.wav",
  },
};

export class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxVolume: number = 0.5;
  private bgmVolume: number = 0.3;
  private isMuted: boolean = false;
  private currentBgmKey: keyof typeof SOUNDS.bgm | null = null;

  constructor() {
    // Initialize with saved settings if available (client-side only)
    if (typeof window !== "undefined") {
      const savedSfxVol = localStorage.getItem("sfxVolume");
      const savedBgmVol = localStorage.getItem("bgmVolume");
      const savedMute = localStorage.getItem("isMuted");

      if (savedSfxVol) this.sfxVolume = parseFloat(savedSfxVol);
      if (savedBgmVol) this.bgmVolume = parseFloat(savedBgmVol);
      if (savedMute) this.isMuted = savedMute === "true";
    }
  }

  playBGM(key: keyof typeof SOUNDS.bgm) {
    if (this.currentBgmKey === key && this.bgmAudio && !this.bgmAudio.paused) return;

    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio = null;
    }

    this.currentBgmKey = key;
    this.bgmAudio = new Audio(SOUNDS.bgm[key]);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
    
    this.bgmAudio.play().catch((e) => {
      console.warn("Autoplay blocked or audio error:", e);
    });
  }

  playSFX(key: keyof typeof SOUNDS.sfx) {
    const audio = new Audio(SOUNDS.sfx[key]);
    audio.volume = this.isMuted ? 0 : this.sfxVolume;
    audio.play().catch((e) => {
      console.warn("SFX play error:", e);
    });
  }

  setVolume(type: SoundType, value: number) {
    if (type === "bgm") {
      this.bgmVolume = value;
      if (this.bgmAudio && !this.isMuted) {
        this.bgmAudio.volume = value;
      }
      if (typeof window !== "undefined") localStorage.setItem("bgmVolume", value.toString());
    } else {
      this.sfxVolume = value;
      if (typeof window !== "undefined") localStorage.setItem("sfxVolume", value.toString());
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
    }
    if (typeof window !== "undefined") localStorage.setItem("isMuted", this.isMuted.toString());
    return this.isMuted;
  }

  getSettings() {
    return {
      bgmVolume: this.bgmVolume,
      sfxVolume: this.sfxVolume,
      isMuted: this.isMuted,
    };
  }
}

export const audioManager = new AudioManager();
