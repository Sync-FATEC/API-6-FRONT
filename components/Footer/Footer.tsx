"use client";

import { usePathname } from "next/navigation";
import FooterContent from "./Content";

export default function Footer() {
  const pathname = usePathname();

  const isChatPage = pathname === "/"; 

  if (isChatPage) {
    return null;
  }

  return <FooterContent />;
}
