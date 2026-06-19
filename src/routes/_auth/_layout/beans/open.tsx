import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  BeansListFallback,
  BeansListTabs,
  BeansQuickListTab,
  openEmptyState,
} from "~/components/beans/BeansListTabs";

export const Route = createFileRoute("/_auth/_layout/beans/open")({
  component: OpenBeansTab,
});

function OpenBeansTab() {
  return (
    <BeansListTabs activeTab="open">
      <Suspense fallback={<BeansListFallback tab="open" />}>
        <BeansQuickListTab state="Open" emptyState={openEmptyState} />
      </Suspense>
    </BeansListTabs>
  );
}
