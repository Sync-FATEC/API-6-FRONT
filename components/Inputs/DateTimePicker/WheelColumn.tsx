import { MONTHS } from "@/constants/date";
import { cn } from "@/utils/className";
import { useEffect, useRef } from "react";

interface Props {
  currentValue: number;
  options: number[];
  onChangeSegment: (val: number) => void;
  padLength?: number;
  isMonth?: boolean;
  isOpen: boolean;
  isOptionDisabled?: (val: number) => boolean;
}

export const WheelColumn = ({
  currentValue,
  options,
  onChangeSegment,
  padLength = 2,
  isMonth = false,
  isOpen,
  isOptionDisabled,
}: Props) => {
  const selectedRef = useRef<HTMLButtonElement>(null);

  const centerSelected = (behavior: ScrollBehavior = "smooth") => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: "center",
        behavior,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => centerSelected("instant"), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      centerSelected("smooth");
    }
  }, [currentValue, isOpen]);

  return (
    <div className={cn("relative h-48 overflow-hidden", isMonth ? "w-32" : "w-16")}>
      <div className="absolute top-0 left-0 right-0 h-10 bg-linear-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white to-transparent pointer-events-none z-10" />

      <div
        className="flex flex-col gap-1 h-full overflow-y-auto overscroll-contain no-scrollbar relative z-0"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="h-18.5 shrink-0" />

        {options.map((opt) => {
          const disabled = isOptionDisabled ? isOptionDisabled(opt) : false;

          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              ref={currentValue === opt ? selectedRef : null}
              onClick={() => !disabled && onChangeSegment(opt)}
              className={cn(
                "h-9 px-2 shrink-0 flex items-center justify-center w-full text-lg snap-center transition-colors rounded-lg",
                disabled && "opacity-20",
                !disabled &&
                  currentValue === opt &&
                  "font-bold text-primary bg-primary/5 cursor-pointer",
                !disabled &&
                  currentValue !== opt &&
                  "text-slate-600 hover:bg-slate-50 cursor-pointer"
              )}
            >
              {isMonth ? (
                <span className="text-base">{MONTHS[opt - 1]}</span>
              ) : (
                opt.toString().padStart(padLength, "0")
              )}
            </button>
          );
        })}

        <div className="h-18.5 shrink-0" />
      </div>
    </div>
  );
};
