import { ReactNode } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "@/utils/className";

interface Props {
  trigger: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
}

export default function Popover({
  trigger,
  children,
  side = "bottom",
  align = "start",
  sideOffset = 12,
  open,
  onOpenChange,
  contentClassName,
}: Props) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 bg-white shadow-xl outline-none p-1.5 rounded-xl min-w-50 border border-slate-100",
            "data-[state=open]:animate-pop-in-soft",
            "data-[state=closed]:animate-pop-out-soft",
            contentClassName
          )}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
