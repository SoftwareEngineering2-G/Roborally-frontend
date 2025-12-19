import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, RefreshCw } from "lucide-react";

interface PublicLobbiesErrorProps {
  onRetry: () => void;
  title?: string;
  description?: string;
}

/**
 * @author Truong Son NGO 2025-09-21 21:26:17 +0200 17
 */
export default function PublicLobbiesError({
  onRetry,
  title = "Public Lobbies",
  description = "Join an existing game",
}: PublicLobbiesErrorProps) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-xl text-neon-teal flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Failed to load lobbies</p>
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}