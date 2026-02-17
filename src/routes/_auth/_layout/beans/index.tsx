import { Tab, TabGroup, TabList, TabPanels } from "@headlessui/react";
import {
  queryOptions,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { ReactNode, useState } from "react";
import { BeansCard } from "~/components/beans/BeansCard";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { EmptyState } from "~/components/EmptyState";
import { Heading } from "~/components/Heading";
import { getBeansArchived, getBeansFrozen, getBeansOpen } from "~/db/queries";
import type { Beans } from "~/db/types";
import { userAtom } from "~/hooks/useInitUser";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

const beansOpenQueryOptions = (firebaseUid: string) =>
  queryOptions<Beans[]>({
    queryKey: ["beans", "open"],
    queryFn: () => getBeansOpen({ data: firebaseUid }),
  });

const beansFrozenQueryOptions = (firebaseUid: string) =>
  queryOptions<Beans[]>({
    queryKey: ["beans", "frozen"],
    queryFn: () => getBeansFrozen({ data: firebaseUid }),
  });

const beansArchivedQueryOptions = (firebaseUid: string) =>
  queryOptions<Beans[]>({
    queryKey: ["beans", "archived"],
    queryFn: () => getBeansArchived({ data: firebaseUid }),
  });

export const Route = createFileRoute("/_auth/_layout/beans/")({
  component: BeansList,
});

type BeansTab = {
  name: "Archived" | "Frozen" | "Open";
  drizzleQuery: (uid: string) => UseSuspenseQueryOptions<Beans[]>;
  EmptyState: ReactNode;
};

const tabs: BeansTab[] = [
  {
    name: "Open",
    drizzleQuery: beansOpenQueryOptions,
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
    drizzleQuery: beansFrozenQueryOptions,
    EmptyState: (
      <EmptyState
        title="No frozen beans"
        description="Freeze beans for them to appear here."
      />
    ),
  },
  {
    name: "Archived",
    drizzleQuery: beansArchivedQueryOptions,
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
              <Tab.Panel key={t.name}>
                <BeansTabContent
                  drizzleQuery={tabs[i].drizzleQuery}
                  EmptyState={tabs[i].EmptyState}
                />
              </Tab.Panel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </>
  );
}

export interface BeansTabContentProps {
  drizzleQuery: (uid: string) => UseSuspenseQueryOptions<Beans[]>;
  EmptyState: ReactNode;
}

export const BeansTabContent = ({
  drizzleQuery,
  EmptyState,
}: BeansTabContentProps) => {
  const user = useAtomValue(userAtom);

  const { data: beansList } = useSuspenseQuery(drizzleQuery(user?.uid ?? ""));

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
