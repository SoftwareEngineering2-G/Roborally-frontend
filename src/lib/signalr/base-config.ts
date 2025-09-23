import { SignalRConfig } from "@/types/signalr";

// Base SignalR configuration for RoboRally
const baseSignalRConfig = {
  baseUrl: "http://localhost:5100",
  automaticReconnect: true,
  reconnectDelays: [0, 2000, 10000, 30000],
};

/**
 * Get SignalR configuration for a specific hub
 * @param hubPath - The hub path (e.g., "/game-lobbies", "/game-play")
 * @returns Complete SignalR configuration
 */
export function getConfig(hubPath: string): SignalRConfig {
  return {
    ...baseSignalRConfig,
    hubPath,
  };
}
