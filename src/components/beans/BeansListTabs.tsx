import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ReactNode, useMemo } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { EmptyState } from "~/components/EmptyState";
import { Heading } from "~/components/Heading";
import { tabStyles } from "~/components/tabStyles";
import { BeansListState, getBeansCounts, getBeansList } from "~/db/queries";
import { useBeanActions } from "~/hooks/useBeanActions";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { compareByFreezeDate, compareByFreshness } from "~/lib/beans";
import { BeansQuickList, BeansQuickListSkeleton } from "./BeansQuickList";
import { BeansHistorySkeleton } from "./history/BeansHistorySkeleton";

// Query keys are all prefixed ["beans", …] so the lifecycle mutations'
// `invalidateQueries({ queryKey: ["beans"] })` refreshes every tab + the counts.
export const beansCountsQueryOptions = () =>
  queryOptions({ queryKey: ["beans", "counts"], queryFn: () => getBeansCounts() });

export const beansListQueryOptions = (state: BeansListState) =>
  queryOptions({
    queryKey: ["beans", "list", state.toLowerCase()],
    queryFn: () => getBeansList({ data: { state } }),
  });

type TabKey = "open" | "frozen" | "history";

const TABS: { key: TabKey; label: string; to: string }[] = [
  { key: "open", label: "Open", to: "/beans/open" },
  { key: "frozen", label: "Frozen", to: "/beans/frozen" },
  { key: "history", label: "History", to: "/beans/history" },
];

interface BeansListTabsProps {
  activeTab: TabKey;
  children: ReactNode;
}

/**
 * Shared chrome for the three Beans list tabs: breadcrumb, heading + Add, and
 * the tab strip with live counts. Each tab is its own route (so browser-back
 * lands where you expect), and only loads its own slice — the counts come from
 * one cheap dedicated query so every tab can show all three badges.
 */
export const BeansListTabs = ({ activeTab, children }: BeansListTabsProps) => {
  const isSm = useScreenMediaQuery("sm");
  const { data: counts } = useQuery(beansCountsQueryOptions());

  const countFor = (key: TabKey) =>
    key === "open" ? counts?.open : key === "frozen" ? counts?.frozen : counts?.archived;

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

      <div className="mt-2 border-b border-gray-200 dark:border-white/10">
        {/* Mobile: even thirds across the width. Tablet+: fixed equal widths so
            they don't stretch silly-wide on a big screen. */}
        <nav className="-mb-px flex">
          {TABS.map((tab) => {
            const count = countFor(tab.key);
            return (
              <Link
                key={tab.key}
                to={tab.to}
                className={clsx(tabStyles(activeTab === tab.key), "flex-1 sm:w-32 sm:flex-none")}
              >
                {tab.label}
                {count !== undefined && (
                  <span className="ml-1.5 tabular-nums text-gray-400 dark:text-gray-500">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-4">{children}</div>
    </>
  );
};

/**
 * Open/Frozen tab body: fetch the slice, sort it, render the quick list (or the
 * empty state). History has its own body (the table) so it isn't handled here.
 */
export const BeansQuickListTab = ({
  state,
  emptyState,
}: {
  state: Extract<BeansListState, "Open" | "Frozen">;
  emptyState: ReactNode;
}) => {
  const { data } = useSuspenseQuery(beansListQueryOptions(state));
  const actions = useBeanActions();

  const comparator = state === "Open" ? compareByFreshness : compareByFreezeDate;
  const sorted = useMemo(() => [...data].sort(comparator), [data, comparator]);

  if (sorted.length === 0) return <>{emptyState}</>;

  return (
    <>
      {actions.deleteErrorModal}
      <BeansQuickList beans={sorted} actions={actions} />
    </>
  );
};

// Shared empty states, exported so each route can pass the right one.
export const openEmptyState = (
  <EmptyState
    title="No open beans"
    description="Get started by adding some coffee beans"
    button={{ label: "Add beans", link: "/beans/add" }}
  />
);

export const frozenEmptyState = (
  <EmptyState title="No frozen beans" description="Freeze beans for them to appear here." />
);

/** List-shaped loading state. Sizes the placeholder rows to the tab's real
 *  count (from the already-cheap counts query) when known, clamped so History's
 *  hundreds don't flood the screen; falls back to a sensible fixed count. */
export const BeansListFallback = ({ tab }: { tab: TabKey }) => {
  const { data: counts } = useQuery(beansCountsQueryOptions());
  const count = counts
    ? tab === "open"
      ? counts.open
      : tab === "frozen"
        ? counts.frozen
        : counts.archived
    : undefined;
  const rows = count === undefined ? 4 : Math.min(Math.max(count, 1), 8);

  if (tab === "history") return <BeansHistorySkeleton rows={rows} />;
  return <BeansQuickListSkeleton rows={rows} />;
};
