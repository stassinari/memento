import React, { ReactNode } from "react";

import { Input } from "../Input";
import { Textarea, TextareaProps } from "../Textarea";

interface FormTextareaProps {
  label: string;
  id: string;
  helperText?: ReactNode;
  textareaProps?: TextareaProps;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  id,
  helperText,
  textareaProps,
}) => {
  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div className="mt-1">
        <Textarea
          id={id}
          aria-describedby={helperText ? `${id}-description` : undefined}
          {...textareaProps}
        />
      </div>
      {helperText && (
        <Input.Helper id={`${id}-description`}>{helperText}</Input.Helper>
      )}
    </div>
  );
};
