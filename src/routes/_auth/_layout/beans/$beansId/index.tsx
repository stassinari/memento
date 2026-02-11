import { Tab } from "@headlessui/react";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { BeansDetailsInfo as FirebaseBeansDetailsInfo } from "~/components/beans/BeansDetailsInfo.Firebase";
import { BeansDetailsInfo as PostgresBeansDetailsInfo } from "~/components/beans/BeansDetailsInfo.Postgres";
import { BeansDrinks as FirebaseBeansDrinks } from "~/components/beans/BeansDrinks.Firebase";
import { BeansDrinks as PostgresBeansDrinks } from "~/components/beans/BeansDrinks.Postgres";
import { areBeansFresh, areBeansFrozen } from "~/components/beans/utils";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  ButtonWithDropdown,
  ButtonWithDropdownProps,
} from "~/components/ButtonWithDropdown";
import { mergeBrewsAndEspressoByUniqueDate } from "~/components/drinks/DrinksList.Postgres";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import {
  archiveBeans,
  deleteBeans,
  freezeBeans,
  thawBeans,
  unarchiveBeans,
} from "~/db/mutations";
import { getBean } from "~/db/queries";
import type { BeanWithRelations } from "~/db/types";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "~/hooks/firestore/useFirestoreDocRealtime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Beans } from "~/types/beans";
import { tabStyles } from "..";
import { flagsQueryOptions } from "../../feature-flags";

const beanQueryOptions = (beanId: string, firebaseUid: string) =>
  queryOptions<BeanWithRelations | null>({
    queryKey: ["bean", beanId, firebaseUid],
    queryFn: () =>
      getBean({
        data: { beanFbId: beanId, firebaseUid },
      }) as Promise<BeanWithRelations | null>,
  });

export const Route = createFileRoute("/_auth/_layout/beans/$beansId/")({
  component: BeansDetails,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function BeansDetails() {
  const { beansId } = Route.useParams();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlBean } = useSuspenseQuery<BeanWithRelations | null>(
    beanQueryOptions(beansId, user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: fbBeans, isLoading } =
    useFirestoreDocRealtime<Beans>(docRef);

  const beans = shouldReadFromPostgres ? sqlBean?.beans : fbBeans;
  const beanForDropdown = shouldReadFromPostgres
    ? (sqlBean?.beans as any)
    : fbBeans;

  if (!beans && !isLoading) {
    return <NotFound />;
  }

  // For Postgres, merge brews and espressos into drinks format
  const sqlDrinks = useMemo(() => {
    if (!shouldReadFromPostgres || !sqlBean) return [];
    const brewsWithBeans = (sqlBean.brews || []).map((brew) => ({
      brews: brew,
      beans: sqlBean.beans,
    }));
    const espressosWithBeans = (sqlBean.espressos || []).map((esp) => ({
      espresso: esp,
      beans: sqlBean.beans,
    }));
    return mergeBrewsAndEspressoByUniqueDate(
      brewsWithBeans,
      espressosWithBeans,
    );
  }, [shouldReadFromPostgres, sqlBean]);

  const handleArchive = useCallback(async () => {
    // 1. Call server function (PostgreSQL write)
    await archiveBeans({
      data: { beansFbId: beansId, firebaseUid: user?.uid ?? "" },
    });

    // 2. Conditionally write to Firestore
    if (writeToFirestore) {
      await updateDoc(docRef, { isFinished: true });
    }

    // 3. Invalidate and navigate
    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
    navigate({ to: "/beans" });
  }, [beansId, user?.uid, writeToFirestore, docRef, queryClient, navigate]);

  const handleUnarchive = useCallback(async () => {
    // 1. Call server function (PostgreSQL write)
    await unarchiveBeans({
      data: { beansFbId: beansId, firebaseUid: user?.uid ?? "" },
    });

    // 2. Conditionally write to Firestore
    if (writeToFirestore) {
      await updateDoc(docRef, { isFinished: false });
    }

    // 3. Invalidate queries
    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
  }, [beansId, user?.uid, writeToFirestore, docRef, queryClient]);

  const handleFreeze = useCallback(async () => {
    // 1. Call server function (PostgreSQL write)
    await freezeBeans({
      data: { beansFbId: beansId, firebaseUid: user?.uid ?? "" },
    });

    // 2. Conditionally write to Firestore
    if (writeToFirestore) {
      await updateDoc(docRef, { freezeDate: serverTimestamp() });
    }

    // 3. Invalidate queries
    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
  }, [beansId, user?.uid, writeToFirestore, docRef, queryClient]);

  const handleThaw = useCallback(async () => {
    // 1. Call server function (PostgreSQL write)
    await thawBeans({
      data: { beansFbId: beansId, firebaseUid: user?.uid ?? "" },
    });

    // 2. Conditionally write to Firestore
    if (writeToFirestore) {
      await updateDoc(docRef, { thawDate: serverTimestamp() });
    }

    // 3. Invalidate queries
    queryClient.invalidateQueries({ queryKey: ["beans"] });
    queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
  }, [beansId, user?.uid, writeToFirestore, docRef, queryClient]);

  const handleDelete = useCallback(async () => {
    // 1. Call server function (PostgreSQL delete)
    await deleteBeans({
      data: { beansFbId: beansId, firebaseUid: user?.uid ?? "" },
    });

    // 2. Conditionally delete from Firestore
    if (writeToFirestore) {
      await deleteDoc(docRef);
    }

    // 3. Invalidate and navigate
    queryClient.invalidateQueries({ queryKey: ["beans"] });
    navigate({ to: "/beans" });
  }, [beansId, user?.uid, writeToFirestore, docRef, queryClient, navigate]);

  const dropdownButtons: ButtonWithDropdownProps = useMemo(
    () => ({
      mainButton: { type: "link", label: "Clone", href: "clone" },
      dropdownItems: [
        { type: "link", label: "Edit details", href: "edit" },
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
      beans,
      handleArchive,
      handleDelete,
      handleFreeze,
      handleThaw,
      handleUnarchive,
    ],
  );

  if (isLoading) return null;

  if (!beans) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.beans, { label: beans.name }]} />

      <Heading actionSlot={<ButtonWithDropdown {...dropdownButtons} />}>
        {beans.name}
      </Heading>

      {isSm ? (
        <div className="grid grid-cols-[40%_60%] gap-4 my-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Beans info
            </h2>

            {shouldReadFromPostgres ? (
              <PostgresBeansDetailsInfo beans={sqlBean?.beans!} />
            ) : (
              <FirebaseBeansDetailsInfo beans={fbBeans!} />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-center text-gray-900">
              Drinks
            </h2>

            {shouldReadFromPostgres ? (
              <PostgresBeansDrinks drinks={sqlDrinks} />
            ) : (
              <FirebaseBeansDrinks beans={fbBeans!} />
            )}
          </div>
        </div>
      ) : (
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex -mb-px">
            <Tab className={clsx([tabStyles(selectedIndex === 0), "w-1/2"])}>
              Info
            </Tab>
            <Tab className={clsx([tabStyles(selectedIndex === 1), "w-1/2"])}>
              Drinks
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              {shouldReadFromPostgres ? (
                <PostgresBeansDetailsInfo beans={sqlBean?.beans!} />
              ) : (
                <FirebaseBeansDetailsInfo beans={fbBeans!} />
              )}
            </Tab.Panel>
            <Tab.Panel>
              {shouldReadFromPostgres ? (
                <PostgresBeansDrinks drinks={sqlDrinks} />
              ) : (
                <FirebaseBeansDrinks beans={fbBeans!} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </>
  );
}
