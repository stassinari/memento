import clsx from "clsx";
import { ReactNode } from "react";

interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

/**
 * Sticky action bar for forms. Keeps the primary action reachable while
 * scrolling long forms by pinning it to the bottom of the viewport.
 *
 * Uses the page background (gray-50/gray-950) so scrolled content disappears
 * seamlessly behind it. Sits flush above the persistent BottomNav on mobile
 * (3.5rem + safe area, see BottomNav.tsx); on md+ the BottomNav is hidden, so
 * it pins to the bottom edge.
 *
 * The negative `-mx-4` (re-added as `px-4`) bleeds the background into the
 * layout gutter so the side shadows of cards scrolling underneath are covered.
 * `-4` matches the layout's smallest gutter, so it reaches the viewport edge on
 * mobile and never overflows on wider screens.
 *
 * Reusable across form pages — pass the action buttons as children.
 */
export const FormActions = ({ children, className }: FormActionsProps) => {
  return (
    <div
      className={clsx(
        "sticky bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] z-10 -mx-4 flex justify-end gap-4 bg-gray-50 px-4 py-4 dark:bg-gray-950 md:bottom-0",
        className,
      )}
    >
      {/* Fade hint: content dissolves into the page colour as it scrolls under
          the bar, signalling there's more to scroll. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-full h-6 bg-linear-to-t from-gray-50 to-transparent dark:from-gray-950" />
      {children}
    </div>
  );
};
