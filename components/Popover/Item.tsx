import { ButtonHTMLAttributes, ReactNode } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "@/utils/className";

interface PopoverItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PopoverItem({ children, className, ...props }: PopoverItemProps) {
  return (
    <RadixPopover.Close asChild>
      <button
        {...props}
        className={cn(
          "flex items-center cursor-pointer gap-2 p-2.5 text-sm hover:bg-slate-100 rounded-lg text-slate-600 font-medium w-full",
          "disabled:opacity-50 disabled:cursor-auto disabled:hover:bg-transparent",
          className
        )}
      >
        {children}
      </button>
    </RadixPopover.Close>
  );
}
