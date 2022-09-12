import {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react";
import tw, { styled } from "twin.macro";

export const labelStyles = tw`block text-sm font-medium text-gray-700`;

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}
const Label: React.FC<LabelProps> = styled.label`
  ${labelStyles}
`;

interface HelperProps extends HTMLAttributes<HTMLParagraphElement> {}
const Helper: React.FC<HelperProps> = tw.p`mt-2 text-sm text-gray-500`;

interface ErrorProps extends HTMLAttributes<HTMLParagraphElement> {}
const Error: React.FC<ErrorProps> = tw.p`mt-2 text-sm text-red-600`;

interface InputRootProps extends InputHTMLAttributes<HTMLInputElement> {}
const InputRoot: React.FC<InputRootProps> = tw.input`block w-full border-gray-300 rounded-md shadow-sm focus:(ring-orange-500 border-orange-500) sm:text-sm`;

export const Input = Object.assign(InputRoot, { Helper, Label, Error });
