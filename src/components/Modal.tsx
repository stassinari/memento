import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Fragment, ReactNode } from "react";
import "twin.macro";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  handleClose,
  children,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" tw="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div tw="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div tw="fixed inset-0 z-10 overflow-y-auto">
          <div tw="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel tw="relative w-full px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:(my-8 max-w-lg p-6)">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

interface ExampleDialogContentProps {
  handleClose: () => void;
}

export const ExampleDialogContent: React.FC<ExampleDialogContentProps> = ({
  handleClose,
}) => (
  <Fragment>
    <div>
      <div tw="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
        <CheckIcon tw="w-6 h-6 text-green-600" aria-hidden="true" />
      </div>
      <div tw="text-center sm:mt-5">
        <Dialog.Title as="h3" tw="text-lg font-medium leading-6 text-gray-900">
          Payment successful
        </Dialog.Title>
        <div tw="mt-2">
          <p tw="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
            amet labore.
          </p>
        </div>
      </div>
    </div>
    <div tw="mt-5 sm:mt-6">
      <Button
        variant="primary"
        width="full"
        onClick={handleClose}
        type="button"
      >
        Go back to dashboard
      </Button>
    </div>
  </Fragment>
);
