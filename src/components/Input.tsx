import clsx from "clsx";
import { type HTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes } from "react";

export const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";
export const inputStyles =
  "block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-xs placeholder:text-gray-400 sm:text-sm focus:border-orange-500 focus:ring-orange-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:border-white/15 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-orange-400 dark:focus:ring-orange-400 dark:disabled:border-white/10 dark:disabled:bg-white/10 dark:disabled:text-gray-400";

const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={clsx(labelStyles, className)} {...props} />
);

const Helper = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("mt-2 text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
);

const Error = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("mt-2 text-sm text-red-600 dark:text-red-400", className)} {...props} />
);

const InputRoot = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={clsx(inputStyles, className)} {...props} />
);

export const Input = Object.assign(InputRoot, { Helper, Label, Error });
