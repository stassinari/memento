import { Tab } from "@headlessui/react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { userAtom } from "~/hooks/useInitUser";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { BrewDetailsInfo as FirebaseBrewDetailsInfo } from "~/components/brews/BrewDetailsInfo.Firebase";
import { BrewDetailsOutcome as FirebaseBrewDetailsOutcome } from "~/components/brews/BrewDetailsOutcome.Firebase";

import { BrewDetailsInfo as PostgresBrewDetailsInfo } from "~/components/brews/BrewDetailsInfo.Postgres";
import { BrewDetailsOutcome as PostgresBrewDetailsOutcome } from "~/components/brews/BrewDetailsOutcome.Postgres";
import { ButtonWithDropdown } from "~/components/ButtonWithDropdown";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { getBrew } from "~/db/queries";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "~/hooks/firestore/useFirestoreDocRealtime";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Brew } from "~/types/brew";
import { tabStyles } from "../../../beans";
import { flagsQueryOptions } from "../../../featureFlags";

const brewQueryOptions = (brewId: string, firebaseUid: string) =>
  queryOptions({
    queryKey: ["brews", brewId, firebaseUid],
    queryFn: () => getBrew({ data: { brewFbId: brewId, firebaseUid } }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/brews/$brewId/")({
  component: BrewDetails,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
    // User data and brew will be loaded in component since user is client-side only
  },
});

function BrewDetails() {
  console.log("BrewDetails");

  const { brewId } = Route.useParams();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlBrew } = useSuspenseQuery(
    brewQueryOptions(brewId, user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: fbBrew, isLoading } = useFirestoreDocRealtime<Brew>(docRef);

  const brewDate = shouldReadFromPostgres
    ? sqlBrew.brews.date
    : fbBrew?.date.toDate();
  const brewMethod = shouldReadFromPostgres
    ? sqlBrew.brews.method
    : (fbBrew?.method ?? "");

  const handleDelete = async () => {
    await deleteDoc(docRef);
    navigate({ to: "/drinks/brews" });
  };

  if (isLoading) return null;

  if (!fbBrew) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brewMethod, linkTo: "#" },
        ]}
      />

      <Heading
        actionSlot={
          <ButtonWithDropdown
            mainButton={{ type: "link", label: "Clone", href: "clone" }}
            dropdownItems={[
              { type: "link", label: "Edit details", href: "edit" },
              { type: "link", label: "Edit outcome", href: "outcome" },
              {
                type: "button",
                label: "Delete",
                onClick: handleDelete,
              },
            ]}
          />
        }
      >
        {brewMethod}
      </Heading>

      <div className="mb-2 text-sm text-gray-500">
        {dayjs(brewDate).format("DD MMM YYYY @ H:m")}
      </div>

      {isSm ? (
        <div className="grid grid-cols-2 gap-4 my-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Brew info
            </h2>

            {shouldReadFromPostgres ? (
              <PostgresBrewDetailsInfo brew={sqlBrew.brews} />
            ) : (
              <FirebaseBrewDetailsInfo brew={fbBrew} />
            )}
          </div>

          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Outcome
            </h2>

            {shouldReadFromPostgres ? (
              <PostgresBrewDetailsOutcome brew={sqlBrew.brews} />
            ) : (
              <FirebaseBrewDetailsOutcome brew={fbBrew} />
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
              Outcome
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              {shouldReadFromPostgres ? (
                <PostgresBrewDetailsInfo brew={sqlBrew.brews} />
              ) : (
                <FirebaseBrewDetailsInfo brew={fbBrew} />
              )}
            </Tab.Panel>
            <Tab.Panel>
              {shouldReadFromPostgres ? (
                <PostgresBrewDetailsOutcome brew={sqlBrew.brews} />
              ) : (
                <FirebaseBrewDetailsOutcome brew={fbBrew} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </>
  );
}
