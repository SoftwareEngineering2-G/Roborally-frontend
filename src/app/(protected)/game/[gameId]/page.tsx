import Game from "@/modules/game/game";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { gameId } = await params;
  const { hostUser } = await searchParams;

  const isHost = hostUser === "true";

  return <Game gameId={gameId} isHost={isHost} />;
}
