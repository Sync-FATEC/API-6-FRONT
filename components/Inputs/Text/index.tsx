import { ChangeEvent, forwardRef } from "react";
import { cn } from "@/utils/className";
import InputWrapper from "../InputLabel";
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
}

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, id, wrapperClassName, allowPattern, onChange, className, required, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (allowPattern && !allowPattern.test(e.target.value)) {
        return;
      }
      if (onChange) {
        onChange(e);
      }
    };

    const content = (
      <input
        ref={ref}
        id={id}
        onChange={handleChange}
        required={required}
        className={cn(
          baseInputClasses,
          "justify-between text-left",
          className
        )}
        {...props}
      />
    );

    return (
      <InputWrapper label={label} id={id} className={wrapperClassName}>
        {content}
      </InputWrapper>
    );
  }
);

TextInput.displayName = "TextInput";
export default TextInput;
