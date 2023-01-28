import {
  PlusCircleIcon,
  PlusIcon as PlusIconMini,
} from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  PlusIcon as PlusIconOutline,
} from "@heroicons/react/24/outline";
import { atom } from "jotai";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { theme } from "twin.macro";
import { Badge, BadgePlusIcon, BadgeTimesIcon } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ComboboxMulti } from "../components/Combobox/ComboboxMulti";
import { ComboboxSingle } from "../components/Combobox/ComboboxSingle";
import { IconButton } from "../components/IconButton";
import { InputRadio } from "../components/InputRadio";
import { InputRadioButtonGroup } from "../components/InputRadioButtonGroup";
import {
  InputRadioCards,
  InputRadioCardsOption,
} from "../components/InputRadioCards";
import {
  ExampleDialogContent,
  LoremIpsum,
  Modal,
  RadixModal,
} from "../components/Modal";
import { notification } from "../components/Notification";
import { Stopwatch } from "../components/Stopwatch";
import { Toggle } from "../components/Toggle";

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

const radioCardOptions: InputRadioCardsOption[] = [
  {
    value: "hobby",
    left: {
      top: "Hobby",
      bottom: (
        <React.Fragment>8GB / 4 CPUs &middot; 160 GB SSD disk</React.Fragment>
      ),
    },
    right: { top: "$40", bottom: "/mo" },
  },
  {
    value: "startup",
    left: {
      top: "Startup",
      bottom: (
        <React.Fragment>12GB / 6 CPUs &middot; 256 GB SSD disk</React.Fragment>
      ),
    },
    right: { top: "$80", bottom: "/mo" },
  },
  {
    value: "business",
    left: {
      top: "Business",
      bottom: (
        <React.Fragment>16GB / 8 CPUs &middot; 512 GB SSD disk</React.Fragment>
      ),
    },
    right: { top: "$160", bottom: "/mo" },
  },
  {
    value: "enterprise",
    left: {
      top: "Enterprise",
      bottom: (
        <React.Fragment>
          32GB / 12 CPUs &middot; 1024 GB SSD disk
        </React.Fragment>
      ),
    },
    right: { top: "$240", bottom: "/mo" },
  },
];

export const designLibraryStopwatchAtom = atom<boolean>(false);

