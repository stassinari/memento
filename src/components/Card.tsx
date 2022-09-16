import { ReactNode } from "react";
import "twin.macro";

interface CardProps {
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => (
  <div tw="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">{children}</div>
);
