import { InputHTMLAttributes } from "react";
import tw from "twin.macro";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  lolz?: any;
}

export const Input: React.FC<InputProps> = tw.input`block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm`;
