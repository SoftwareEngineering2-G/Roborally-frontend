import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2 } from "lucide-react";

export default function PublicLobbiesSkeleton() {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          Public Lobbies
        </CardTitle>
        <CardDescription>Join an existing game</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="p-4 border border-neon-teal/20 rounded-lg bg-surface-dark/30"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32 bg-muted/20" />
                <Skeleton className="h-4 w-20 bg-muted/20" />
              </div>
              <Skeleton className="h-9 w-16 bg-muted/20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
