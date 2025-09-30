"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStartCardDealingForAllMutation } from "@/redux/api/game/gameApi";
import { useState } from "react";

interface GameHostControlsProps {
  gameId: string;
}

export const GameHostControls = ({ gameId }: GameHostControlsProps) => {
  const [startCardDealing, { isLoading }] = useStartCardDealingForAllMutation();
  const [username] = useState("host"); // TODO: Get from auth context later

  const handleStartCardDealing = async () => {
    try {
      await startCardDealing({ gameId, username }).unwrap();
      // TODO: Add success toast notification
    } catch (error) {
      // TODO: Add error toast notification
      console.error("Failed to start card dealing:", error);
    }
  };

  return (
    <Card className="mb-4 bg-orange-50 border-orange-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-orange-800">
          Host Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-orange-700">
            Game Status: Ready for card dealing
          </p>
          <Button
            onClick={handleStartCardDealing}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? "Starting..." : "Start Card Dealing for All Players"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
