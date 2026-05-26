import { ChangeEvent, forwardRef, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { cn } from "@/utils/className";
import InputWrapper from "../InputWrapper";
import { baseInputClasses } from "@/constants/styles/input";

export const InputPattern = {
  OnlyNumbers: /^\d*$/,
  OnlyLetters: /^[a-zA-ZÀ-ÿ\s]*$/,
  AlphaNumeric: /^[a-zA-ZÀ-ÿ0-9\s]*$/,
  Decimal: /^\d*[.,]?\d*$/,
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
  allowPattern?: RegExp;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      id,
      wrapperClassName,
      allowPattern,
      error,
      onChange,
      className,
      required,
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (allowPattern && !allowPattern.test(e.target.value)) return;
      onChange?.(e);
    };

    return (
      <InputWrapper label={label} id={id} className={wrapperClassName}>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={isPassword && showPassword ? "text" : type}
            onChange={handleChange}
            required={required}
            className={cn(
              baseInputClasses,
              "justify-between text-left",
              isPassword && "pr-12",
              error && "border-danger focus:border-danger",
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          )}
        </div>

        {error && <p className="text-danger text-xs font-medium mt-1">{error}</p>}
      </InputWrapper>
    );
  }
);

TextInput.displayName = "TextInput";
export default TextInput;
