import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/global.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";
import { cn } from "@/utils/className";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "VISIONA GeoQuery",
  description: "Frontend da API Team SYNC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn(geist.variable, "h-full bg-slate-50 antialiased")}>
      <body className="min-h-screen">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
