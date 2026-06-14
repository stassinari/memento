import * as Popover from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  /** Which side to prefer; flipped automatically on collision. */
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * A tooltip that also works on touch. Built on Radix Popover (not Tooltip,
 * which never opens on touch): mouse users get hover, touch users get tap.
 * Portaled, so it escapes `overflow-hidden` cards and never clips.
 */
export const Tooltip = ({ content, children, side = "top" }: TooltipProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        asChild
        // Desktop: hover. Touch falls through to Popover's built-in tap toggle.
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      >
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          sideOffset={6}
          collisionPadding={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="z-50 max-w-56 rounded-md bg-gray-900 px-2.5 py-1.5 text-center text-xs leading-snug text-white shadow-lg dark:bg-gray-700"
        >
          {content}
          <Popover.Arrow className="fill-gray-900 dark:fill-gray-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
