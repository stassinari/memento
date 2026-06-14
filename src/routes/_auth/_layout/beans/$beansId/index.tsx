import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ActivityCard } from "~/components/beans/profile/ActivityCard";
import { ArchiveZone } from "~/components/beans/profile/ArchiveZone";
import { BeansProfileHeader } from "~/components/beans/profile/BeansProfileHeader";
import { BeanStatsGrid } from "~/components/beans/profile/BeanStatsGrid";
import { CompositionCard } from "~/components/beans/profile/CompositionCard";
import { FreshnessCard } from "~/components/beans/profile/FreshnessCard";
import { OriginCard } from "~/components/beans/profile/OriginCard";
import { RoastCharacterCard } from "~/components/beans/profile/RoastCharacterCard";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { NotFound } from "~/components/ErrorPage";
import { Modal } from "~/components/Modal";
import { archiveBeans, deleteBeans, freezeBeans, thawBeans, unarchiveBeans } from "~/db/mutations";
import { getBean } from "~/db/queries";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { getActivitySummary, getBeanStatus, getFreshness } from "~/lib/beans";

export type BeanWithDrinks = NonNullable<Awaited<ReturnType<typeof getBean>>>;

export const beansQueryOptions = (beanId: string) =>
  queryOptions<BeanWithDrinks | null>({
    queryKey: ["bean", beanId],
    queryFn: () =>
      getBean({
        data: { beanId },
      }),
  });

export const Route = createFileRoute("/_auth/_layout/beans/$beansId/")({
  component: BeansProfile,
});

function BeansProfile() {
  const { beansId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: bean } = useSuspenseQuery<BeanWithDrinks | null>(beansQueryOptions(beansId));

  const [isDeleteErrorModalOpen, setIsDeleteErrorModalOpen] = useState(false);
  const isDesktop = useScreenMediaQuery("md");

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
  }, [beansId, queryClient]);

  const handleArchive = useCallback(async () => {
    await archiveBeans({ data: { beansId } });
    invalidate();
    navigate({ to: "/beans" });
  }, [beansId, invalidate, navigate]);

  const handleUnarchive = useCallback(async () => {
    await unarchiveBeans({ data: { beansId } });
    invalidate();
  }, [beansId, invalidate]);

  const handleFreeze = useCallback(async () => {
    await freezeBeans({ data: { beansId } });
    invalidate();
  }, [beansId, invalidate]);

  const handleThaw = useCallback(async () => {
    await thawBeans({ data: { beansId } });
    invalidate();
  }, [beansId, invalidate]);

  const handleDelete = useCallback(async () => {
    const wasSuccessful = await deleteBeans({ data: { beansId } });
    if (wasSuccessful) {
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      navigate({ to: "/beans" });
    } else {
      setIsDeleteErrorModalOpen(true);
    }
  }, [beansId, queryClient, navigate]);

  if (!bean) {
    return <NotFound />;
  }

  const status = getBeanStatus(bean);
  const freshness = getFreshness(bean);
  const activity = getActivitySummary(bean);
  const recentLimit = isDesktop ? 5 : 3;

  return (
    <>
      <Modal open={isDeleteErrorModalOpen} handleClose={() => setIsDeleteErrorModalOpen(false)}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Cannot delete beans that have associated drinks. Please delete the drinks first.
        </p>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="primary"
            colour="accent"
            onClick={() => setIsDeleteErrorModalOpen(false)}
          >
            Okay
          </Button>
        </div>
      </Modal>

      <BreadcrumbsWithHome items={[navLinks.beans, { label: bean.name }]} />

      <div className="my-6">
        <BeansProfileHeader
          bean={bean}
          status={status}
          beansId={beansId}
          isDesktop={isDesktop}
          onFreeze={handleFreeze}
          onThaw={handleThaw}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
          onDelete={handleDelete}
        />

        {isDesktop ? (
          <div className="mt-7 grid grid-cols-12 items-start gap-6">
            <div className="sticky top-6 col-span-4 space-y-6">
              <FreshnessCard
                bean={bean}
                beansId={beansId}
                showActions={false}
                timelineExpanded
                onFreeze={handleFreeze}
                onThaw={handleThaw}
              />
            </div>
            <div className="col-span-8 space-y-6">
              <ActivityCard bean={bean} initialCount={recentLimit} />
              <div className="grid grid-cols-2 items-start gap-6">
                <RoastCharacterCard bean={bean} />
                {bean.origin === "blend" ? (
                  <CompositionCard bean={bean} />
                ) : (
                  <OriginCard bean={bean} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-3.5">
            <BeanStatsGrid freshness={freshness} activity={activity} />
            <FreshnessCard
              bean={bean}
              beansId={beansId}
              showActions
              timelineExpanded={false}
              onFreeze={handleFreeze}
              onThaw={handleThaw}
            />
            <ActivityCard bean={bean} initialCount={recentLimit} />
            <RoastCharacterCard bean={bean} />
            {bean.origin === "blend" ? (
              <CompositionCard bean={bean} />
            ) : (
              <OriginCard bean={bean} />
            )}
            <ArchiveZone
              isArchived={bean.isArchived}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
            />
          </div>
        )}
      </div>
    </>
  );
}
