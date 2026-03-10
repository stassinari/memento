export const pickerRightIconButtonStyles =
  "absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden";

export const pickerRightIconStyles =
  "h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300";

const pickerMenuBaseStyles =
  "z-10 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-900 dark:outline-white/10";

export const pickerAnchoredMenuStyles =
  `w-(--button-width) [--anchor-gap:0.25rem] [--anchor-max-height:14rem] ${pickerMenuBaseStyles}`;

export const pickerAbsoluteMenuStyles = `absolute mt-1 w-full ${pickerMenuBaseStyles}`;

export const pickerOptionBaseStyles =
  "group relative cursor-default select-none py-2 pr-9 text-gray-900 data-focus:bg-orange-600 data-focus:text-white data-focus:outline-hidden dark:text-gray-100 dark:data-focus:bg-orange-500";

export const pickerOptionCheckStyles =
  "absolute inset-y-0 right-0 flex items-center pr-4 text-orange-600 group-not-data-selected:hidden group-data-focus:text-white dark:text-orange-300";
