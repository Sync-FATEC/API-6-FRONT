"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer/Footer";

const ROUTES_WITHOUT_CHROME = ["/login"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showChrome = !ROUTES_WITHOUT_CHROME.includes(pathname);

  if (!showChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />
      <main className="flex-1">
        <div className="flex flex-col min-h-full">
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
