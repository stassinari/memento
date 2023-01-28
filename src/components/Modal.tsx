import { css } from "@emotion/react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Fragment, ReactNode } from "react";
import tw, { theme } from "twin.macro";
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
          <div tw="fixed inset-0 transition-opacity bg-gray-500/75" />
        </Transition.Child>

        <div tw="fixed inset-0 z-10 overflow-y-auto">
          <div
            css={[
              tw`flex items-end justify-center min-h-full px-4 text-center sm:(items-center p-0)`,
              css`
                padding-top: calc(
                  env(safe-area-inset-top) + ${theme`spacing.4`}
                );
                padding-bottom: calc(
                  env(safe-area-inset-bottom) + ${theme`spacing.4`}
                );
              `,
            ]}
          >
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

interface RadixProps {
  triggerSlot: ReactNode;
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RadixModal: React.FC<RadixProps> = ({
  children,
  triggerSlot,
  open,
  setOpen,
}) => {
  console.log(theme``);
  return (
    <RadixDialog.Root open={open} onOpenChange={setOpen}>
      <RadixDialog.Trigger asChild>{triggerSlot}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay tw="fixed inset-0 z-10 grid overflow-y-auto place-items-center bg-gray-500/75 sm:place-items-center">
          <RadixDialog.Content
            css={[
              tw`p-4 mx-4 bg-white rounded`,
              css`
                /* will probably need to be smarter about widths */
                width: calc(100vw - ${theme`spacing.8`});
                @media (min-width: ${theme`screens.sm`}) {
                  width: auto;
                  max-width: 512px;
                }
                margin-top: calc(
                  env(safe-area-inset-top) + ${theme`spacing.4`}
                );
                margin-bottom: calc(
                  env(safe-area-inset-bottom) + ${theme`spacing.4`}
                );
              `,
            ]}
          >
            {children}
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
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
        {/* Use proper title component */}
        {/* <Dialog.Title as="h3" tw="text-lg font-medium leading-6 text-gray-900">
          Payment successful
        </Dialog.Title> */}
        <h2 tw="text-lg font-medium leading-6 text-gray-900">
          Payment successful
        </h2>
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

export const LoremIpsum = () => (
  <p>
    Proin lacinia quis dui vel sagittis. Suspendisse in risus massa. Donec
    porttitor magna vitae elit consequat, ac varius nibh placerat. Cras sit amet
    augue sed urna dictum varius. Aenean neque felis, auctor sit amet nibh eget,
    consectetur egestas tellus. Nunc congue mauris risus, at lobortis leo tempus
    at. Pellentesque eu dui vel purus ultricies dictum. Mauris scelerisque
    pellentesque nisl, ut sodales est commodo cursus. Phasellus tellus ante,
    porttitor a ex ac, viverra venenatis risus. Vestibulum consectetur mauris
    vel velit semper sagittis. Nam a auctor orci, sit amet tincidunt tellus.
    Aliquam ac nulla et arcu molestie pharetra. Sed cursus aliquet sem eu
    mattis. Sed cursus quam vel leo malesuada laoreet. Vivamus quis luctus
    augue. Sed nisi dui, volutpat ac malesuada sed, mattis non ligula. Curabitur
    suscipit ornare dapibus. Quisque id urna sed nulla bibendum varius. Duis
    posuere felis tellus, eu facilisis felis bibendum vitae. Duis vitae mollis
    nisl, ut fermentum nulla. Praesent in ligula vehicula, luctus eros porta,
    pharetra diam. Suspendisse vitae justo mi. Duis condimentum ex lacus, a
    finibus metus euismod sed. Proin dictum rutrum orci quis sodales. Donec
    aliquam diam eros, sagittis sagittis risus euismod at. Proin sit amet erat
    ut dolor feugiat vulputate sed et lorem. Vivamus aliquam risus ac quam
    viverra fermentum. Donec tellus diam, molestie ut ante ac, laoreet molestie
    urna. Duis sed consectetur felis, non hendrerit orci. Mauris tincidunt
    tincidunt fermentum. Integer finibus ac dui nec auctor. Vivamus a velit
    diam. Vestibulum quis blandit nisl, nec euismod turpis. Donec quis massa
    faucibus, congue augue eu, blandit dui. Suspendisse potenti. Curabitur
    vestibulum purus mauris, sed cursus mauris mattis in. Suspendisse vestibulum
    lobortis sem eget fermentum. Phasellus sit amet sollicitudin dolor. Proin
    lobortis diam quis nunc interdum commodo. Maecenas ut lectus ut felis
    euismod aliquam. Sed lorem purus, condimentum sit amet eleifend at, placerat
    condimentum nulla. Ut ut consectetur nisl. Duis tincidunt ornare libero eget
    sollicitudin. Ut ut risus at ligula ullamcorper auctor sed eu nisl.
    Phasellus dolor leo, maximus non rhoncus non, tristique vitae nisl. Maecenas
    et cursus metus, ac porta nunc. In tincidunt, urna in rutrum ultrices, dolor
    purus finibus metus, sed tincidunt est nisi eu velit. Morbi feugiat egestas
    pulvinar. Integer a neque ornare, placerat leo in, sodales odio. Mauris nec
    sem ac ipsum volutpat dignissim.
  </p>
);
