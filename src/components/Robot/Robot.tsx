import React, {useEffect} from "react";

function getRobotImagePath(name: string): string {
    const key = name.toLowerCase().replace(/\s+/g, "");
    const map: Record<string, string> = {
        red: "/robots/robotred.png",
        blue: "/robots/robotblue.png",
        yellow: "/robots/robotyellow.png",
        // add more robots...
    };
    return map[key] ?? "/robots/robotred.png";
}

function facingToDeg(displayName?: string): number {
    switch ((displayName ?? "").toLowerCase()) {
        case "north": return 180;
        case "east":  return 90;
        case "south": return 0;
        case "west":  return 270;
        default:      return 0;
    }
}



export const Robot = ({ name, x, y, rows, cols, facing }) => {
    const src = getRobotImagePath(name);

    function setRobotCoords(){
        const placeEl = document.getElementById(`cell-${x}-${y}`);
        const robotEl = document.getElementById(`robot-${name.toLowerCase()}`);

        //set robot element top and left to place element top and left
        if (placeEl && robotEl) {
            const placeRect = placeEl.getBoundingClientRect();
            robotEl.style.left = `${placeRect.left + placeRect.width / 2}px`;
            robotEl.style.top = `${placeRect.top + placeRect.height / 2}px`;
            //transform a litlebit to left and up
            robotEl.style.transform = `translate(-53%, -60%) rotate(${facingToDeg(facing)}deg)`;
        }
    }

    useEffect(() => {
        setRobotCoords()
    }, []);

    const cellW = 100 / cols;
    const cellH = 100 / rows;
    const size = Math.min(cellW, cellH) * 0.8; // 80% of cell
    const left = ((x + 0.5) / cols) * 100;
    const top = ((y + 0.5) / rows) * 100;
    const rotation = facingToDeg(facing);

    return (
        <div
            className="absolute z-20"
            id={`robot-${name.toLowerCase()}`}
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}%`,
                height: `${size}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                transformOrigin: "center",
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={name}
                className="w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
                onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/robots/robotred.png";
                }}
            />
        </div>
    );
};

export default Robot;
