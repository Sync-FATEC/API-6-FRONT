import { cn } from "@/utils/className";

interface Props {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export default function ModalFooter({ left, right, className }: Props) {
  return (
    <div className={cn("flex w-full items-center justify-between", className)}>
      <div className="flex gap-2">{left}</div>
      <div className="flex gap-2">{right}</div>
    </div>
  );
}
