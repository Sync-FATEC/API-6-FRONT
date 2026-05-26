"use client";

/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import LoginIllustration from "@/public/login_illustration.png";

interface Props {
  children: ReactNode;
  compact?: boolean;
}

export default function LoginLayout({ children, compact = false }: Props) {
  if (compact) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <div className="hidden md:flex w-2/3 bg-orange-500 items-center justify-center overflow-hidden relative">
        <img
          src={LoginIllustration.src}
          alt="Espaço sideral"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-full bg-white md:w-1/3 flex items-center justify-center p-6">
        <div className="rounded-2xl shadow-md md:shadow-none w-full max-w-md p-8">{children}</div>
      </div>
    </div>
  );
}
