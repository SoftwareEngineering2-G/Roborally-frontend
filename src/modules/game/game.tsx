"use client";

import {RegistersProgram} from "./RegistersProgram/registers-program";
import {useGetGameQuery} from "@/redux/api/game/gameApi";
import {useEffect} from "react";
import {GameBoard} from "@/components/GameBoard";

interface Props {
    gameId: string;
}

export default function Game({gameId}: Props) {

    const { data, isLoading, error, refetch } = useGetGameQuery({ gameId });

    if (isLoading) return <div className="p-6">Loading…</div>; // TODO make loading component

    console.log(data)

    return (
        <div>
            <div className="absolute w-full">
            <RegistersProgram className="absolute"/>
            </div>
            <GameBoard gameBoard={data.game.gameBoard} className=" absolute top-14"/>
        </div>
    );
}
