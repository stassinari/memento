import { Tab } from "@headlessui/react";
import { BeakerIcon, FireIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import clsx from "clsx";
import { orderBy, QueryConstraint, where } from "firebase/firestore";
import { ReactNode, useState } from "react";
import { navLinks } from "../../../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../../../components/Breadcrumbs";
import { Button } from "../../../../components/Button";
import { EmptyState } from "../../../../components/EmptyState";
import { Heading } from "../../../../components/Heading";
import { BeanIcon } from "../../../../components/icons/BeanIcon";
import { ListCard } from "../../../../components/ListCard";
import { useCollectionQuery } from "../../../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../../../hooks/firestore/useFirestoreCollectionRealtime";
import useScreenMediaQuery from "../../../../hooks/useScreenMediaQuery";
import { Beans } from "../../../../types/beans";
import { getTimeAgo, isNotFrozenOrIsThawed } from "../../../../util";

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
        button={{ label: "Add beans", link: "/beans/add" }}
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

export const tabStyles = (isSelected: boolean) => [
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

export interface BeansTabProps {
  name: "Archived" | "Frozen" | "Open";
  filters: QueryConstraint[];
  removeFrozen?: boolean;
  EmptyState: ReactNode;
}

export const BeansTab = ({
  filters,
  removeFrozen,
  EmptyState,
}: BeansTabProps) => {
  console.log("BeansTab");

  const query = useCollectionQuery<Beans>("beans", filters);
  const { list: beansList, isLoading } =
    useFirestoreCollectionRealtime<Beans>(query);

  if (isLoading) return null;

  const sortedAndFiltered = beansList
    .sort((a, b) =>
      (a.roastDate?.toDate() ?? 0) < (b.roastDate?.toDate() ?? 0) ? 1 : -1,
    )
    .filter(removeFrozen ? isNotFrozenOrIsThawed : () => true);

  if (sortedAndFiltered.length === 0) return <>{EmptyState}</>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {sortedAndFiltered.map((beans) => (
        <li key={beans.id}>
          <BeansCard beans={beans} />
        </li>
      ))}
    </ul>
  );
};

type BeansCardProps = {
  beans: Beans;
};

export const BeansCard = ({ beans }: BeansCardProps) => {
  return (
    <ListCard
      linkTo={`/beans/${beans.id ?? ""}`}
      footerSlot={
        beans.roastDate ? (
          <ListCard.Footer
            text={`Roasted ${getTimeAgo(beans.roastDate.toDate())}`}
            Icon={<BeanIcon />}
          />
        ) : undefined
      }
    >
      <div className="flex">
        <div className="grow">
          <ListCard.Title>{beans.name}</ListCard.Title>
          <ListCard.Row>
            <ListCard.RowIcon>
              <FireIcon />
            </ListCard.RowIcon>
            {beans.roaster}
          </ListCard.Row>
          {beans.origin === "single-origin" ? (
            <>
              {beans.country && (
                <ListCard.Row>
                  <ListCard.RowIcon>
                    <MapPinIcon />
                  </ListCard.RowIcon>
                  {beans.country}
                </ListCard.Row>
              )}
              {beans.process && (
                <ListCard.Row>
                  <ListCard.RowIcon>
                    <BeakerIcon />
                  </ListCard.RowIcon>
                  {beans.process}
                </ListCard.Row>
              )}
            </>
          ) : (
            <ListCard.Row>
              <ListCard.RowIcon>
                <MapPinIcon />
              </ListCard.RowIcon>
              Blend
            </ListCard.Row>
          )}
        </div>
      </div>
    </ListCard>
  );
};
