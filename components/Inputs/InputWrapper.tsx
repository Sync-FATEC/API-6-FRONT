import { ReactNode } from "react";
import { cn } from "@/utils/className";

export function InputLabel({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  if (!children) return null;

  return (
    <label
      className={cn("text-sm font-medium text-slate-500", className)}
      {...props}
    >
      {children}
    </label>
  );
}

interface Props {
  children: ReactNode;
  label?: string;
  id?: string;
  className?: string;
}

export default function InputWrapper({ children, label, id, className }: Props) {
  if (!label) return <>{children}</>;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      {children}
    </div>
  );
}
