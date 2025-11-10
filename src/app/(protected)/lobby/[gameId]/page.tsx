import { ClientOnly } from "@/components/ui/client-only";
import { Lobby } from "@/modules/lobby/lobby";

export default async function Page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;

  return (
    <ClientOnly>
      <Lobby gameId={gameId} />
    </ClientOnly>
  );
}
