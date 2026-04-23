import React, { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/utils/className";
import Icon from "../Icon";
import { Button } from "../Button";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
}: ModalProps) {
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onOpenChange(false);
    }
    setDragY(0);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/40",
            "data-[state=open]:animate-fade-in",
            "data-[state=closed]:animate-fade-out"
          )}
        />
        <Dialog.Content
          style={{
            transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
            transition: dragY === 0 ? "transform 0.2s ease-out" : "none",
          }}
          className={cn(
            "fixed z-50 bg-white shadow-xl flex flex-col max-h-[80dvh]",

            "bottom-0 left-0 right-0 w-full rounded-t-2xl rounded-b-none",

            "md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
            "md:w-3/4 xl:w-3/7 md:rounded-xl",

            "data-[state=open]:animate-slide-up",
            "data-[state=closed]:animate-slide-down",

            "md:data-[state=open]:animate-pop-in-soft",
            "md:data-[state=closed]:animate-pop-out-soft",

            className
          )}
        >
          <div
            className="shrink-0 rounded-t-2xl bg-white"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-full flex justify-center pt-4 md:hidden">
              <div className="w-20 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="flex items-center justify-between ps-6 pe-4 py-3 md:pt-4">
              <Dialog.Title className="text-xl font-semibold text-primary">{title}</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="plain" size="icon">
                  <Icon name="close" className="text-slate-400" />
                </Button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Modal dialog: {title}
            </Dialog.Description>
          </div>

          <div className="px-6 py-2 flex-1 overflow-y-auto min-h-0">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 pt-6 rounded-b-xl shrink-0">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
