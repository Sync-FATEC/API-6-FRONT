import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { cn } from "@/utils/className";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "center" | "start" | "end";
  className?: string;
}

export default function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            className={cn(
              "z-50 rounded-md bg-slate-950 p-3 font-medium text-sm text-white shadow-lg max-w-sm wrap-break-word",
              "data-[state=delayed-open]:animate-pop-in-soft",
              "data-[state=instant-open]:animate-pop-in-soft",
              "data-[state=closed]:animate-pop-out-soft",
              className
            )}
          >
            {content}

            <TooltipPrimitive.Arrow className="fill-slate-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
