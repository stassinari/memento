import { PlusCircleIcon } from "@heroicons/react/20/solid";
import "twin.macro";
import { Button } from "../components/Button";
import { Combobox } from "../components/Combobox";

const people = [
  "Durward Reynolds",
  "Kenton Towne",
  "Therese Wunsch",
  "Benedict Kessler",
  "Katelyn Rohan",
];

export const DesignLibrary = () => (
  <div tw="space-y-8">
    <div>
      <Combobox label="Testing" name="testing" options={people} />
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
