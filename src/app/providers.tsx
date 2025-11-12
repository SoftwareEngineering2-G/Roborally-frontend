"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { SignalRProvider } from "@/providers/SignalRProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SignalRProvider>
        {children}
        <Toaster position="top-center"/>
      </SignalRProvider>
    </Provider>
  );
}
