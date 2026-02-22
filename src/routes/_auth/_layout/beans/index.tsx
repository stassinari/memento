import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ReactNode, Suspense, useState } from "react";
import { BeansCard } from "~/components/beans/BeansCard";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { CardSkeleton } from "~/components/CardSkeleton";
import { EmptyState } from "~/components/EmptyState";
import { Heading } from "~/components/Heading";
import { getBeans } from "~/db/queries";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

export const Route = createFileRoute("/_auth/_layout/beans/")({
  component: BeansList,
});

export type BeansStateName = "Archived" | "Frozen" | "Open";

type BeansTab = {
  name: BeansStateName;
  numberOfLoadingCards: number;
  EmptyState: ReactNode;
};

const tabs: BeansTab[] = [
  {
    name: "Open",
    numberOfLoadingCards: 5,
    EmptyState: (
      <EmptyState
        title="No open beans"
        description="Get started by adding some coffee beans"
        button={{ label: "Add beans", link: "/beans/add" }}
      />
    ),
  },
  {
    name: "Frozen",
    numberOfLoadingCards: 3,
    EmptyState: (
      <EmptyState
        title="No frozen beans"
        description="Freeze beans for them to appear here."
      />
    ),
  },
  {
    name: "Archived",
    numberOfLoadingCards: 13,
    EmptyState: (
      <EmptyState
        title="No archived beans"
        description="Beans you archive will appear here."
      />
    ),
  },
];

export const tabStyles = (isSelected: boolean) => [
  "w-1/3 px-1 py-4 text-sm font-medium text-center border-b-2",
  isSelected
    ? "text-orange-600 border-orange-500"
    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300",
];

export function BeansList() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isSm = useScreenMediaQuery("sm");

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
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="flex -mb-px">
            {tabs.map(({ name }, i) => (
              <Tab key={name} className={clsx(tabStyles(selectedIndex === i))}>
                {name}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-4">
            {tabs.map((t, i) => (
              <TabPanel key={t.name}>
                <Suspense
                  fallback={
                    <ul className="grid gap-4 sm:grid-cols-2">
                      {Array.from({ length: t.numberOfLoadingCards }).map(
                        (_, index) => (
                          <li key={index}>
                            <CardSkeleton />
                          </li>
                        ),
                      )}
                    </ul>
                  }
                >
                  <BeansTabContent
                    name={t.name}
                    EmptyState={tabs[i].EmptyState}
                  />
                </Suspense>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
        {/* </Suspense> */}
      </div>
    </>
  );
}

export interface BeansTabContentProps {
  name: BeansStateName;
  EmptyState: ReactNode;
}

export const BeansTabContent = ({ name, EmptyState }: BeansTabContentProps) => {
  const { data: beansList } = useSuspenseQuery({
    queryKey: ["beans", name.toLowerCase()],
    queryFn: () =>
      getBeans({ data: { state: name } }),
  });

  if (beansList.length === 0) return <>{EmptyState}</>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {beansList.map((beans) => (
        <li key={beans.id}>
          <BeansCard beans={beans} />
        </li>
      ))}
    </ul>
  );
};
