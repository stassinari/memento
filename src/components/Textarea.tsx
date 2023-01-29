import React from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import "twin.macro";

export type TextareaProps = TextareaAutosizeProps &
  React.RefAttributes<HTMLTextAreaElement>;

export const Textarea: React.FC<TextareaProps> = React.forwardRef(
  (props, ref) => {
    return (
      <TextareaAutosize
        minRows={3}
        {...props}
        tw="block w-full border-gray-300 rounded-md shadow-sm focus:(border-orange-500 ring-orange-500) sm:text-sm"
        ref={ref}
      />
    );
  }
);
