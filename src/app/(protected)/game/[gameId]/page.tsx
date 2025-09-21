import { Lobby } from "@/modules/lobby/lobby";
import { LobbySignalRProvider } from "@/lib/signalr/roborally-config";

export default async function Page({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;

  return (
    <LobbySignalRProvider>
      <Lobby gameId={gameId} />
    </LobbySignalRProvider>
  );
}
