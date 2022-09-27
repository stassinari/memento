import { Transition } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import "twin.macro";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ComboboxMulti } from "../components/Combobox/ComboboxMulti";
import { ComboboxSingle } from "../components/Combobox/ComboboxSingle";
import { InputRadio } from "../components/InputRadio";
import { InputRadioButtonGroup } from "../components/InputRadioButtonGroup";

const people = [
  "Durward Reynolds",
  "Kenton Towne",
  "Therese Wunsch",
  "Benedict Kessler",
  "Katelyn Rohan",
];

const radioOptions = [
  { label: "First label", value: "first" },
  { label: "Second label", value: "second" },
  { label: "Third label", value: "third" },
];

const infiniteLoadingToast = () =>
  toast.custom(
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
        <div className="flex w-full max-w-md bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                  alt=""
                />
              </div>
              <div className="flex-1 w-0 ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Emilia Gates
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Sure! 8:30pm works great!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              type="button"
              className="flex items-center justify-center w-full p-4 text-sm font-medium text-indigo-600 border border-transparent rounded-none rounded-r-lg hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => toast.dismiss(t.id)}
            >
              Reply
            </button>
          </div>
        </div>
      </Transition>
    ),
    { duration: Infinity }
    // {
    //   icon: <ExclamationTriangleIcon tw="w-5 h-5" />,
    // }
  );

export const DesignLibrary = () => {
  const [singleValue, setSingleValue] = useState<string>();
  const [multiValues, setMultiValues] = useState<string[]>([]);

  const [radioCardValue, setRadioCardValue] = useState<string>();

  return (
    <div tw="space-y-8">
      <div>
        <Card>This is a card</Card>
      </div>
      <div tw="space-y-4">
        <InputRadio
          label="Test radio"
          options={radioOptions}
          inputProps={{ name: "test-radio" }}
        />

        <InputRadioButtonGroup
          label="Test radio group"
          options={radioOptions}
          value={radioCardValue}
          onChange={(v) => setRadioCardValue(v)}
        />

        <InputRadioButtonGroup
          label="Test radio secondary"
          options={radioOptions}
          value={radioCardValue}
          onChange={(v) => setRadioCardValue(v)}
          variant="secondary"
        />

        <ComboboxSingle
          label="Testing"
          name="testing"
          options={people}
          value={singleValue}
          onChange={(value) => setSingleValue(value)}
          reset={() => console.log("slolz")}
          placeholder="Placeholder..."
        />

        <ComboboxMulti
          label="Multi"
          name="multi-testing"
          options={people}
          values={multiValues}
          placeholder="Multi type here..."
          removeItem={(item: string) =>
            setMultiValues(multiValues.filter((value) => value !== item))
          }
          onChange={(values: any[]) => setMultiValues(values)}
        />
      </div>
      <div>
        Toast notifications
        <Button variant="primary" onClick={infiniteLoadingToast}>
          Try toast
        </Button>
        <Button
          variant="primary"
          onClick={() => toast("Here is your toast.", { duration: Infinity })}
        >
          Default toast
        </Button>
      </div>
      <div>
        <Button variant="primary" size="xs">
          Button xs
        </Button>
        <Button variant="primary" size="sm">
          Button sm
        </Button>
        <Button variant="primary">Button md</Button>
        <Button variant="primary" size="lg">
          Button lg
        </Button>
        <Button variant="primary" size="xl">
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="secondary" size="xs">
          Button xs
        </Button>
        <Button variant="secondary" size="sm">
          Button sm
        </Button>
        <Button variant="secondary">Button md</Button>
        <Button variant="secondary" size="lg">
          Button lg
        </Button>
        <Button variant="secondary" size="xl">
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="white" size="xs">
          Button xs
        </Button>
        <Button variant="white" size="sm">
          Button sm
        </Button>
        <Button variant="white">Button md</Button>
        <Button variant="white" size="lg">
          Button lg
        </Button>
        <Button variant="white" size="xl">
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="primary" size="xs" Icon={<PlusCircleIcon />}>
          Button xs
        </Button>
        <Button variant="primary" size="sm" Icon={<PlusCircleIcon />}>
          Button sm
        </Button>
        <Button variant="primary" Icon={<PlusCircleIcon />}>
          Button md
        </Button>
        <Button variant="primary" size="lg" Icon={<PlusCircleIcon />}>
          Button lg
        </Button>
        <Button variant="primary" size="xl" Icon={<PlusCircleIcon />}>
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="secondary" size="xs" Icon={<PlusCircleIcon />}>
          Button xs
        </Button>
        <Button variant="secondary" size="sm" Icon={<PlusCircleIcon />}>
          Button sm
        </Button>
        <Button variant="secondary" Icon={<PlusCircleIcon />}>
          Button md
        </Button>
        <Button variant="secondary" size="lg" Icon={<PlusCircleIcon />}>
          Button lg
        </Button>
        <Button variant="secondary" size="xl" Icon={<PlusCircleIcon />}>
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="white" size="xs" Icon={<PlusCircleIcon />}>
          Button xs
        </Button>
        <Button variant="white" size="sm" Icon={<PlusCircleIcon />}>
          Button sm
        </Button>
        <Button variant="white" Icon={<PlusCircleIcon />}>
          Button md
        </Button>
        <Button variant="white" size="lg" Icon={<PlusCircleIcon />}>
          Button lg
        </Button>
        <Button variant="white" size="xl" Icon={<PlusCircleIcon />}>
          Button xl
        </Button>
      </div>
    </div>
  );
};
