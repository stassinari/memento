import React, { FC, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import tw from "twin.macro";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: FieldError;
  register?: any;
  wrapperClass?: string;
  className?: string;
  requiredMsg?: string;
}

export const InputField: FC<InputFieldProps> = ({
  register,
  name,
  error,
  label,
  wrapperClass,
  requiredMsg: required,
  ...rest
}) => {
  return (
    <div className={wrapperClass}>
      <label htmlFor={name}>
        <span>{label}</span>
      </label>

      <input
        aria-invalid={error ? "true" : "false"}
        css={[tw`w-full `, error && tw``]}
        {...register(name, { required })}
        {...rest}
      />

      {error && (
        <label role="alert">
          <span>{error.message}</span>
        </label>
      )}
    </div>
  );
};