"use client";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Crown, Zap, Cpu, Cog } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 8
 */
const RobotIcon = ({ className }: { className?: string }) => (
  <motion.div
    className={`relative ${className}`}
    animate={{
      rotate: [0, 10, -10, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
    }}
  >
    <div className="w-8 h-8 bg-primary/20 rounded-lg border-2 border-primary/30 flex items-center justify-center">
      <div className="w-3 h-3 bg-primary/60 rounded animate-pulse" />
    </div>
    {/* Robot antenna */}
    <motion.div
      className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-primary/40"
      animate={{ scaleY: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    {/* Robot antenna light */}
    <motion.div
      className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </motion.div>
);

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 39
 */
const CircuitPattern = () => (
  <motion.div
    className="absolute inset-0 opacity-10"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%"],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    <svg
      className="w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="circuit"
          patternUnits="userSpaceOnUse"
          width="20"
          height="20"
        >
          <path
            d="M0 10h5v-5h5v10h5v-5h5v10"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  </motion.div>
);

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 76
 */
const GlitchSkeleton = ({ className }: { className?: string }) => {
  return (
    <motion.div
      className={className}
      animate={{
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Skeleton className="w-full h-full bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
};

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 106
 */
const LoadingOrb = () => (
  <motion.div
    className="relative w-12 h-12 mx-auto mb-4"
    animate={{ rotate: 360 }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
  >
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-sm" />
    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
    <motion.div
      className="absolute inset-4 rounded-full bg-background"
      animate={{
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <Cpu className="absolute inset-0 m-auto w-4 h-4 text-primary" />
  </motion.div>
);

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 129
 */
const FloatingIcons = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[Zap, Cog, Crown, Users].map((Icon, index) => (
      <motion.div
        key={index}
        className="absolute text-primary/20"
        initial={{
          x: Math.random() * 100 + "%",
          y: Math.random() * 100 + "%",
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4 + index,
          repeat: Infinity,
          delay: index * 0.5,
        }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
    ))}
  </div>
);

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 156
 */
export const LobbyLoadingSkeleton = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-lg animate-pulse" />
          <h2 className="text-2xl font-bold text-primary mb-2">Loading...</h2>
          <p className="text-muted-foreground">Preparing robot arena</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingIcons />
      <CircuitPattern />

      {/* Header Skeleton */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GlitchSkeleton className="relative w-24 h-8" />
            <GlitchSkeleton className="relative w-48 h-8" />
            <GlitchSkeleton className="relative w-20 h-6" />
          </div>
          <GlitchSkeleton className="relative w-16 h-6" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Players List Skeleton */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary/50" />
                    <GlitchSkeleton className="relative w-32 h-6" />
                  </div>
                  <GlitchSkeleton className="relative w-48 h-4 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Player Cards Skeleton */}
                    {Array.from({ length: 4 }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg border bg-muted/30 relative overflow-hidden"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <RobotIcon />
                            {index === 0 && (
                              <Crown className="absolute -top-2 -right-2 w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <GlitchSkeleton className="relative w-24 h-5 mb-2" />
                            <GlitchSkeleton className="relative w-16 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 relative"
                      >
                        <div className="flex items-center justify-center h-16 text-muted-foreground">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Users className="w-6 h-6 mr-2" />
                          </motion.div>
                          Scanning for robots...
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Game Controls Skeleton */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <GlitchSkeleton className="relative w-32 h-6 mb-2" />
                  <GlitchSkeleton className="relative w-24 h-4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <GlitchSkeleton className="relative w-full h-10" />
                  <GlitchSkeleton className="relative w-full h-4" />

                  <div className="pt-4 border-t">
                    <GlitchSkeleton className="relative w-20 h-4 mb-2" />
                    <div className="flex items-center space-x-2">
                      <GlitchSkeleton className="relative flex-1 h-8" />
                      <GlitchSkeleton className="relative w-10 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Game Info Skeleton */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <GlitchSkeleton className="relative w-24 h-5" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex justify-between">
                      <GlitchSkeleton className="relative w-20 h-4" />
                      <GlitchSkeleton className="relative w-16 h-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Central Loading Message */}
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center p-8 rounded-lg bg-card border relative overflow-hidden"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingOrb />
            <motion.h2
              className="text-2xl font-bold text-primary mb-2"
              animate={{
                textShadow: [
                  "0 0 5px transparent",
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                  "0 0 5px transparent",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Initializing Robot Arena...
            </motion.h2>
            <motion.p
              className="text-muted-foreground"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Calibrating systems and loading lobby data
            </motion.p>

            {/* Loading dots */}
            <div className="flex justify-center space-x-1 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

/**
 * @author Sachin Baral 2025-09-20 20:56:36 +0200 372
 */
export const LobbyErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-card border max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-6 bg-destructive/20 rounded-lg border-2 border-destructive/30" />
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{message}</p>
          {onRetry && (
            <button
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              onClick={onRetry}
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingIcons />
      <CircuitPattern />

      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="text-center p-8 rounded-lg bg-card border relative overflow-hidden max-w-md mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error Robot Icon */}
          <motion.div
            className="relative w-16 h-16 mx-auto mb-6"
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 bg-destructive/20 rounded-lg border-2 border-destructive/30 flex items-center justify-center">
              <motion.div
                className="w-8 h-8 bg-destructive/60 rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </div>
            {/* Broken antenna */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-destructive/40" />
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
              animate={{
                rotate: [0, 45, -45, 0],
                x: [0, 2, -2, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
            >
              <Zap className="w-3 h-3 text-destructive" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-destructive mb-4"
            animate={{
              textShadow: [
                "0 0 5px transparent",
                "0 0 10px rgba(239, 68, 68, 0.5)",
                "0 0 5px transparent",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Access Denied!
          </motion.h2>

          <p className="text-muted-foreground mb-6">{message}</p>

          {onRetry && (
            <motion.button
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              onClick={onRetry}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Retry Connection
              </motion.span>
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};