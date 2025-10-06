"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { LobbySignalRProvider } from "@/lib/signalr/roborally-config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LobbySignalRProvider>
        {children}
        <Toaster />
      </LobbySignalRProvider>
    </Provider>
  );
}
