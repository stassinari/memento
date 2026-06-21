import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  BeansListFallback,
  BeansListTabs,
  BeansQuickListTab,
  frozenEmptyState,
} from "~/components/beans/BeansListTabs";

export const Route = createFileRoute("/_auth/_layout/beans/frozen")({
  component: FrozenBeansTab,
});

function FrozenBeansTab() {
  return (
    <BeansListTabs activeTab="frozen">
      <Suspense fallback={<BeansListFallback tab="frozen" />}>
        <BeansQuickListTab state="Frozen" emptyState={frozenEmptyState} />
      </Suspense>
    </BeansListTabs>
  );
}
