"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { SignalRProvider } from "@/providers/SignalRProvider";
import { AudioProvider } from "@/modules/audio/AudioContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SignalRProvider>
        <AudioProvider>
          {children}
          <Toaster />
        </AudioProvider>
      </SignalRProvider>
    </Provider>
  );
}
