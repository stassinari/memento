import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Fragment, ReactNode } from "react";
import toast, { Toast } from "react-hot-toast";
import tw from "twin.macro";

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
        <div tw="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
          <div tw="p-4">
            <div tw="flex items-start">
              {Icon && (
                <div tw="flex-shrink-0">
                  <div tw="w-6 h-6 text-gray-400" aria-hidden="true">
                    {Icon}
                  </div>
                </div>
              )}
              <div css={[tw`flex-1 w-0`, Icon && tw`pt-0.5 ml-3`]}>
                <p tw="text-sm font-medium text-gray-900">{title}</p>
                <p tw="mt-1 text-sm text-gray-500">{subtitle}</p>
                {(primaryButton || secondaryButton) && (
                  <div tw="flex mt-3 space-x-7">
                    {primaryButton && (
                      <button
                        onClick={primaryButton.onClick}
                        type="button"
                        tw="text-sm font-medium text-orange-600 bg-white rounded-md hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        {primaryButton.label}
                      </button>
                    )}
                    {secondaryButton && (
                      <button
                        onClick={secondaryButton.onClick}
                        type="button"
                        tw="text-sm font-medium text-gray-700 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        {secondaryButton.label}
                      </button>
                    )}
                  </div>
                )}
              </div>
              {showClose && (
                <div tw="flex flex-shrink-0 ml-4">
                  <button
                    type="button"
                    tw="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <span tw="sr-only">Close</span>
                    <XMarkIcon tw="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Transition>
    ),
    { duration }
  );
};
