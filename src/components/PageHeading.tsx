import { Menu, Transition } from "@headlessui/react";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import tw from "twin.macro";
import { BreadcrumbsWithHome } from "./Breadcrumbs";
import { Heading } from "./Heading";

const HeadingMeta = () => (
  <div tw="flex flex-col mt-1 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
    <div tw="flex items-center mt-2 text-sm text-gray-500">
      <BriefcaseIcon
        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
        aria-hidden="true"
      />
      Full-time
    </div>
    <div tw="flex items-center mt-2 text-sm text-gray-500">
      <MapPinIcon
        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
        aria-hidden="true"
      />
      Remote
    </div>
    <div tw="flex items-center mt-2 text-sm text-gray-500">
      <CurrencyDollarIcon
        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
        aria-hidden="true"
      />
      $120k &ndash; $140k
    </div>
    <div tw="flex items-center mt-2 text-sm text-gray-500">
      <CalendarIcon
        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
        aria-hidden="true"
      />
      Closing on January 9, 2020
    </div>
  </div>
);

export const PageHeadingExample = () => (
  <div tw="lg:flex lg:items-center lg:justify-between">
    <div tw="flex-1 min-w-0">
      <BreadcrumbsWithHome
        items={[
          { label: "Drinks", linkTo: "/drinks" },
          { label: "Brews", linkTo: "/drinks/brews" },
          { label: "Brew details", linkTo: "#" },
        ]}
      />
      <Heading>Back End Developer</Heading>

      <HeadingMeta />
    </div>
    <div tw="flex mt-5 lg:ml-4 lg:mt-0">
      <span tw="hidden sm:block">
        <button
          type="button"
          tw="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <PencilIcon
            tw="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Edit
        </button>
      </span>

      <span tw="hidden ml-3 sm:block">
        <button
          type="button"
          tw="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <LinkIcon
            tw="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          View
        </button>
      </span>

      <span tw="sm:ml-3">
        <button
          type="button"
          tw="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <CheckIcon tw="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Publish
        </button>
      </span>

      {/* Dropdown */}
      <Menu as="div" tw="relative ml-3 sm:hidden">
        <Menu.Button tw="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
          More
          <ChevronDownIcon
            tw="-mr-1 ml-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items tw="absolute right-0 z-10 w-48 py-1 mt-2 -mr-1 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  css={[
                    active ? tw`bg-gray-100` : ``,
                    tw`block px-4 py-2 text-sm text-gray-700`,
                  ]}
                >
                  Edit
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  css={[
                    active ? tw`bg-gray-100` : ``,
                    tw`block px-4 py-2 text-sm text-gray-700`,
                  ]}
                >
                  View
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  </div>
);
