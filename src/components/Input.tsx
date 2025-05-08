import clsx from "clsx";
import {
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
} from "react";

export const labelStyles = "block text-sm font-medium text-gray-700";
export const inputStyles =
  "block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500";

const Label = ({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={clsx(labelStyles, className)} {...props} />
);

const Helper = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("mt-2 text-sm text-gray-500", className)} {...props} />
);

const Error = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("mt-2 text-sm text-red-600", className)} {...props} />
);

const InputRoot = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={clsx(inputStyles, className)} {...props} />
);

export const Input = Object.assign(InputRoot, { Helper, Label, Error });
