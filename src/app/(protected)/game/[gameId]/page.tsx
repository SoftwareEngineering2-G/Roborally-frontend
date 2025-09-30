import Game from "@/modules/game/game";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { gameId } = await params;
  const { hostuser } = await searchParams;

  const isHost = hostuser === "true";

  return <Game gameId={gameId} isHost={isHost} />;
}
