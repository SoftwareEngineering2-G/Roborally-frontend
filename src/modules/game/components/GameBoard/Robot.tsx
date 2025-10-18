import type { Direction } from "@/models/gameModels";
import { motion } from "framer-motion";
import Image from "next/image";

// Map robot colors to image paths
const robotImageMap: Record<string, string> = {
    red: "/robots/red_robot.webp",
    blue: "/robots/blue_robot.webp",
    green: "/robots/green_robot.webp",
    yellow: "/robots/yellow_robot.webp",
    orange: "/robots/orange_robot.webp",
    white: "/robots/white_robot.webp",
    purple: "/robots/purple_robot.webp",
    pink: "/robots/pink_robot.webp",
    gray: "/robots/gray_robot.webp",
};

// Map direction to rotation degrees (for the directional indicator)
const directionRotationMap: Record<Direction, number> = {
    North: 0,
    East: 90,
    South: 180,
    West: 270,
};

// Map robot color to neon glow color
const robotGlowMap: Record<string, string> = {
    red: "rgba(255, 50, 50, 0.6)",
    blue: "rgba(50, 150, 255, 0.6)",
    green: "rgba(50, 255, 150, 0.6)",
    yellow: "rgba(255, 255, 50, 0.6)",
    orange: "rgba(255, 150, 50, 0.6)",
    white: "rgba(200, 220, 255, 0.6)",
    purple: "rgba(200, 50, 255, 0.6)",
    pink: "rgba(255, 100, 200, 0.6)",
    gray: "rgba(150, 150, 150, 0.6)",
};

interface RobotProps {
    robot: string;
    direction: Direction;
    robotIndex: number;
    nbRobotsAtPosition: number;
}

const Robot: React.FC<RobotProps> = ({ robot, direction, robotIndex, nbRobotsAtPosition }) => {
    const robotImage = robotImageMap[robot.toLowerCase()] || robotImageMap.red;
    const directionRotation = directionRotationMap[direction];
    const glowColor = robotGlowMap[robot.toLowerCase()] || robotGlowMap.red;

    return (
        <motion.div
            className="absolute z-10 inset-0 pointer-events-none"
            initial={{ scale: 0, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: robotIndex * 0.1,
            }}
            style={{
                // Offset multiple robots at same position
                left: nbRobotsAtPosition > 1 ? `${robotIndex * 12}%` : "0",
                top: nbRobotsAtPosition > 1 ? `${robotIndex * 12}%` : "0",
                width: nbRobotsAtPosition > 1 ? "85%" : "100%",
                height: nbRobotsAtPosition > 1 ? "85%" : "100%",
            }}
        >
            {/* Ground shadow - creates depth */}
            <div 
                className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[70%] h-[15%] rounded-full opacity-40 blur-sm"
                style={{
                    background: `radial-gradient(ellipse, ${glowColor}, transparent 70%)`,
                }}
            />

            {/* Base neon glow ring */}
            <div 
                className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[75%] h-[75%] rounded-full opacity-30 blur-md"
                style={{
                    background: `radial-gradient(circle, ${glowColor}, transparent 60%)`,
                }}
            />

            {/* Robot image container - extends beyond cell for natural look */}
            <motion.div 
                className="absolute inset-[-35%] flex items-center justify-center"
                animate={{
                    y: [-9, -11, -9],
                }}
                transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: robotIndex * 0.3,
                }}
            >
                <div className="relative w-full h-full">
                    {/* Robot image with enhanced scaling to fill more space */}
                    <Image
                        src={robotImage}
                        alt={`${robot} robot`}
                        fill
                        sizes="100px"
                        className="object-contain drop-shadow-lg"
                        style={{
                            filter: `drop-shadow(0 4px 8px ${glowColor})`,
                        }}
                    />
                    
                    {/* Directional indicator - glowing arrow at robot's front */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                        style={{
                            top: "30%",
                            rotate: directionRotation,
                        }}
                        animate={{
                            opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Arrow shape using SVG for crisp rendering */}
                        <svg 
                            width="18" 
                            height="18" 
                            viewBox="0 0 16 16" 
                            className="drop-shadow-lg"
                        >
                            <title>Robot direction indicator pointing {direction}</title>
                            <defs>
                                <filter id={`glow-${robot}-${robotIndex}`}>
                                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <path
                                d="M 8 2 L 12 8 L 10 8 L 10 14 L 6 14 L 6 8 L 4 8 Z"
                                fill={glowColor}
                                filter={`url(#glow-${robot}-${robotIndex})`}
                                stroke="white"
                                strokeWidth="0.5"
                            />
                        </svg>
                    </motion.div>

                    {/* Subtle highlight on top for 3D effect */}
                    <div 
                        className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[40%] h-[30%] rounded-full opacity-20 blur-md pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse, white, transparent 60%)",
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Robot;