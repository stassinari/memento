import { PlusCircleIcon } from "@heroicons/react/solid";
import React from "react";

export const Button = () => {
  return (
    <React.Fragment>
      <button
        type="button"
        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusCircleIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
        Button text
      </button>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusCircleIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
        Button text
      </button>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusCircleIcon className="w-5 h-5 mr-3 -ml-1" aria-hidden="true" />
        Button text
      </button>
      <button
        type="button"
        className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusCircleIcon className="w-5 h-5 mr-3 -ml-1" aria-hidden="true" />
        Button text
      </button>
    </React.Fragment>
  );
};
