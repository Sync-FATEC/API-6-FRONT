import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/className";
import { LoadingSpinner } from "./LoadingSpinner";

const buttonVariants = cva(
  "relative inline-flex items-center shrink-0 font-semibold justify-center whitespace-nowrap cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "",
        soft: "",
        ghost: "",
        plain: "text-slate-700 hover:bg-slate-100",
      },
      color: {
        primary: "",
        danger: "",
      },
      size: {
        lg: "h-11 px-6 rounded-lg",
        md: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 px-3 rounded-md text-sm",
        icon: "h-11 w-11 rounded-md",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        color: "primary",
        className: "bg-primary text-white hover:bg-primary-600",
      },
      {
        variant: "soft",
        color: "primary",
        className: "bg-primary-50 text-primary hover:bg-primary-100",
      },
      {
        variant: "ghost",
        color: "primary",
        className: "text-primary hover:bg-primary-50 hover:text-primary",
      },

      { variant: "solid", color: "danger", className: "bg-danger text-white hover:bg-danger-600" },
      {
        variant: "soft",
        color: "danger",
        className: "bg-danger-50 text-danger hover:bg-danger-100",
      },
      {
        variant: "ghost",
        color: "danger",
        className: "text-danger hover:text-danger hover:bg-danger-50",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "primary",
      size: "lg",
    },
  }
);

interface Props
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant, color, size, isLoading, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, color, size, className }))}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </span>
        )}

        <span
          className={cn("inline-flex items-center justify-center gap-3", isLoading && "invisible")}
        >
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
