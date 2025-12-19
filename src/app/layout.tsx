import type { Metadata } from "next";
import { Tomorrow } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const tomorrow = Tomorrow({
  variable: "--font-tomorrow",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Roborally",
  description: "Roborally game that can be played online",
};

/**
 * @author Sachin Baral 2025-09-14 15:13:55 +0200 17
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${tomorrow.variable} font-tomorrow antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
