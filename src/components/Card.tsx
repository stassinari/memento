import { ReactNode } from "react";
import "twin.macro";

interface CardProps {
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => (
  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
      {children}
    </div>
  </div>
);
