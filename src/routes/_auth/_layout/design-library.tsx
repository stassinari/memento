import {
  AcademicCapIcon,
  BeakerIcon,
  BugAntIcon,
  ChartPieIcon,
  FireIcon,
  MapPinIcon,
  PlusCircleIcon,
  PlusIcon as PlusIconMini,
} from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  PlusIcon as PlusIconOutline,
} from "@heroicons/react/24/outline";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { atom } from "jotai";
import { HTMLAttributes, useState } from "react";
import toast from "react-hot-toast";

import {
  Badge,
  BadgePlusIcon,
  BadgeTimesIcon,
} from "../../../components/Badge";
import { navLinks } from "../../../components/BottomNav";
import {
  BreadcrumbsWithHome,
  BreadcrumbsWithoutHome,
} from "../../../components/Breadcrumbs";
import { Button } from "../../../components/Button";
import { ButtonWithDropdown } from "../../../components/ButtonWithDropdown";
import { Card } from "../../../components/Card";
import { ComboboxMulti } from "../../../components/Combobox/ComboboxMulti";
import { ComboboxSingle } from "../../../components/Combobox/ComboboxSingle";
import { Heading } from "../../../components/Heading";
import { IconButton } from "../../../components/IconButton";
import { InputRadio } from "../../../components/InputRadio";
import { InputRadioButtonGroup } from "../../../components/InputRadioButtonGroup";
import {
  InputRadioCards,
  InputRadioCardsOption,
} from "../../../components/InputRadioCards";
import { ListCard } from "../../../components/ListCard";
import {
  ExampleDialogContent,
  LoremIpsum,
  Modal,
  RadixModal,
} from "../../../components/Modal";
import { notification } from "../../../components/Notification";
import { Stopwatch } from "../../../components/Stopwatch";
import { Textarea } from "../../../components/Textarea";
import { Toggle } from "../../../components/Toggle";
import { DrinkRatio } from "../../../components/drinks/DrinkRatio";
import { BeanBagIcon } from "../../../components/icons/BeanBagIcon";
import { BeanIcon } from "../../../components/icons/BeanIcon";
import { DripperIcon } from "../../../components/icons/DripperIcon";
import { DropIcon } from "../../../components/icons/DropIcon";
import { PortafilterIcon } from "../../../components/icons/PortafilterIcon";

export const Route = createFileRoute("/_auth/_layout/design-library")({
  component: DesignLibrary,
});

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
      bottom: <>8GB / 4 CPUs &middot; 160 GB SSD disk</>,
    },
    right: { top: "$40", bottom: "/mo" },
  },
  {
    value: "startup",
    left: {
      top: "Startup",
      bottom: <>12GB / 6 CPUs &middot; 256 GB SSD disk</>,
    },
    right: { top: "$80", bottom: "/mo" },
  },
  {
    value: "business",
    left: {
      top: "Business",
      bottom: <>16GB / 8 CPUs &middot; 512 GB SSD disk</>,
    },
    right: { top: "$160", bottom: "/mo" },
  },
  {
    value: "enterprise",
    left: {
      top: "Enterprise",
      bottom: <>32GB / 12 CPUs &middot; 1024 GB SSD disk</>,
    },
    right: { top: "$240", bottom: "/mo" },
  },
];

const designLibraryStopwatchAtom = atom<boolean>(false);

