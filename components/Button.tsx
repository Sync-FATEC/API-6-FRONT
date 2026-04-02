import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "sm" | "md" | "lg";
  square?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  square = false,
  className = "",
  children,
  ...props
}: Props) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizes = {
    sm: square ? "p-1.5" : "px-2.5 py-1.5 text-xs font-medium",
    md: square ? "p-2.5" : "px-4 py-2 text-sm font-semibold",
    lg: square ? "p-3.5" : "px-6 py-3 text-base font-semibold",
  };

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600",
    secondary: "bg-primary/5 text-primary hover:bg-primary/10",
    tertiary: "bg-slate-50 hover:bg-slate-100 text-slate-500",
    ghost: "text-primary bg-transparent hover:bg-slate-50",
  };

  const shapeStyles = square ? "aspect-square" : "";

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${shapeStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
