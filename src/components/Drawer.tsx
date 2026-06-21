import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Optional action shown in the header, left of the close button (e.g. "Clear all"). */
  headerAction?: ReactNode;
  children: ReactNode;
  /** Sticky footer (e.g. a "Show N results" button). */
  footer?: ReactNode;
}

/**
 * A responsive slide-out panel: docks to the right on desktop, rises as a bottom
 * sheet on mobile. The single new overlay shell for the app (we only had modals
 * and the mobile nav drawer before) — built for the History filter sheet but
 * generic. Layout is header · scrollable body · sticky footer.
 */
export const Drawer = ({ open, onClose, title, headerAction, children, footer }: DrawerProps) => (
  <Dialog open={open} onClose={onClose} className="relative z-40">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-900/30 transition duration-200 ease-out data-closed:opacity-0"
    />
    <div className="fixed inset-0 overflow-hidden">
      <DialogPanel
        transition
        className={
          // Mobile: bottom sheet (slides up). Desktop (sm+): right drawer (slides in).
          "fixed inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-xl " +
          "transition duration-300 ease-out data-closed:translate-y-full " +
          "sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[360px] sm:rounded-t-none " +
          "sm:data-closed:translate-y-0 sm:data-closed:translate-x-full " +
          "dark:bg-gray-900 dark:shadow-black/40"
        }
      >
        {/* Mobile grab handle */}
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
          <span className="h-1 w-9 rounded-full bg-gray-300 dark:bg-white/20" />
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <DialogTitle className="text-[15px] font-bold text-gray-900 dark:text-gray-100">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-3">
            {headerAction}
            <button
              type="button"
              onClick={onClose}
              className="grid h-7 w-7 place-items-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-300"
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div
            className="border-t border-gray-100 px-5 py-3.5 dark:border-white/10"
            style={{ paddingBottom: "max(0.875rem, env(safe-area-inset-bottom))" }}
          >
            {footer}
          </div>
        )}
      </DialogPanel>
    </div>
  </Dialog>
);
