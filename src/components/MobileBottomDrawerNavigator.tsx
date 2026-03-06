import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState, type ReactNode } from "react";
import { Button } from "~/components/Button";

interface MobileBottomDrawerNavigatorProps {
  drawerTitle: string;
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
  closeOnContentClick?: boolean;
  children: ReactNode;
}

export const MobileBottomDrawerNavigator = ({
  drawerTitle,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
  closeOnContentClick = false,
  children,
}: MobileBottomDrawerNavigatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      <div
        className="fixed mb-0 inset-x-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur-sm dark:border-white/10 dark:bg-gray-900/95 md:hidden"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 3.5rem)" }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2">
          <Button
            type="button"
            variant="white"
            size="sm"
            onClick={onPrevious}
            disabled={disablePrevious}
          >
            <ArrowLeftIcon /> Previous
          </Button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex min-w-14 flex-col items-center gap-0.5 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <ChevronUpIcon className="size-4" />
            <span className="text-xs font-medium">
              {currentIndex + 1}/{totalCount}
            </span>
          </button>

          <Button type="button" variant="white" size="sm" onClick={onNext} disabled={disableNext}>
            Next <ArrowRightIcon />
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-30 md:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/40 transition-opacity duration-300 ease-out data-closed:opacity-0 dark:bg-gray-950/70"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-h-full items-end">
              <DialogPanel
                transition
                className="pointer-events-auto w-full transform transition duration-300 ease-out data-closed:translate-y-full"
              >
                <div className="max-h-[70vh] overflow-y-auto rounded-t-2xl border border-gray-200 bg-white pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-2xl dark:border-white/10 dark:bg-gray-900">
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-gray-900/95">
                    <DialogTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {drawerTitle}
                    </DialogTitle>

                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                    >
                      <span className="sr-only">Close sample list</span>
                      <XMarkIcon className="size-5" />
                    </button>
                  </div>

                  <div className="p-2" onClick={closeOnContentClick ? closeDrawer : undefined}>
                    {children}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
