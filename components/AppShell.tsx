"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer/Footer";

const NO_SHELL_PATHS = ["/login", "/esqueci-senha", "/redefinir-senha"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = NO_SHELL_PATHS.includes(pathname);

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col w-full">
      <Navbar />

      <main className="flex flex-1 flex-col">{children}</main>

      <Footer />
    </div>
  );
}
