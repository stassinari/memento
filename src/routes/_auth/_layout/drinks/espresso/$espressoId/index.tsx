import { Tab } from "@headlessui/react";
import { PuzzlePieceIcon } from "@heroicons/react/20/solid";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { userAtom } from "~/hooks/useInitUser";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import {
  ButtonWithDropdown,
  ButtonWithDropdownProps,
} from "~/components/ButtonWithDropdown";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { EspressoDetailsInfo as FirebaseEspressoDetailsInfo } from "~/components/espresso/EspressoDetailsInfo.Firebase";
import { EspressoDetailsOutcome as FirebaseEspressoDetailsOutcome } from "~/components/espresso/EspressoDetailsOutcome.Firebase";
import { EspressoDetailsInfo as PostgresEspressoDetailsInfo } from "~/components/espresso/EspressoDetailsInfo.Postgres";
import { EspressoDetailsOutcome as PostgresEspressoDetailsOutcome } from "~/components/espresso/EspressoDetailsOutcome.Postgres";
import { DecentCharts } from "~/components/espresso/charts/DecentCharts";
import { getEspresso } from "~/db/queries";
import type { EspressoWithBeans } from "~/db/types";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "~/hooks/firestore/useFirestoreDocRealtime";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Espresso } from "~/types/espresso";
import { tabStyles } from "../../../beans";
import { flagsQueryOptions } from "../../../featureFlags";

const espressoQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions<EspressoWithBeans>({
    queryKey: ["espresso", espressoId, firebaseUid],
    queryFn: () =>
      getEspresso({ data: { espressoFbId: espressoId, firebaseUid } }) as Promise<EspressoWithBeans>,
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/",
)({
  component: EspressoDetails,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function EspressoDetails() {
  console.log("EspressoDetails");

  const { espressoId } = Route.useParams();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlEspresso } = useSuspenseQuery<EspressoWithBeans>(
    espressoQueryOptions(espressoId, user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const docRef = useDocRef<Espresso>("espresso", espressoId);
  const { details: fbEspresso, isLoading } =
    useFirestoreDocRealtime<Espresso>(docRef);

  const espressoDate = shouldReadFromPostgres
    ? sqlEspresso.espresso.date
    : fbEspresso?.date.toDate();
  const fromDecent = shouldReadFromPostgres
    ? sqlEspresso.espresso.fromDecent
    : fbEspresso?.fromDecent;
  const partial = shouldReadFromPostgres
    ? sqlEspresso.espresso.partial ?? false
    : (fbEspresso as any)?.partial;

  const handleDelete = useCallback(async () => {
    await deleteDoc(docRef);
    navigate({ to: "/drinks/espresso" });
  }, [docRef, navigate]);

  const decentEspressoButtons: ButtonWithDropdownProps = useMemo(
    () => ({
      mainButton: { type: "link", label: "Edit outcome", href: "outcome" },
      dropdownItems: [
        { type: "link", label: "Edit details", href: "decent/edit" },
        { type: "button", label: "Delete", onClick: handleDelete },
      ],
    }),
    [handleDelete],
  );

  const normalEspressoButtons: ButtonWithDropdownProps = useMemo(
    () => ({
      mainButton: { type: "link", label: "Clone", href: "clone" },
      dropdownItems: [
        { type: "link", label: "Edit details", href: "edit" },
        { type: "link", label: "Edit outcome", href: "outcome" },
        { type: "button", label: "Delete", onClick: handleDelete },
      ],
    }),
    [handleDelete],
  );

  if (isLoading) return null;

  if (!fbEspresso) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: "#" },
        ]}
      />

      <Heading
        actionSlot={
          <ButtonWithDropdown
            {...(fromDecent ? decentEspressoButtons : normalEspressoButtons)}
          />
        }
      >
        Espresso detail
      </Heading>

      <div className="mb-2 text-sm text-gray-500">
        {dayjs(espressoDate).format("DD MMM YYYY @ H:m")}
      </div>

      {fromDecent && partial && (
        <div className="inline-flex items-center gap-4">
          <Button variant="secondary" size="sm" className="shrink-0" asChild>
            <Link
              to="/drinks/espresso/$espressoId/decent/add"
              params={{ espressoId: espressoId || "" }}
            >
              <PuzzlePieceIcon /> Add shot info
            </Link>
          </Button>
          <span>This shot is missing some information!</span>
        </div>
      )}

      {fromDecent && <DecentCharts espressoId={espressoId} />}

      {isSm ? (
        <div className="grid grid-cols-2 gap-4 my-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Espresso info
            </h2>

            {shouldReadFromPostgres ? (
              <PostgresEspressoDetailsInfo
                espresso={sqlEspresso.espresso}
                beansId={sqlEspresso.beans?.id}
              />
            ) : (
              <FirebaseEspressoDetailsInfo espresso={fbEspresso} />
            )}
          </div>

          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Outcome
            </h2>

            {shouldReadFromPostgres ? (
              <PostgresEspressoDetailsOutcome espresso={sqlEspresso.espresso} />
            ) : (
              <FirebaseEspressoDetailsOutcome espresso={fbEspresso} />
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
                <PostgresEspressoDetailsInfo
                  espresso={sqlEspresso.espresso}
                  beansId={sqlEspresso.beans?.id}
                />
              ) : (
                <FirebaseEspressoDetailsInfo espresso={fbEspresso} />
              )}
            </Tab.Panel>
            <Tab.Panel>
              {shouldReadFromPostgres ? (
                <PostgresEspressoDetailsOutcome
                  espresso={sqlEspresso.espresso}
                />
              ) : (
                <FirebaseEspressoDetailsOutcome espresso={fbEspresso} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </>
  );
}
