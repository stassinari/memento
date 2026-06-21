import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  BeansListFallback,
  BeansListTabs,
  beansListQueryOptions,
} from "~/components/beans/BeansListTabs";
import { BeansHistoryTable } from "~/components/beans/history/BeansHistoryTable";
import { EmptyState } from "~/components/EmptyState";

export const Route = createFileRoute("/_auth/_layout/beans/history")({
  component: HistoryBeansTab,
  // The table wants the whole width; Open/Frozen stay in the default container.
  staticData: { fullWidth: true },
});

function HistoryBeansTab() {
  return (
    <BeansListTabs activeTab="history">
      <Suspense fallback={<BeansListFallback tab="history" />}>
        <HistoryContent />
      </Suspense>
    </BeansListTabs>
  );
}

// The History route fetches everything (the table defaults to the archived
// slice but can fold Open/Frozen back in via the status filter).
function HistoryContent() {
  const { data } = useSuspenseQuery(beansListQueryOptions("History"));

  if (!data.some((bean) => bean.isArchived)) {
    return <EmptyState title="No archived beans" description="Beans you archive will appear here." />;
  }

  return <BeansHistoryTable beans={data} />;
}
