import { ClientOnly } from "@/components/ui/client-only";
import Game from "@/modules/game/game";

export default async function Page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;

  return (
    <ClientOnly>
      <Game gameId={gameId} />
    </ClientOnly>
  );
}
