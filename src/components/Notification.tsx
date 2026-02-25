import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, ReactNode } from "react";
import toast, { Toast } from "react-hot-toast";

type NotificationButton = {
  label: string;
  onClick: (t: Toast) => void;
};

type NotificationProps = {
  Icon?: ReactNode; // react/24/outline
  title: string;
  subtitle?: string;
  showClose?: boolean;
  duration?: number;
  primaryButton?: NotificationButton;
  secondaryButton?: NotificationButton;
};

export const notification = ({
  Icon,
  title,
  subtitle,
  showClose = true,
  duration,
  primaryButton,
  secondaryButton,
}: NotificationProps) => {
  return toast.custom(
    (t) => (
      <Transition
        show={t.visible}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10">
          <div className="p-4">
            <div className="flex items-start">
              {Icon && (
                <div className="shrink-0">
                  <div className="h-6 w-6 text-gray-400 dark:text-gray-500" aria-hidden="true">
                    {Icon}
                  </div>
                </div>
              )}
              <div className={clsx(["flex-1 w-0", Icon && "pt-0.5 ml-3"])}>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                {(primaryButton || secondaryButton) && (
                  <div className="flex mt-3 space-x-7">
                    {primaryButton && (
                      <button
                        onClick={() => primaryButton.onClick(t)}
                        type="button"
                        className="rounded-md bg-white text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-transparent dark:text-orange-300 dark:hover:text-orange-200 dark:focus:ring-orange-400 dark:focus:ring-offset-gray-800"
                      >
                        {primaryButton.label}
                      </button>
                    )}
                    {secondaryButton && (
                      <button
                        onClick={() => secondaryButton.onClick(t)}
                        type="button"
                        className="rounded-md bg-white text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-transparent dark:text-gray-200 dark:hover:text-gray-100 dark:focus:ring-orange-400 dark:focus:ring-offset-gray-800"
                      >
                        {secondaryButton.label}
                      </button>
                    )}
                  </div>
                )}
              </div>
              {showClose && (
                <div className="flex shrink-0 ml-4">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-transparent dark:text-gray-500 dark:hover:text-gray-300 dark:focus:ring-orange-400 dark:focus:ring-offset-gray-800"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Transition>
    ),
    { duration },
  );
};
