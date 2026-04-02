import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/utils/className";
import Icon from "../Icon";
import Button from "../Button";

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
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg",
            "data-[state=open]:animate-pop-in-soft",
            "data-[state=closed]:animate-pop-out-soft",
            className
          )}
        >
          <div className="flex items-center justify-between ps-6 pe-4 py-4">
            <Dialog.Title className="text-xl font-semibold text-primary">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" square>
                <Icon name="close" className="text-slate-400" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="px-6 py-4">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-3 ps-6 pe-4 pb-4 pt-12 rounded-b-xl">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
