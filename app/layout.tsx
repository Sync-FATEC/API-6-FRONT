import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({
  subsets: ["latin"],
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
    <html lang="pt-BR" className={`${geist.className} h-full antialiased bg-slate-50`}>
      <body className="h-screen max-h-screen flex flex-col font-sans p-3 overflow-hidden">
        <Navbar />

        <main className="flex-1 flex flex-col min-h-0">{children}</main>
      </body>
    </html>
  );
}
