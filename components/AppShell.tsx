"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer/Footer";

const NO_SHELL_PATHS = ["/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = NO_SHELL_PATHS.includes(pathname);

  if (hideShell) {
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
