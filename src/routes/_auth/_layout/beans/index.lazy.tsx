import { Tab } from "@headlessui/react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import clsx from "clsx";
import { orderBy, where } from "firebase/firestore";
import { useState } from "react";
import { navLinks } from "../../../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../../../components/Breadcrumbs";
import { Button } from "../../../../components/Button";
import { EmptyState } from "../../../../components/EmptyState";
import { Heading } from "../../../../components/Heading";
import useScreenMediaQuery from "../../../../hooks/useScreenMediaQuery";
import {
  BeansTab,
  BeansTabProps,
} from "../../../../pages/beans/BeansList/BeansTab";

export const Route = createLazyFileRoute("/_auth/_layout/beans/")({
  component: BeansList,
});

const tabs: BeansTabProps[] = [
  {
    name: "Open",
    filters: [where("isFinished", "==", false)],
    removeFrozen: true,
    EmptyState: (
      <EmptyState
        title="No open beans"
        description="Get started by adding some coffee beans"
        buttonLabel="Add beans"
      />
    ),
  },
  {
    name: "Frozen",
    filters: [
      orderBy("freezeDate", "desc"),
      where("isFinished", "==", false),
      where("freezeDate", "!=", null),
      where("thawDate", "==", null),
    ],
    EmptyState: (
      <EmptyState
        title="No frozen beans"
        description="Freeze beans for them to appear here."
      />
    ),
  },
  {
    name: "Archived",
    filters: [where("isFinished", "==", true)],
    EmptyState: (
      <EmptyState
        title="No archived beans"
        description="Beans you archive will appear here."
      />
    ),
  },
];

const tabStyles = (isSelected: boolean) => [
  "w-1/3 px-1 py-4 text-sm font-medium text-center border-b-2",
  isSelected
    ? "text-orange-600 border-orange-500"
    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300",
];

export function BeansList() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isSm = useScreenMediaQuery("sm");

  console.log("BeansList");

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.beans]} />

      <Heading
        actionSlot={
          <Button
            variant="primary"
            colour="accent"
            size={isSm ? "md" : "sm"}
            asChild
          >
            <Link to="/beans/add">Add beans </Link>
          </Button>
        }
      >
        Beans
      </Heading>

      <div className="mt-2">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex -mb-px">
            {tabs.map(({ name }, i) => (
              <Tab key={name} className={clsx(tabStyles(selectedIndex === i))}>
                {name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {tabs.map((t, i) => (
              <Tab.Panel key={t.name}>
                <BeansTab
                  name={tabs[i].name}
                  filters={tabs[i].filters}
                  removeFrozen={tabs[i].removeFrozen}
                  EmptyState={tabs[i].EmptyState}
                />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}

BeansList;
