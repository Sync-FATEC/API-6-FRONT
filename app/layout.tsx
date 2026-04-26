import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/global.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { cn } from "@/utils/className";
import Footer from "@/components/Footer/Footer";

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
    <html lang="pt-BR" className={cn(geist.variable, "h-full antialiased bg-slate-50")}>
      <body className="h-screen max-h-screen">
        <Providers>
          <div className="flex flex-col h-full w-full">
            <Navbar />
            <main className="flex-1">
              <div className="flex flex-col min-h-full">
                <div className="flex-1 flex flex-col">{children}</div>
                <Footer />
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
