import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import DemoBar from "@/components/DemoBar";
import Tour from "@/components/Tour";

export const metadata: Metadata = {
  title: "Faru Trades | Verified business trade, escrow-secured",
  description: "A verified business directory and escrow-secured marketplace. Demo build.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <div className="stripe" />
          <Header />
          <main>{children}</main>
          <DemoBar />
          <Tour />
        </StoreProvider>
      </body>
    </html>
  );
}
