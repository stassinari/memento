import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useMemo } from "react";
import {
  BeansListFallback,
  BeansListTabs,
  beansListQueryOptions,
} from "~/components/beans/BeansListTabs";
import { BeansQuickList } from "~/components/beans/BeansQuickList";
import { EmptyState } from "~/components/EmptyState";
import { useBeanActions } from "~/hooks/useBeanActions";
import { compareByArchiveDate } from "~/lib/beans";

export const Route = createFileRoute("/_auth/_layout/beans/history")({
  component: HistoryBeansTab,
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

// Interim view: the History route fetches everything (the future table defaults
// to the archived slice but can fold Open/Frozen back in via the status filter).
// Until that table lands (Phase 4) we show the archived beans as a quick list.
function HistoryContent() {
  const { data } = useSuspenseQuery(beansListQueryOptions("History"));
  const actions = useBeanActions();

  const archived = useMemo(
    () => data.filter((bean) => bean.isArchived).sort(compareByArchiveDate),
    [data],
  );

  if (archived.length === 0) {
    return <EmptyState title="No archived beans" description="Beans you archive will appear here." />;
  }

  return (
    <>
      {actions.deleteErrorModal}
      <BeansQuickList beans={archived} actions={actions} />
    </>
  );
}
