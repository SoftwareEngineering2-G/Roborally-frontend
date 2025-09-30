import { Lobby } from "@/modules/lobby/lobby";

export default async function Page({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;

  return <Lobby gameId={gameId} />;
}