function DesignLibrary() {
  const [singleValue, setSingleValue] = useState<string>();
  const [multiValues, setMultiValues] = useState<string[]>([]);

  const [, setSeconds] = useState(0);
  const [, setMinutes] = useState(0);

  const [switchEnabled, setSwitchEnabled] = useState(false);

  const [formRadioCardValue, setFormRadioCardValue] = useState(
    radioCardOptions[1],
  );

  const [radioButtonGroupValue, setRadioButtonGroupValue] = useState<string>();

  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);

  const [isTwRadixModalOpen, setIsTwRadixModalOpen] = useState(false);
  const [isLongRadixModalOpen, setIsLongRadixModalOpen] = useState(false);

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.designLibrary]} />

      <Heading>Design library</Heading>

      <div className="space-y-8">
        <div>
          <p>Breadcrumbs</p>
          <BreadcrumbsWithoutHome
            items={[
              { label: "Drinks", linkTo: "/drinks" },
              { label: "Brews", linkTo: "/drinks/brews" },
              { label: "Brew details", linkTo: "#" },
            ]}
          />
          <BreadcrumbsWithHome
            items={[
              { label: "Drinks", linkTo: "/drinks" },
              { label: "Brews", linkTo: "/drinks/brews" },
              { label: "Brew details", linkTo: "#" },
            ]}
          />
        </div>

        <div>
          <p>Drink ratio prototype WIP</p>
          <DrinkRatio beans={14.7} water={249.2} />
        </div>

        <div>
          <p>List Cards</p>

          <div className="space-y-4">
            {/* Example ListCard */}
            <ListCard
              linkTo="#"
              footerSlot={
                <ListCard.Footer
                  text="Fake footer"
                  Icon={<AcademicCapIcon />}
                />
              }
            >
              <div className="flex">
                <div className="grow">
                  <ListCard.Title>Card title</ListCard.Title>
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <BugAntIcon />
                    </ListCard.RowIcon>
                    Some info here
                  </ListCard.Row>
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <BeakerIcon />
                    </ListCard.RowIcon>
                    1st thing : 2nd thing
                    <ListCard.RowIcon>
                      <ChartPieIcon />
                    </ListCard.RowIcon>
                  </ListCard.Row>
                </div>
                <div>
                  <ListCard.Rating>N/A</ListCard.Rating>
                </div>
              </div>
            </ListCard>

            {/* Brew ListCard */}
            <ListCard
              linkTo="#"
              footerSlot={
                <ListCard.Footer
                  text="Brewed at 08:10"
                  Icon={<DripperIcon />}
                />
              }
            >
              <div className="flex">
                <div className="grow">
                  <ListCard.Title>V60 V2</ListCard.Title>
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <BeanBagIcon variant="solid" />
                    </ListCard.RowIcon>
                    Gitwe
                  </ListCard.Row>
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <BeanIcon />
                    </ListCard.RowIcon>
                    30g : 501ml
                    <ListCard.RowIcon>
                      <DropIcon />
                    </ListCard.RowIcon>
                  </ListCard.Row>
                </div>
                <div>
                  <ListCard.Rating>7.5</ListCard.Rating>
                </div>
              </div>
            </ListCard>

            {/* Espresso ListCard */}
            <ListCard
              linkTo="#"
              footerSlot={
                <ListCard.Footer
                  text="Pulled at 17:56"
                  Icon={<PortafilterIcon />}
                />
              }
            >
              <div className="flex">
                <div className="grow">
                  <ListCard.Title>Extractamundo Dos!</ListCard.Title>
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <BeanBagIcon variant="solid" />
                    </ListCard.RowIcon>
                    El Ubérrimo Gesha
                  </ListCard.Row>
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <BeanIcon />
                    </ListCard.RowIcon>
                    18g : 48g
                    <ListCard.RowIcon>
                      <DropIcon />
                    </ListCard.RowIcon>
                  </ListCard.Row>
                </div>
                <div>
                  <ListCard.Rating>8.5</ListCard.Rating>
                </div>
              </div>
            </ListCard>

            {/* Beans ListCard */}
            <ListCard
              linkTo="#"
              footerSlot={
                <ListCard.Footer
                  text="Roasted 18 days ago"
                  Icon={<BeanIcon />}
                />
              }
            >
              <div className="flex">
                <div className="grow">
                  <ListCard.Title>Luiz Guzman</ListCard.Title>
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <FireIcon />
                    </ListCard.RowIcon>
                    Prodigal Coffee
                  </ListCard.Row>
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <MapPinIcon />
                    </ListCard.RowIcon>
                    Colombia - Washed
                    <ListCard.RowIcon>
                      <BeakerIcon />
                    </ListCard.RowIcon>
                  </ListCard.Row>
                </div>
                {/* <div>
                  <ListCard.Rating>8.5</ListCard.Rating>
                </div> */}
              </div>
            </ListCard>
          </div>
        </div>
        <div>
          <p>Button with dropdown</p>
          <ButtonWithDropdown
            mainButton={{ type: "link", label: "Clone", href: "#" }}
            dropdownItems={[
              { type: "link", label: "Edit details", href: "#" },
              { type: "link", label: "Edit outcome", href: "#" },
              {
                type: "button",
                label: "Delete",
                onClick: () => {
                  console.log("Delete");
                },
              },
            ]}
          />
        </div>
        <div>
          <p>Modals</p>
          <div>
            <Button
              variant="primary"
              onClick={() => setIsExampleModalOpen(true)}
            >
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
        <div className="space-y-4">
          <Card>This is a base card</Card>
        </div>
        <div>
          <Stopwatch
            atom={designLibraryStopwatchAtom}
            setFormSeconds={setSeconds}
            setFormMinutes={setMinutes}
          />
        </div>
        <div className="flex gap-4">
          <Toggle checked={switchEnabled} onChange={setSwitchEnabled} />
          <Toggle
            checked={switchEnabled}
            onChange={setSwitchEnabled}
            colour="accent"
          />
        </div>
        <div className="space-y-4">
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
          <Textarea />
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
          <div className="flex flex-col overflow-hidden rounded-md w-min">
            <div className="flex items-center h-12 pl-6 text-sm font-medium text-white bg-orange-600 w-72">
              Primary <span className="ml-3 uppercase">#ea580c</span>{" "}
              {/* FIXME better tw theme theme`colors.orange.600` */}
            </div>
            <div className="flex items-center h-12 pl-6 text-sm font-medium text-black bg-orange-300 w-72">
              Primary alt
              <span className="ml-3 uppercase">#fdba74</span>
              {/* FIXME better tw theme theme`colors.orange.300` */}
            </div>
            <div className="flex items-center h-12 pl-6 text-sm font-medium text-white bg-blue-600 w-72">
              Secondary <span className="ml-3 uppercase">#2563eb</span>
              {/* FIXME better tw theme theme`colors.blue.600` */}
            </div>
            <div className="flex items-center h-12 pl-6 text-sm font-medium text-black bg-blue-300 w-72">
              Secondary alt
              <span className="ml-3 uppercase">#93c5fd</span>
              {/* FIXME better tw theme theme`colors.blue.300` */}
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
        <div className="space-y-2">
          <h2>Buttons</h2>
          <div className="space-x-2">
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
          <div className="space-x-2">
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
          <div className="space-x-2">
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
          <div className="space-x-2">
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
          <div className="space-x-2">
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
          <div className="space-x-2">
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
          <div className="space-x-2">
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
          <div className="space-x-2">
            <Button variant="primary" size="xs">
              <PlusCircleIcon /> Button xs
            </Button>
            <Button variant="primary" size="sm">
              <PlusCircleIcon />
              Button sm
            </Button>
            <Button variant="primary">
              <PlusCircleIcon />
              Button md
            </Button>
            <Button variant="primary" size="lg">
              <PlusCircleIcon />
              Button lg
            </Button>
            <Button variant="primary" size="xl">
              <PlusCircleIcon />
              Button xl
            </Button>
            <Button variant="primary" disabled>
              <PlusCircleIcon />
              Button md
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="secondary" size="xs">
              <PlusCircleIcon />
              Button xs
            </Button>
            <Button variant="secondary" size="sm">
              <PlusCircleIcon />
              Button sm
            </Button>
            <Button variant="secondary">
              <PlusCircleIcon />
              Button md
            </Button>
            <Button variant="secondary" size="lg">
              <PlusCircleIcon />
              Button lg
            </Button>
            <Button variant="secondary" size="xl">
              <PlusCircleIcon />
              Button xl
            </Button>
            <Button variant="secondary" disabled>
              <PlusCircleIcon />
              Button md
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="white" size="xs">
              <PlusCircleIcon />
              Button xs
            </Button>
            <Button variant="white" size="sm">
              <PlusCircleIcon />
              Button sm
            </Button>
            <Button variant="white">
              <PlusCircleIcon />
              Button md
            </Button>
            <Button variant="white" size="lg">
              <PlusCircleIcon />
              Button lg
            </Button>
            <Button variant="white" size="xl">
              <PlusCircleIcon />
              Button xl
            </Button>
            <Button variant="white" disabled>
              <PlusCircleIcon />
              Button md
            </Button>
          </div>
        </div>
        <div>
          <h2>IconButtons</h2>
          <div>
            <IconButton variant="gradient" size="xs">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="gradient" size="sm">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="gradient">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="gradient" size="lg">
              <PlusIconOutline />
            </IconButton>
            <IconButton variant="gradient" size="xl">
              <PlusIconOutline />
            </IconButton>
            <IconButton variant="gradient" disabled>
              <PlusIconMini />
            </IconButton>
          </div>
          <div>
            <IconButton variant="primary" size="xs">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="primary" size="sm">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="primary">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="primary" size="lg">
              <PlusIconOutline />
            </IconButton>
            <IconButton variant="primary" size="xl">
              <PlusIconOutline />
            </IconButton>
            <IconButton variant="primary" disabled>
              <PlusIconMini />
            </IconButton>
          </div>
          <div>
            <IconButton variant="secondary" size="xs">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="secondary" size="sm">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="secondary">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="secondary" size="lg">
              <PlusIconOutline />
            </IconButton>
            <IconButton variant="secondary" size="xl">
              <PlusIconOutline />
            </IconButton>
            <IconButton variant="secondary" disabled>
              <PlusIconMini />
            </IconButton>
          </div>
          <div>
            <IconButton colour="accent" variant="gradient" size="xs">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="gradient" size="sm">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="gradient">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="gradient" size="lg">
              <PlusIconOutline />
            </IconButton>
            <IconButton colour="accent" variant="gradient" size="xl">
              <PlusIconOutline />
            </IconButton>
            <IconButton colour="accent" variant="gradient" disabled>
              <PlusIconMini />
            </IconButton>
          </div>
          <div>
            <IconButton colour="accent" variant="primary" size="xs">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="primary" size="sm">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="primary">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="primary" size="lg">
              <PlusIconOutline />
            </IconButton>
            <IconButton colour="accent" variant="primary" size="xl">
              <PlusIconOutline />
            </IconButton>
            <IconButton colour="accent" variant="primary" disabled>
              <PlusIconMini />
            </IconButton>
          </div>
          <div>
            <IconButton colour="accent" variant="secondary" size="xs">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="secondary" size="sm">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="secondary">
              <PlusIconMini />
            </IconButton>
            <IconButton colour="accent" variant="secondary" size="lg">
              <PlusIconOutline />
            </IconButton>
            <IconButton colour="accent" variant="secondary" size="xl">
              <PlusIconOutline />
            </IconButton>
            <IconButton colour="accent" variant="secondary" disabled>
              <PlusIconMini />
            </IconButton>
          </div>
          <div>
            <IconButton variant="white" size="xs">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="white" size="sm">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="white">
              <PlusIconMini />
            </IconButton>
            <IconButton variant="white" size="lg">
              <PlusIconOutline />
            </IconButton>
            <IconButton variant="white" size="xl">
              <PlusIconOutline />
            </IconButton>
            <IconButton variant="white" disabled>
              <PlusIconMini />
            </IconButton>
          </div>
        </div>

        <div>
          Colour palette
          <div className="flex gap-2">
            <div>
              Brown - TW
              <ColourShade className="bg-tw-brown-50">50</ColourShade>
              <ColourShade className="bg-tw-brown-100">100</ColourShade>
              <ColourShade className="bg-tw-brown-200">200</ColourShade>
              <ColourShade className="bg-tw-brown-300">300</ColourShade>
              <ColourShade className="bg-tw-brown-400">400</ColourShade>
              <ColourShade className="bg-tw-brown-500">500</ColourShade>
              <ColourShade className="text-white bg-tw-brown-600">
                600
              </ColourShade>
              <ColourShade className="text-white bg-tw-brown-700">
                700
              </ColourShade>
              <ColourShade className="text-white bg-tw-brown-800">
                800
              </ColourShade>
              <ColourShade className="text-white bg-tw-brown-900">
                900
              </ColourShade>
            </div>
            <div>
              Brown - Material
              <ColourShade className="bg-mui-brown-50">50</ColourShade>
              <ColourShade className="bg-mui-brown-100">100</ColourShade>
              <ColourShade className="bg-mui-brown-200">200</ColourShade>
              <ColourShade className="text-white bg-mui-brown-300">
                300
              </ColourShade>
              <ColourShade className="text-white bg-mui-brown-400">
                400
              </ColourShade>
              <ColourShade className="text-white bg-mui-brown-500">
                500
              </ColourShade>
              <ColourShade className="text-white bg-mui-brown-600">
                600
              </ColourShade>
              <ColourShade className="text-white bg-mui-brown-700">
                700
              </ColourShade>
              <ColourShade className="text-white bg-mui-brown-800">
                800
              </ColourShade>
              <ColourShade className="text-white bg-mui-brown-900">
                900
              </ColourShade>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ColourShade = ({
  className,
  children,
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "flex items-center justify-center w-32 h-8 text-sm",
      className,
    )}
  >
    {children}
  </div>
);
