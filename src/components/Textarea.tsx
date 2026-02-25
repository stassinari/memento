import React from "react";
import TextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize";

export type TextareaProps = TextareaAutosizeProps & React.RefAttributes<HTMLTextAreaElement>;

export const Textarea: React.FC<TextareaProps> = React.forwardRef((props, ref) => {
  return (
    <TextareaAutosize
      minRows={3}
      {...props}
      className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm dark:border-white/15 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
      ref={ref}
    />
  );
});
