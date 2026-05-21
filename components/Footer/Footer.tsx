"use client";

import { usePathname } from "next/navigation";
import FooterContent from "./Content";

const HIDE_FOOTER_PATHS = ["/", "/qgis"];

export default function Footer() {
  const pathname = usePathname();

  if (HIDE_FOOTER_PATHS.includes(pathname)) {
    return null;
  }

  return <FooterContent />;
}
