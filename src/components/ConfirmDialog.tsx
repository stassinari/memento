import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "~/components/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} className="relative z-40">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-900/40 transition-opacity duration-300 ease-out data-closed:opacity-0 dark:bg-gray-950/70"
    />

    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div
        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        }}
      >
        <DialogPanel
          transition
          className="w-full max-w-lg transform overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-2xl transition-all duration-300 ease-out data-closed:translate-y-4 data-closed:opacity-0 sm:data-closed:translate-y-0 sm:data-closed:scale-95 dark:border-white/10 dark:bg-gray-900"
        >
          <div className="flex items-start justify-between px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/15">
                <ExclamationTriangleIcon className="size-5 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </DialogTitle>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200"
            >
              <span className="sr-only">Close dialog</span>
              <XMarkIcon className="size-5" />
            </button>
          </div>

          <div className="mt-5 flex justify-end gap-3 border-t border-gray-200 px-4 py-4 sm:px-6 dark:border-white/10">
            <Button type="button" variant="white" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button type="button" variant="primary" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);
