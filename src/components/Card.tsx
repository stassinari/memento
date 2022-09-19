import { ReactNode } from "react";
import "twin.macro";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    tw="px-4 py-5 -mx-4 bg-white shadow sm:(rounded-lg p-6 mx-0)"
    className={className}
  >
    {children}
  </div>
);
