import { css } from "@emotion/react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
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
              tw`px-4 text-center sm:p-0`,
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
              <Dialog.Panel tw="relative w-full px-4 pt-5 pb-4 overflow-y-auto text-left transition-all transform bg-white rounded-lg shadow-xl sm:(my-8 max-w-lg p-6)">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export const ModalScroll: React.FC<ModalProps> = ({
  open,
  handleClose,
  children,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        // tw="fixed z-10 overflow-y-auto bg-white inset-8"
        tw="relative z-10"
        onClose={handleClose}
      >
        <div
          css={css`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 50;

            background: rgba(0, 0, 0, 0.6);
          `}
        />
        <div
          css={css`
            /* This way it could be display flex or grid or whatever also. */
            display: block;

            /* Probably need media queries here */
            width: 600px;
            max-width: calc(100% - 32px);

            height: calc(100% - 32px);
            max-height: calc(100% - 32px);

            position: fixed;

            z-index: 100;

            left: 50%;
            top: 50%;

            /* Use this for centering if unknown width/height */
            transform: translate(-50%, -50%);

            /* If known, negative margins are probably better (less chance of blurry text). */
            /* margin: -200px 0 0 -200px; */

            background: white;
            box-shadow: 0 0 60px 10px rgba(0, 0, 0, 0.9);
          `}
        >
          <div
            // tw={
            //   "inline-flex justify-center flex-col overflow-hidden"
            //   // ` ${!widthFromContent && "w-full max-w-md"}`
            // }
            // style={{ maxHeight: "90vh" }}
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: auto;
              padding: 20px 50px 20px 20px;
            `}
          >
            <Dialog.Title as="div">Title here</Dialog.Title>
            <Dialog.Description as="div" tw="w-full mt-4 overflow-y-auto">
              {children}
            </Dialog.Description>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export const YetAnotherModal: React.FC<ModalProps> = ({
  open,
  handleClose,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Backdrop className="fixed inset-0 bg-black/75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Lorem ipsum
              </Dialog.Title>
              <Dialog.Panel className="mt-2">
                <p className="text-sm text-gray-500">
                  Proin lacinia quis dui vel sagittis. Suspendisse in risus
                  massa. Donec porttitor magna vitae elit consequat, ac varius
                  nibh placerat. Cras sit amet augue sed urna dictum varius.
                  Aenean neque felis, auctor sit amet nibh eget, consectetur
                  egestas tellus. Nunc congue mauris risus, at lobortis leo
                  tempus at. Pellentesque eu dui vel purus ultricies dictum.
                  Mauris scelerisque pellentesque nisl, ut sodales est commodo
                  cursus. Phasellus tellus ante, porttitor a ex ac, viverra
                  venenatis risus. Vestibulum consectetur mauris vel velit
                  semper sagittis. Nam a auctor orci, sit amet tincidunt tellus.
                  Aliquam ac nulla et arcu molestie pharetra. Sed cursus aliquet
                  sem eu mattis. Sed cursus quam vel leo malesuada laoreet.
                  Vivamus quis luctus augue. Sed nisi dui, volutpat ac malesuada
                  sed, mattis non ligula. Curabitur suscipit ornare dapibus.
                  Quisque id urna sed nulla bibendum varius. Duis posuere felis
                  tellus, eu facilisis felis bibendum vitae. Duis vitae mollis
                  nisl, ut fermentum nulla. Praesent in ligula vehicula, luctus
                  eros porta, pharetra diam. Suspendisse vitae justo mi. Duis
                  condimentum ex lacus, a finibus metus euismod sed. Proin
                  dictum rutrum orci quis sodales. Donec aliquam diam eros,
                  sagittis sagittis risus euismod at. Proin sit amet erat ut
                  dolor feugiat vulputate sed et lorem. Vivamus aliquam risus ac
                  quam viverra fermentum. Donec tellus diam, molestie ut ante
                  ac, laoreet molestie urna. Duis sed consectetur felis, non
                  hendrerit orci. Mauris tincidunt tincidunt fermentum. Integer
                  finibus ac dui nec auctor. Vivamus a velit diam. Vestibulum
                  quis blandit nisl, nec euismod turpis. Donec quis massa
                  faucibus, congue augue eu, blandit dui. Suspendisse potenti.
                  Curabitur vestibulum purus mauris, sed cursus mauris mattis
                  in. Suspendisse vestibulum lobortis sem eget fermentum.
                  Phasellus sit amet sollicitudin dolor. Proin lobortis diam
                  quis nunc interdum commodo. Maecenas ut lectus ut felis
                  euismod aliquam. Sed lorem purus, condimentum sit amet
                  eleifend at, placerat condimentum nulla. Ut ut consectetur
                  nisl. Duis tincidunt ornare libero eget sollicitudin. Ut ut
                  risus at ligula ullamcorper auctor sed eu nisl. Phasellus
                  dolor leo, maximus non rhoncus non, tristique vitae nisl.
                  Maecenas et cursus metus, ac porta nunc. In tincidunt, urna in
                  rutrum ultrices, dolor purus finibus metus, sed tincidunt est
                  nisi eu velit. Morbi feugiat egestas pulvinar. Integer a neque
                  ornare, placerat leo in, sodales odio. Mauris nec sem ac ipsum
                  volutpat dignissim.
                </p>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
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
