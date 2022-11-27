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
import "twin.macro";
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
import { ExampleDialogContent, Modal } from "../components/Modal";
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
  const [isVeryLongModal, setIsVeryLongModal] = useState(false);

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
          <Button variant="primary" onClick={() => setIsVeryLongModal(true)}>
            Open long modal
          </Button>
          <Modal
            open={isVeryLongModal}
            handleClose={() => setIsVeryLongModal(false)}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            vel est quis leo cursus euismod. Integer porta eros id risus
            fermentum, in sodales dui ultrices. Proin ut augue nec ex bibendum
            lobortis in non erat. Proin enim lorem, mollis nec tempor sed,
            iaculis vitae sem. Ut porttitor euismod felis, et finibus sapien
            efficitur ut. Praesent iaculis, felis ut vulputate consequat, urna
            augue porta justo, nec malesuada justo magna eget nulla. Nullam
            tristique metus nibh, at commodo lectus pellentesque eu. Aliquam
            commodo lorem orci, at efficitur elit semper quis. Nullam eu nibh ac
            purus venenatis pulvinar eu quis nisi. Donec in egestas lectus, et
            pulvinar velit. Cras venenatis lectus ac nibh pulvinar, et gravida
            tortor eleifend. Aliquam erat volutpat. Aenean vitae quam dui.
            Aliquam sodales nulla ut orci tempus, ut maximus quam elementum.
            Suspendisse potenti. Fusce tincidunt vel est quis pulvinar.
            Pellentesque mollis, sapien in scelerisque laoreet, diam nulla
            blandit urna, eget condimentum lectus velit nec est. Duis sit amet
            erat semper, mollis leo id, posuere felis. Cras finibus mauris eros,
            pulvinar finibus ex dictum ut. Suspendisse in ex semper, feugiat
            arcu a, tincidunt diam. Ut sit amet euismod tellus, a eleifend
            sapien. In quis odio quam. Maecenas vel auctor est. Suspendisse
            potenti. Suspendisse quis nisl ut ex laoreet sagittis vitae
            vestibulum libero. Pellentesque quam diam, condimentum in auctor
            quis, rhoncus at orci. Pellentesque eget iaculis est, sit amet
            placerat neque. Nulla neque lorem, tempor et pretium eget, laoreet
            nec neque. Aliquam id orci ut nibh ultrices porta at id quam. Cras
            venenatis, nisl non consectetur semper, felis felis scelerisque
            eros, quis egestas lacus erat a urna. Phasellus ut maximus massa.
            Nulla lobortis justo quis dolor fermentum, et rutrum nisl
            ullamcorper. Curabitur a pretium ligula. Quisque condimentum
            imperdiet erat sed tincidunt. Proin quis ante sit amet libero tempor
            tempor non nec nunc. Phasellus ut fermentum ex. Suspendisse in
            varius massa. Donec sed viverra neque. Suspendisse augue ante,
            lobortis in luctus nec, aliquam in risus. Vestibulum at nulla nunc.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Vestibulum tempus metus quis ex consectetur,
            quis fringilla ligula dictum. Suspendisse sit amet turpis elementum,
            rutrum tellus porta, lobortis risus. Sed nec lectus consectetur,
            consequat magna ut, varius eros. Cras viverra turpis ac turpis
            consectetur dapibus. Mauris varius ante at erat condimentum, ut
            rutrum tortor accumsan. Nullam vitae neque non purus mollis semper
            vitae non nunc. Donec non velit ut dolor pulvinar ornare vel eu
            erat. Nulla aliquet eleifend libero sit amet posuere. Aliquam nunc
            libero, tempor quis nulla in, blandit faucibus neque. Nunc quis
            metus eu metus tristique euismod. Aenean ultrices volutpat nunc, et
            tincidunt nisi ornare et. Nullam vestibulum sagittis semper.
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras
            consectetur magna ac nunc interdum rhoncus. Fusce turpis massa,
            pharetra in sollicitudin ac, sagittis ac metus. Nunc molestie magna
            placerat, rutrum mauris sit amet, faucibus est. Quisque volutpat
            tincidunt turpis, eu laoreet dolor porta quis.
          </Modal>
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
