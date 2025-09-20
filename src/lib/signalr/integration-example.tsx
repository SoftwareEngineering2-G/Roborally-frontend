// This is an example of how to integrate SignalR into your app
// You would typically add this to your main layout or providers file

import { SignalRProvider } from "@/lib/signalr/SignalRProvider";
import { SignalRConfig } from "@/types/signalr";

// Configuration matching your backend
const signalRConfig: SignalRConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5100",
  hubPath: "/game-lobbies", // Matching your backend hub endpoint
  automaticReconnect: true,
  reconnectDelays: [0, 2000, 10000, 30000], // Retry delays in milliseconds

  // Optional: Add authentication token
  accessTokenFactory: async () => {
    // Return your auth token here if needed
    // const token = localStorage.getItem('authToken');
    // return token || '';
    return "";
  },
};

// Example of how to wrap your app with SignalR
export function AppWithSignalR({ children }: { children: React.ReactNode }) {
  return (
    <SignalRProvider config={signalRConfig} autoConnect={true}>
      {children}
    </SignalRProvider>
  );
}
