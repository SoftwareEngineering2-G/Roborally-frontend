"use client";

import {RegistersProgram} from "./RegistersProgram/registers-program";
import {useGetGameQuery} from "@/redux/api/game/gameApi";
import {GameBoard} from "@/components/GameBoard";
import Robot from "@/components/Robot/Robot";

interface Props {
    gameId: string;
}

export default function Game({ gameId }: Props) {
    const { data, isLoading, error } = useGetGameQuery({ gameId });

    if (isLoading) return <div className="p-6">Loading…</div>;
    if (error || !data?.game) return <div className="p-6 text-red-500">Failed to load game</div>;

    const board = data.game.gameBoard;

    const rows = board.space.length;
    const cols = rows > 0 ? board.space[0].length : 0;

    return (
        <div>
            <div className="absolute w-full">
                <RegistersProgram className="absolute" />
            </div>

            <div className="absolute w-full">
                <GameBoard gameBoard={board} className="absolute top-14" />

                {data.game.players.map((p) => (
                    <Robot
                        key={p.username}
                        name={p.robot.displayName}
                        x={p.currentPosition.x}
                        y={p.currentPosition.y}
                        rows={rows}
                        cols={cols}
                        facing={p.currentFacingDirection?.displayName}
                    />
                ))}
            </div>
        </div>
    );
}
