import { Celltype, Direction, GearDirection } from "@/models/gameModels";
import Image from "next/image";
import React from "react";

/**
 * @author Sachin Baral 2025-10-20 10:53:16 +0200 5
 */
export function getSpaceImageURI(
  celltype: Celltype,
  direction: Direction | GearDirection | null
): string {
  if (celltype == "Gear") {
    return `/spaces/Gear_${direction}.png`;
  }

  return `/spaces/${celltype}.png`;
}

// Helper function to get rotation angle based on direction
// Conveyor belts face South by default, so we rotate from that base
/**
 * @author Sachin Baral 2025-10-20 10:53:16 +0200 18
 */
function getRotationForDirection(direction: Direction | GearDirection | null): number {
  if (!direction) return 0;

  const rotationMap: Record<string, number> = {
    South: 0, // Default orientation
    West: 90, // Rotate 90° clockwise
    North: 180, // Rotate 180°
    East: 270, // Rotate 270° clockwise (or -90°)
  };

  return rotationMap[direction] || 0;
}

/**
 * @author Sachin Baral 2025-10-20 10:53:16 +0200 31
 */
export const useSpaceImage = (celltype: Celltype, direction: Direction | GearDirection | null) => {
  const imageUri = getSpaceImageURI(celltype, direction);

  // Check if this is a conveyor belt that needs rotation
  const needsRotation = celltype === "BlueConveyorBelt" || celltype === "GreenConveyorBelt";
  const rotation = needsRotation ? getRotationForDirection(direction) : 0;

  return (
    <Image
      src={imageUri}
      alt={`${celltype} ${direction}`}
      width={64}
      height={64}
      style={needsRotation ? { transform: `rotate(${rotation}deg)` } : undefined}
    />
  );
};
