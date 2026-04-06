import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/global.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";

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
      <body className="h-screen max-h-screen font-sans overflow-hidden">
        <Providers>
          <div className="flex flex-col h-full w-full p-3">
            <Navbar />
            <main className="flex-1 flex flex-col min-h-0">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
