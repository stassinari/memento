import { Tab } from "@headlessui/react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import clsx from "clsx";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { userAtom } from "~/hooks/useInitUser";
import { BeansDetailsInfo as FirebaseBeansDetailsInfo } from "~/components/beans/BeansDetailsInfo.Firebase";
import { BeansDrinks as FirebaseBeansDrinks } from "~/components/beans/BeansDrinks.Firebase";
import { BeansDetailsInfo as PostgresBeansDetailsInfo } from "~/components/beans/BeansDetailsInfo.Postgres";
import { BeansDrinks as PostgresBeansDrinks } from "~/components/beans/BeansDrinks.Postgres";
import { areBeansFresh, areBeansFrozen } from "~/components/beans/utils";
import { mergeBrewsAndEspressoByUniqueDate } from "~/components/drinks/DrinksList.Postgres";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  ButtonWithDropdown,
  ButtonWithDropdownProps,
} from "~/components/ButtonWithDropdown";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { getBean } from "~/db/queries";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "~/hooks/firestore/useFirestoreDocRealtime";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Beans } from "~/types/beans";
import { tabStyles } from "..";
import { flagsQueryOptions } from "../../featureFlags";

const beanQueryOptions = (beanId: string, firebaseUid: string) =>
  queryOptions({
    queryKey: ["bean", beanId, firebaseUid],
    queryFn: () => getBean({ data: { beanFbId: beanId, firebaseUid } }),
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

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlBean } = useSuspenseQuery(
    beanQueryOptions(beansId, user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: fbBeans, isLoading } = useFirestoreDocRealtime<Beans>(docRef);

  const beans = shouldReadFromPostgres ? sqlBean?.beans : fbBeans;

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
    return mergeBrewsAndEspressoByUniqueDate(brewsWithBeans, espressosWithBeans);
  }, [shouldReadFromPostgres, sqlBean]);

  const handleArchive = useCallback(async () => {
    await updateDoc(docRef, {
      isFinished: true,
    });
    navigate({ to: "/beans" });
  }, [docRef, navigate]);

  const handleUnarchive = useCallback(async () => {
    await updateDoc(docRef, {
      isFinished: false,
    });
  }, [docRef]);

  const handleFreeze = useCallback(async () => {
    await updateDoc(docRef, {
      freezeDate: serverTimestamp(),
    });
  }, [docRef]);

  const handleThaw = useCallback(async () => {
    await updateDoc(docRef, {
      thawDate: serverTimestamp(),
    });
  }, [docRef]);

  const handleDelete = useCallback(async () => {
    // TODO check if beans have brews/espressos/tastings
    await deleteDoc(docRef);
    navigate({ to: "/beans" });
  }, [docRef, navigate]);

  const dropdownButtons: ButtonWithDropdownProps = useMemo(
    () => ({
      mainButton: { type: "link", label: "Clone", href: "clone" },
      dropdownItems: [
        { type: "link", label: "Edit details", href: "edit" },
        ...(beans?.isFinished
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
        ...(areBeansFresh(beans)
          ? [
              {
                type: "button" as const,
                label: "Freeze",
                onClick: handleFreeze,
              },
            ]
          : areBeansFrozen(beans)
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
      <BreadcrumbsWithHome
        items={[navLinks.beans, { label: beans.name, linkTo: "#" }]}
      />

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
              <PostgresBeansDetailsInfo beans={sqlBean.beans} />
            ) : (
              <FirebaseBeansDetailsInfo beans={fbBeans} />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-center text-gray-900">
              Drinks
            </h2>

            {shouldReadFromPostgres ? (
              <PostgresBeansDrinks drinks={sqlDrinks} />
            ) : (
              <FirebaseBeansDrinks beans={fbBeans} />
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
                <PostgresBeansDetailsInfo beans={sqlBean.beans} />
              ) : (
                <FirebaseBeansDetailsInfo beans={fbBeans} />
              )}
            </Tab.Panel>
            <Tab.Panel>
              {shouldReadFromPostgres ? (
                <PostgresBeansDrinks drinks={sqlDrinks} />
              ) : (
                <FirebaseBeansDrinks beans={fbBeans} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </>
  );
}
