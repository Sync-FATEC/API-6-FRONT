import { useState } from "react";
import Icon from "@/components/Icon";
import Popover from "@/components/Popover";
import { cn } from "@/utils/className";
import InputWrapper from "../InputLabel";
import { baseInputClasses } from "@/constants/styles/input";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
  wrapperClassName?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  label,
  id,
  className,
  wrapperClassName,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
  };

  const triggerButton = (
    <button
      type="button"
      id={id}
      className={cn(
        baseInputClasses,
        "cursor-pointer justify-between text-left",
        className
      )}
    >
      <span className={cn("truncate", !selectedOption && "text-slate-400")}>
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <Icon
        name="chevron-down"
        size={16}
        className={cn(
          "text-slate-400 shrink-0 transition-transform duration-200",
          open && "rotate-180"
        )}
      />
    </button>
  );

  const content = (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={triggerButton}
      align="start"
      sideOffset={8}
      contentClassName="w-[var(--radix-popover-trigger-width)] max-h-70 overflow-y-auto"
    >
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-md text-left cursor-pointer",
                isSelected
                  ? "bg-primary/5 text-primary font-medium"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <span className="truncate flex-1">{option.label}</span>
              {isSelected && <Icon name="check" size={20} className="text-primary shrink-0 ml-5" />}
            </button>
          );
        })}
      </div>
    </Popover>
  );

  if (label) {
    return (
      <InputWrapper label={label} id={id} className={wrapperClassName}>
        {content}
      </InputWrapper>
    );
  }

  return content;
}
