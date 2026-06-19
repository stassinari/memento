import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Suspense, useMemo, useState } from "react";
import { BeansQuickList } from "~/components/beans/BeansQuickList";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { CardSkeleton } from "~/components/CardSkeleton";
import { EmptyState } from "~/components/EmptyState";
import { Heading } from "~/components/Heading";
import { getBeansList } from "~/db/queries";
import { BeansListItem } from "~/db/types";
import { useBeanActions } from "~/hooks/useBeanActions";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { getFreshness } from "~/lib/beans";

export const Route = createFileRoute("/_auth/_layout/beans/")({
  component: BeansList,
});

// Kept for `getBeans` (legacy per-state query) which still validates against it.
export type BeansStateName = "Archived" | "Frozen" | "Open";

export const tabStyles = (isSelected: boolean) => [
  "w-1/3 border-b-2 px-1 py-4 text-center text-sm font-medium transition-colors",
  isSelected
    ? "text-orange-600 border-orange-500 dark:text-orange-400 dark:border-orange-400"
    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-400 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500",
];

const beansListQueryOptions = () =>
  queryOptions({
    queryKey: ["beans"],
    queryFn: () => getBeansList(),
  });

// ---- per-tab default sort (no-roast-date always sinks to the bottom) --------

const dateDesc = (a: Date | null, b: Date | null) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return b.getTime() - a.getTime();
};

/** Open → effective age ascending (freshest first), undated last. */
const byFreshness = (a: BeansListItem, b: BeansListItem) =>
  (getFreshness(a).effectiveDays ?? Infinity) - (getFreshness(b).effectiveDays ?? Infinity);

/** Frozen → most recently frozen first. */
const byFreezeDate = (a: BeansListItem, b: BeansListItem) => dateDesc(a.freezeDate, b.freezeDate);

/** History → archive date, falling back to roast date when absent. */
const byArchiveDate = (a: BeansListItem, b: BeansListItem) =>
  dateDesc(a.archiveDate ?? a.roastDate, b.archiveDate ?? b.roastDate);

export function BeansList() {
  const isSm = useScreenMediaQuery("sm");

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.beans]} />

      <Heading
        actionSlot={
          <Button variant="primary" colour="accent" size={isSm ? "md" : "sm"} asChild>
            <Link to="/beans/add">Add beans </Link>
          </Button>
        }
      >
        Beans
      </Heading>

      <Suspense
        fallback={
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <BeansListContent />
      </Suspense>
    </>
  );
}

function BeansListContent() {
  const { data: allBeans } = useSuspenseQuery(beansListQueryOptions());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const actions = useBeanActions();

  const { open, frozen, history } = useMemo(() => {
    const open = allBeans.filter((b) => b.isOpen).sort(byFreshness);
    const frozen = allBeans.filter((b) => b.isFrozen).sort(byFreezeDate);
    // History defaults to the archived cellar; Open/Frozen are folded in later
    // via the status filter (Phase 4).
    const history = allBeans.filter((b) => b.isArchived).sort(byArchiveDate);
    return { open, frozen, history };
  }, [allBeans]);

  const tabs = [
    {
      name: "Open",
      count: open.length,
      content:
        open.length > 0 ? (
          <BeansQuickList beans={open} actions={actions} />
        ) : (
          <EmptyState
            title="No open beans"
            description="Get started by adding some coffee beans"
            button={{ label: "Add beans", link: "/beans/add" }}
          />
        ),
    },
    {
      name: "Frozen",
      count: frozen.length,
      content:
        frozen.length > 0 ? (
          <BeansQuickList beans={frozen} actions={actions} />
        ) : (
          <EmptyState title="No frozen beans" description="Freeze beans for them to appear here." />
        ),
    },
    {
      name: "History",
      count: history.length,
      content:
        history.length > 0 ? (
          <BeansQuickList beans={history} actions={actions} />
        ) : (
          <EmptyState title="No archived beans" description="Beans you archive will appear here." />
        ),
    },
  ];

  return (
    <div className="mt-2">
      {actions.deleteErrorModal}
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList className="flex -mb-px">
          {tabs.map(({ name, count }, i) => (
            <Tab key={name} className={clsx(tabStyles(selectedIndex === i))}>
              {name}{" "}
              <span className="ml-1 tabular-nums text-gray-400 dark:text-gray-500">{count}</span>
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-4">
          {tabs.map((t) => (
            <TabPanel key={t.name}>{t.content}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
