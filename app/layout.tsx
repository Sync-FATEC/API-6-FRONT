import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

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
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased bg-slate-50`}>
      <body className="h-screen max-h-screen flex flex-col font-sans p-3 overflow-hidden">
        <Navbar />

        <main className="flex-1 flex flex-col min-h-0">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
