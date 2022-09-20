import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
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