export const DesignLibrary = () => {
  const [singleValue, setSingleValue] = useState<string>();
  const [multiValues, setMultiValues] = useState<string[]>([]);

  const [, setSeconds] = useState(0);
  const [, setMinutes] = useState(0);

  const [switchEnabled, setSwitchEnabled] = useState(false);

  const [formRadioCardValue, setFormRadioCardValue] = useState(
    radioCardOptions[1]
  );

  const [radioButtonGroupValue, setRadioButtonGroupValue] = useState<string>();

  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);

  const [isTwRadixModalOpen, setIsTwRadixModalOpen] = useState(false);
  const [isLongRadixModalOpen, setIsLongRadixModalOpen] = useState(false);

  return (
    <div tw="space-y-8">
      <div>
        <p>Modals</p>
        <div>
          <Button variant="primary" onClick={() => setIsExampleModalOpen(true)}>
            Open example modal
          </Button>
          <Modal
            open={isExampleModalOpen}
            handleClose={() => setIsExampleModalOpen(false)}
          >
            <ExampleDialogContent
              handleClose={() => setIsExampleModalOpen(false)}
            />
          </Modal>
        </div>
        <div>
          <Button variant="primary" onClick={() => setIsBasicModalOpen(true)}>
            Open basic modal
          </Button>
          <Modal
            open={isBasicModalOpen}
            handleClose={() => setIsBasicModalOpen(false)}
          >
            This is the basic-est modal
          </Modal>
        </div>
        <div>
          <RadixModal
            triggerSlot={
              <Button variant="primary">Tailwind Radix modal</Button>
            }
            open={isTwRadixModalOpen}
            setOpen={setIsTwRadixModalOpen}
          >
            <ExampleDialogContent
              handleClose={() => setIsExampleModalOpen(false)}
            />
          </RadixModal>
        </div>
        <div>
          <RadixModal
            triggerSlot={<Button variant="primary">Long Radix modal</Button>}
            open={isLongRadixModalOpen}
            setOpen={setIsLongRadixModalOpen}
          >
            <LoremIpsum />
          </RadixModal>
        </div>
      </div>
      <div>
        <InputRadioCards
          label="Radio cards"
          options={radioCardOptions}
          currentValue={formRadioCardValue}
          handleChange={setFormRadioCardValue}
        />
      </div>
      <div>
        <Card>This is a card</Card>
      </div>
      <div>
        <Stopwatch
          atom={designLibraryStopwatchAtom}
          setFormSeconds={setSeconds}
          setFormMinutes={setMinutes}
        />
      </div>
      <div tw="flex gap-4">
        <Toggle checked={switchEnabled} onChange={setSwitchEnabled} />

        <Toggle
          checked={switchEnabled}
          onChange={setSwitchEnabled}
          colour="accent"
        />
      </div>
      <div tw="space-y-4">
        <InputRadio
          label="Test radio"
          direction="horizontal"
          options={radioOptions}
          inputProps={{ name: "test-radio" }}
        />

        <InputRadioButtonGroup
          label="Test radio group"
          options={radioOptions}
          value={radioButtonGroupValue}
          onChange={(v) => setRadioButtonGroupValue(v)}
        />

        <InputRadioButtonGroup
          label="Test radio secondary"
          options={radioOptions}
          value={radioButtonGroupValue}
          onChange={(v) => setRadioButtonGroupValue(v)}
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
        <Badge label="Grey badge" />
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
          icon={{
            Element: <BadgePlusIcon />,
            position: "left",
            onClick: () => console.log("lolz"),
          }}
        />
      </div>
      <div>
        <Badge label="Grey badge" size="large" />
        <Badge label="Orange badge" colour="orange" size="large" />
        <Badge
          label="Icon left"
          colour="orange"
          size="large"
          icon={{ Element: <BadgeTimesIcon />, position: "left" }}
        />
        <Badge
          label="Icon right"
          colour="orange"
          size="large"
          icon={{ Element: <BadgeTimesIcon />, position: "right" }}
        />
        <Badge
          label="Suggestion"
          colour="grey"
          size="large"
          clickable={true}
          icon={{
            Element: <BadgePlusIcon />,
            position: "left",
            onClick: () => console.log("lolz"),
          }}
        />
      </div>
      <div tw="space-y-2">
        <h2>Buttons</h2>
        <div tw="space-x-2">
          <Button variant="gradient" size="xs">
            Button xs
          </Button>
          <Button variant="gradient" size="sm">
            Button sm
          </Button>
          <Button variant="gradient">Button md</Button>
          <Button variant="gradient" size="lg">
            Button lg
          </Button>
          <Button variant="gradient" size="xl">
            Button xl
          </Button>
          <Button variant="gradient" disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
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
          <Button variant="primary" disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
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
          <Button variant="secondary" disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
          <Button colour="accent" variant="gradient" size="xs">
            Button xs
          </Button>
          <Button colour="accent" variant="gradient" size="sm">
            Button sm
          </Button>
          <Button colour="accent" variant="gradient">
            Button md
          </Button>
          <Button colour="accent" variant="gradient" size="lg">
            Button lg
          </Button>
          <Button colour="accent" variant="gradient" size="xl">
            Button xl
          </Button>
          <Button colour="accent" variant="gradient" disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
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
          <Button colour="accent" variant="primary" disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
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
          <Button colour="accent" variant="secondary" disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
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
          <Button variant="white" disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
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
          <Button variant="primary" Icon={<PlusCircleIcon />} disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
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
          <Button variant="secondary" Icon={<PlusCircleIcon />} disabled>
            Button md
          </Button>
        </div>
        <div tw="space-x-2">
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
          <Button variant="white" Icon={<PlusCircleIcon />} disabled>
            Button md
          </Button>
        </div>
      </div>
      <div>
        <h2>IconButtons</h2>

        <div>
          <IconButton variant="gradient" size="xs" Icon={<PlusIconMini />}>
            Button xs
          </IconButton>
          <IconButton variant="gradient" size="sm" Icon={<PlusIconMini />}>
            Button sm
          </IconButton>
          <IconButton variant="gradient" Icon={<PlusIconMini />}>
            Button md
          </IconButton>
          <IconButton variant="gradient" size="lg" Icon={<PlusIconOutline />}>
            Button lg
          </IconButton>
          <IconButton variant="gradient" size="xl" Icon={<PlusIconOutline />}>
            Button xl
          </IconButton>
          <IconButton variant="gradient" Icon={<PlusIconMini />} disabled>
            Button md
          </IconButton>
        </div>
        <div>
          <IconButton variant="primary" size="xs" Icon={<PlusIconMini />}>
            Button xs
          </IconButton>
          <IconButton variant="primary" size="sm" Icon={<PlusIconMini />}>
            Button sm
          </IconButton>
          <IconButton variant="primary" Icon={<PlusIconMini />}>
            Button md
          </IconButton>
          <IconButton variant="primary" size="lg" Icon={<PlusIconOutline />}>
            Button lg
          </IconButton>
          <IconButton variant="primary" size="xl" Icon={<PlusIconOutline />}>
            Button xl
          </IconButton>
          <IconButton variant="primary" Icon={<PlusIconMini />} disabled>
            Button md
          </IconButton>
        </div>
        <div>
          <IconButton variant="secondary" size="xs" Icon={<PlusIconMini />}>
            Button xs
          </IconButton>
          <IconButton variant="secondary" size="sm" Icon={<PlusIconMini />}>
            Button sm
          </IconButton>
          <IconButton variant="secondary" Icon={<PlusIconMini />}>
            Button md
          </IconButton>
          <IconButton variant="secondary" size="lg" Icon={<PlusIconOutline />}>
            Button lg
          </IconButton>
          <IconButton variant="secondary" size="xl" Icon={<PlusIconOutline />}>
            Button xl
          </IconButton>
          <IconButton variant="secondary" Icon={<PlusIconMini />} disabled>
            Button md
          </IconButton>
        </div>
        <div>
          <IconButton
            colour="accent"
            variant="gradient"
            size="xs"
            Icon={<PlusIconMini />}
          >
            Button xs
          </IconButton>
          <IconButton
            colour="accent"
            variant="gradient"
            size="sm"
            Icon={<PlusIconMini />}
          >
            Button sm
          </IconButton>
          <IconButton
            colour="accent"
            variant="gradient"
            Icon={<PlusIconMini />}
          >
            Button md
          </IconButton>
          <IconButton
            colour="accent"
            variant="gradient"
            size="lg"
            Icon={<PlusIconOutline />}
          >
            Button lg
          </IconButton>
          <IconButton
            colour="accent"
            variant="gradient"
            size="xl"
            Icon={<PlusIconOutline />}
          >
            Button xl
          </IconButton>
          <IconButton
            colour="accent"
            variant="gradient"
            Icon={<PlusIconMini />}
            disabled
          >
            Button md
          </IconButton>
        </div>
        <div>
          <IconButton
            colour="accent"
            variant="primary"
            size="xs"
            Icon={<PlusIconMini />}
          >
            Button xs
          </IconButton>
          <IconButton
            colour="accent"
            variant="primary"
            size="sm"
            Icon={<PlusIconMini />}
          >
            Button sm
          </IconButton>
          <IconButton colour="accent" variant="primary" Icon={<PlusIconMini />}>
            Button md
          </IconButton>
          <IconButton
            colour="accent"
            variant="primary"
            size="lg"
            Icon={<PlusIconOutline />}
          >
            Button lg
          </IconButton>
          <IconButton
            colour="accent"
            variant="primary"
            size="xl"
            Icon={<PlusIconOutline />}
          >
            Button xl
          </IconButton>
          <IconButton
            colour="accent"
            variant="primary"
            Icon={<PlusIconMini />}
            disabled
          >
            Button md
          </IconButton>
        </div>
        <div>
          <IconButton
            colour="accent"
            variant="secondary"
            size="xs"
            Icon={<PlusIconMini />}
          >
            Button xs
          </IconButton>
          <IconButton
            colour="accent"
            variant="secondary"
            size="sm"
            Icon={<PlusIconMini />}
          >
            Button sm
          </IconButton>
          <IconButton
            colour="accent"
            variant="secondary"
            Icon={<PlusIconMini />}
          >
            Button md
          </IconButton>
          <IconButton
            colour="accent"
            variant="secondary"
            size="lg"
            Icon={<PlusIconOutline />}
          >
            Button lg
          </IconButton>
          <IconButton
            colour="accent"
            variant="secondary"
            size="xl"
            Icon={<PlusIconOutline />}
          >
            Button xl
          </IconButton>
          <IconButton
            colour="accent"
            variant="secondary"
            Icon={<PlusIconMini />}
            disabled
          >
            Button md
          </IconButton>
        </div>
        <div>
          <IconButton variant="white" size="xs" Icon={<PlusIconMini />}>
            Button xs
          </IconButton>
          <IconButton variant="white" size="sm" Icon={<PlusIconMini />}>
            Button sm
          </IconButton>
          <IconButton variant="white" Icon={<PlusIconMini />}>
            Button md
          </IconButton>
          <IconButton variant="white" size="lg" Icon={<PlusIconOutline />}>
            Button lg
          </IconButton>
          <IconButton variant="white" size="xl" Icon={<PlusIconOutline />}>
            Button xl
          </IconButton>
          <IconButton variant="white" Icon={<PlusIconMini />} disabled>
            Button md
          </IconButton>
        </div>
      </div>
    </div>
  );
};
