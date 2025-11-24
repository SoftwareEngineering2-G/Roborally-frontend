"use client";

import { Volume2, VolumeX, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useAudio } from "../AudioContext";

export const AudioControls = () => {
  const { bgmVolume, sfxVolume, isMuted, setVolume, toggleMute } = useAudio();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span className="sr-only">Audio Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Audio Settings</h4>
            <p className="text-sm text-muted-foreground">
              Adjust volume levels for music and sound effects.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mute">Mute All</Label>
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? "Unmute" : "Mute"}
              </Button>
            </div>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bgm">Music Volume</Label>
                  <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                    {Math.round(bgmVolume * 100)}%
                  </span>
                </div>
                <Slider
                  id="bgm"
                  max={1}
                  step={0.01}
                  value={[bgmVolume]}
                  onValueChange={(value) => setVolume("bgm", value[0])}
                  disabled={isMuted}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sfx">Sound Effects</Label>
                  <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                    {Math.round(sfxVolume * 100)}%
                  </span>
                </div>
                <Slider
                  id="sfx"
                  max={1}
                  step={0.01}
                  value={[sfxVolume]}
                  onValueChange={(value) => setVolume("sfx", value[0])}
                  disabled={isMuted}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
