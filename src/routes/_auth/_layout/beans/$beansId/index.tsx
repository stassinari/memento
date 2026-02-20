import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { BeansDetailsInfo } from "~/components/beans/BeansDetailsInfo";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import {
  ButtonWithDropdown,
  ButtonWithDropdownProps,
} from "~/components/ButtonWithDropdown";
import {
  DrinksList,
  mergeBrewsAndEspressoByUniqueDate,
} from "~/components/drinks/DrinksList";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { Modal } from "~/components/Modal";
import {
  archiveBeans,
  deleteBeans,
  freezeBeans,
  thawBeans,
  unarchiveBeans,
} from "~/db/mutations";
import { getBean } from "~/db/queries";
import { Beans } from "~/db/types";
import { userAtom } from "~/hooks/useInitUser";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { tabStyles } from "..";

export type BeanWithDrinks = NonNullable<Awaited<ReturnType<typeof getBean>>>;

// TODO this is the wrong place for this
export const areBeansFresh = (beans: Beans | null): boolean =>
  !beans?.freezeDate && !beans?.thawDate;

export const areBeansFrozen = (beans: Beans | null): boolean =>
  !!beans?.freezeDate && !beans?.thawDate;

export const areBeansThawed = (beans: Beans | null): boolean =>
  !!beans?.freezeDate && !!beans?.thawDate;

export const beansQueryOptions = (beanId: string, firebaseUid: string) =>
  queryOptions<BeanWithDrinks | null>({
    queryKey: ["bean", beanId, firebaseUid],
    queryFn: () =>
      getBean({
        data: { beanId, firebaseUid },
      }),
  });

export const Route = createFileRoute("/_auth/_layout/beans/$beansId/")({
  component: BeansDetails,
});

function BeansDetails() {
  const { beansId } = Route.useParams();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();

  const { data: beansWithDrinks } = useSuspenseQuery<BeanWithDrinks | null>(
    beansQueryOptions(beansId, user?.uid ?? ""),
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDeleteErrorModalOpen, setIsDeleteErrorModalOpen] = useState(false);
  const isSm = useScreenMediaQuery("sm");

  const beanForDropdown = beansWithDrinks;

  if (!beansWithDrinks) {
    return <NotFound />;
  }

  // FIXME: this is stupid, it needs refactoring now we're in a SQL world
  const sqlDrinks = useMemo(() => {
    return mergeBrewsAndEspressoByUniqueDate(
      beansWithDrinks.brews.map((brew) => ({
        brews: brew,
        beans: beansWithDrinks,
      })),
      beansWithDrinks.espressos.map((espresso) => ({
        espresso,
        beans: beansWithDrinks,
      })),
    );
  }, [beansWithDrinks]);

  const handleArchive = useCallback(async () => {
    await archiveBeans({
      data: { beansId, firebaseUid: user?.uid ?? "" },
    });

    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
    navigate({ to: "/beans" });
  }, [beansId, user?.uid, queryClient, navigate]);

  const handleUnarchive = useCallback(async () => {
    await unarchiveBeans({
      data: { beansId, firebaseUid: user?.uid ?? "" },
    });

    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
  }, [beansId, user?.uid, queryClient]);

  const handleFreeze = useCallback(async () => {
    await freezeBeans({
      data: { beansId, firebaseUid: user?.uid ?? "" },
    });

    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
  }, [beansId, user?.uid, queryClient]);

  const handleThaw = useCallback(async () => {
    await thawBeans({
      data: { beansId, firebaseUid: user?.uid ?? "" },
    });

    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
  }, [beansId, user?.uid, queryClient]);

  const handleDelete = useCallback(async () => {
    const wasSuccessful = await deleteBeans({
      data: { beansId, firebaseUid: user?.uid ?? "" },
    });

    if (wasSuccessful) {
      // 3. Invalidate and navigate
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      navigate({ to: "/beans" });
    } else {
      setIsDeleteErrorModalOpen(true);
    }
  }, [beansId, user?.uid, queryClient, navigate]);

  const dropdownButtons: ButtonWithDropdownProps = useMemo(
    () => ({
      mainButton: {
        type: "link",
        label: "Clone",
        linkProps: { to: "/beans/$beansId/clone", params: { beansId } },
      },
      dropdownItems: [
        {
          type: "link",
          label: "Edit details",
          linkProps: { to: "/beans/$beansId/edit", params: { beansId } },
        },
        ...(beanForDropdown?.isFinished
          ? [
              {
                type: "button" as const,
                label: "Unarchive",
                onClick: handleUnarchive,
              },
            ]
          : [
              {
                type: "button" as const,
                label: "Archive",
                onClick: handleArchive,
              },
            ]),
        ...(areBeansFresh(beanForDropdown)
          ? [
              {
                type: "button" as const,
                label: "Freeze",
                onClick: handleFreeze,
              },
            ]
          : areBeansFrozen(beanForDropdown)
            ? [{ type: "button" as const, label: "Thaw", onClick: handleThaw }]
            : []),

        { type: "button", label: "Delete", onClick: handleDelete },
      ],
    }),
    [
      beansWithDrinks,
      handleArchive,
      handleDelete,
      handleFreeze,
      handleThaw,
      handleUnarchive,
    ],
  );

  if (!beansWithDrinks) {
    return <NotFound />;
  }

  return (
    <>
      <Modal
        open={isDeleteErrorModalOpen}
        handleClose={() => setIsDeleteErrorModalOpen(false)}
      >
        <p className="text-sm text-gray-700">
          Cannot delete beans that have associated drinks. Please delete the
          drinks first.
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

      <BreadcrumbsWithHome
        items={[navLinks.beans, { label: beansWithDrinks.name }]}
      />

      <Heading actionSlot={<ButtonWithDropdown {...dropdownButtons} />}>
        {beansWithDrinks.name}
      </Heading>

      {isSm ? (
        <div className="grid grid-cols-[40%_60%] gap-4 my-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Beans info
            </h2>

            <BeansDetailsInfo beans={beansWithDrinks} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-center text-gray-900">
              Drinks
            </h2>

            <DrinksList drinks={sqlDrinks} />
          </div>
        </div>
      ) : (
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="flex -mb-px">
            <Tab className={clsx([tabStyles(selectedIndex === 0), "w-1/2"])}>
              Info
            </Tab>
            <Tab className={clsx([tabStyles(selectedIndex === 1), "w-1/2"])}>
              Drinks
            </Tab>
          </TabList>
          <TabPanels className="mt-4">
            <TabPanel>
              <BeansDetailsInfo beans={beansWithDrinks!} />
            </TabPanel>
            <TabPanel>
              <DrinksList drinks={sqlDrinks} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}
    </>
  );
}
