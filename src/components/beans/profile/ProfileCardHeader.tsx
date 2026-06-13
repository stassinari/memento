import { ReactNode } from "react";

/**
 * Card header strip matching `Card.Header`'s styling, but with an arbitrary
 * right-hand slot (a coloured hint, a flag, a "View all" link, a ghost button)
 * rather than `Card.Header`'s orange-only action.
 */

interface ProfileCardHeaderProps {
  title: string;
  muted?: boolean;
  right?: ReactNode;
}

export const ProfileCardHeader = ({ title, muted, right }: ProfileCardHeaderProps) => (
  <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/50 px-4 py-2 dark:border-white/10 dark:bg-white/5 sm:px-6">
    <h3
      className={
        muted
          ? "text-sm font-bold leading-6 text-gray-500 dark:text-gray-400"
          : "text-sm font-bold leading-6 text-gray-900 dark:text-gray-100"
      }
    >
      {title}
    </h3>
    {right}
  </div>
);
