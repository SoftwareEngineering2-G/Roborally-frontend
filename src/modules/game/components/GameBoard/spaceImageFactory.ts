import { Celltype, Direction, GearDirection } from "@/models/gameModels";

export function getSpaceImageURI(
  celltype: Celltype,
  direction: Direction | GearDirection | null
): string {
  if (celltype == "Gear") {
    return `/spaces/Gear_${direction}.png`;
  }

  return `/spaces/${celltype}.png`;
}
