import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";
import "twin.macro";
import { theme } from "twin.macro";
import { Badge, BadgePlusIcon, BadgeTimesIcon } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ComboboxMulti } from "../components/Combobox/ComboboxMulti";
import { ComboboxSingle } from "../components/Combobox/ComboboxSingle";
import { InputRadio } from "../components/InputRadio";
import { InputRadioButtonGroup } from "../components/InputRadioButtonGroup";
import { notification } from "../components/Notification";

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
        <Button
          variant="primary"
          onClick={() => notification({ title: "Minimal notification" })}
        >
          Minimal
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            notification({
              title: "Reload",
              subtitle: "There is a new version of Memento. Please restart.",
              duration: Infinity,
              Icon: <ArrowPathIcon />,
              showClose: false,
              primaryButton: {
                label: "Reload",
                onClick: (t) => {
                  toast.dismiss(t.id);
                },
              },
            })
          }
        >
          Reload-like
        </Button>
        <Button
          variant="primary"
          onClick={() => toast("Here is your toast.", { duration: Infinity })}
        >
          Default toast
        </Button>
      </div>
      <div>
        <div tw="flex flex-col overflow-hidden rounded-md w-min">
          <div tw="flex items-center h-12 pl-6 text-sm font-medium text-white bg-orange-600 w-72">
            Primary <span tw="ml-3 uppercase">{theme`colors.orange.600`}</span>
          </div>
          <div tw="flex items-center h-12 pl-6 text-sm font-medium text-black bg-orange-300 w-72">
            Primary alt
            <span tw="ml-3 uppercase">{theme`colors.orange.300`}</span>
          </div>
          <div tw="flex items-center h-12 pl-6 text-sm font-medium text-white bg-blue-600 w-72">
            Secondary <span tw="ml-3 uppercase">{theme`colors.blue.600`}</span>
          </div>
          <div tw="flex items-center h-12 pl-6 text-sm font-medium text-black bg-blue-300 w-72">
            Secondary alt
            <span tw="ml-3 uppercase">{theme`colors.blue.300`}</span>
          </div>
        </div>
      </div>
      <div>
        <Badge label="Gray badge" />
        <Badge label="Orange badge" colour="orange" />
        <Badge
          label="Icon left"
          colour="orange"
          icon={{ Element: <BadgeTimesIcon />, position: "left" }}
        />
        <Badge
          label="Icon right"
          colour="orange"
          icon={{ Element: <BadgeTimesIcon />, position: "right" }}
        />
        <Badge
          label="Suggestion"
          colour="grey"
          clickable={true}
          icon={{ Element: <BadgePlusIcon />, position: "left" }}
        />
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
        <Button colour="accent" variant="primary" size="xs">
          Button xs
        </Button>
        <Button colour="accent" variant="primary" size="sm">
          Button sm
        </Button>
        <Button colour="accent" variant="primary">
          Button md
        </Button>
        <Button colour="accent" variant="primary" size="lg">
          Button lg
        </Button>
        <Button colour="accent" variant="primary" size="xl">
          Button xl
        </Button>
      </div>
      <div>
        <Button colour="accent" variant="secondary" size="xs">
          Button xs
        </Button>
        <Button colour="accent" variant="secondary" size="sm">
          Button sm
        </Button>
        <Button colour="accent" variant="secondary">
          Button md
        </Button>
        <Button colour="accent" variant="secondary" size="lg">
          Button lg
        </Button>
        <Button colour="accent" variant="secondary" size="xl">
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
