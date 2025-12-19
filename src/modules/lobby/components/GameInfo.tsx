"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameInfoProps {
  maxPlayers: number;
}

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 10
 */
export const GameInfo = ({ maxPlayers }: GameInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Game Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Game Mode:</span>
            <span>Standard RoboRally</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Players:</span>
            <span>{maxPlayers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Checkpoints:</span>
            <span>2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Board:</span>
            <span>Factory Floor</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};