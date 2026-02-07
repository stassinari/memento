import { PlusIcon } from "@heroicons/react/20/solid";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { limit, orderBy, where } from "firebase/firestore";
import { useMemo } from "react";
import { BeansCard } from "~/components/beans/BeansCard";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import {
  DrinksList as DrinksListFirebase,
  mergeBrewsAndEspressoByUniqueDate as mergeFirebase,
} from "~/components/drinks/DrinksList.Firebase";
import {
  DrinksList as DrinksListPostgres,
  mergeBrewsAndEspressoByUniqueDate as mergePostgres,
} from "~/components/drinks/DrinksList.Postgres";
import { Heading } from "~/components/Heading";
import { BeanBagIcon } from "~/components/icons/BeanBagIcon";
import { BeanIconSolid } from "~/components/icons/BeanIconSolid";
import { DropIcon } from "~/components/icons/DropIcon";
import { PortafilterIcon } from "~/components/icons/PortafilterIcon";
import { ListCard } from "~/components/ListCard";
import {
  getBeans,
  getBrews,
  getEspressos,
  getPartialEspressos,
} from "~/db/queries";
import type {
  BeansWithUser,
  BrewWithBeans,
  EspressoWithBeans,
} from "~/db/types";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "~/hooks/firestore/useFirestoreCollectionRealtime";
import { useCurrentUser } from "~/hooks/useInitUser";
import type { Beans } from "~/types/beans";
import type { Brew } from "~/types/brew";
import type { Espresso } from "~/types/espresso";
import { flagsQueryOptions } from "./featureFlags";

const brewsQueryOptions = (firebaseUid: string) =>
  queryOptions<BrewWithBeans[]>({
    queryKey: ["brews", firebaseUid],
    queryFn: () => getBrews({ data: firebaseUid }) as Promise<BrewWithBeans[]>,
  });

const espressosQueryOptions = (firebaseUid: string) =>
  queryOptions<EspressoWithBeans[]>({
    queryKey: ["espressos", firebaseUid],
    queryFn: () =>
      getEspressos({ data: firebaseUid }) as Promise<EspressoWithBeans[]>,
  });

const partialEspressosQueryOptions = (firebaseUid: string) =>
  queryOptions<EspressoWithBeans[]>({
    queryKey: ["espressos", "partial", firebaseUid],
    queryFn: () =>
      getPartialEspressos({ data: firebaseUid }) as Promise<
        EspressoWithBeans[]
      >,
  });

const beansQueryOptions = (firebaseUid: string) =>
  queryOptions<BeansWithUser[]>({
    queryKey: ["beans", firebaseUid],
    queryFn: () => getBeans({ data: firebaseUid }) as Promise<BeansWithUser[]>,
  });

export const Route = createFileRoute("/_auth/_layout/")({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function Home() {
  const user = useCurrentUser();

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const readFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  // PostgreSQL data
  const { data: sqlBrewsList } = useSuspenseQuery(
    brewsQueryOptions(user?.uid ?? ""),
  );
  const { data: sqlEspressoList } = useSuspenseQuery(
    espressosQueryOptions(user?.uid ?? ""),
  );
  const { data: sqlPartialEspressos } = useSuspenseQuery(
    partialEspressosQueryOptions(user?.uid ?? ""),
  );
  const { data: sqlBeansList } = useSuspenseQuery(
    beansQueryOptions(user?.uid ?? ""),
  );

  // Firestore data
  const brewFilters = useMemo(() => [orderBy("date", "desc"), limit(30)], []);
  const brewQuery = useCollectionQuery<Brew>("brews", brewFilters);
  const { list: fbBrewsList, isLoading: brewsLoading } =
    useFirestoreCollectionRealtime<Brew>(brewQuery);

  const espressoFilters = useMemo(
    () => [orderBy("date", "desc"), limit(30)],
    [],
  );
  const espressoQuery = useCollectionQuery<Espresso>(
    "espresso",
    espressoFilters,
  );
  const { list: fbEspressoList, isLoading: espressoLoading } =
    useFirestoreCollectionRealtime<Espresso>(espressoQuery);

  const partialEspressoFilters = useMemo(
    () => [where("partial", "==", true), orderBy("date", "desc"), limit(5)],
    [],
  );
  const partialEspressoQuery = useCollectionQuery<Espresso>(
    "espresso",
    partialEspressoFilters,
  );
  const { list: fbPartialEspressos, isLoading: partialEspressoLoading } =
    useFirestoreCollectionRealtime<Espresso>(partialEspressoQuery);

  const beansFilters = useMemo(() => [orderBy("roastDate", "desc")], []);
  const beansQuery = useCollectionQuery<Beans>("beans", beansFilters);
  const { list: fbBeansList, isLoading: beansLoading } =
    useFirestoreCollectionRealtime<Beans>(beansQuery);

  if (brewsLoading || espressoLoading || beansLoading || partialEspressoLoading)
    return null;

  // Determine which data to use
  const brewsList = readFromPostgres ? (sqlBrewsList ?? []) : fbBrewsList;
  const espressoList = readFromPostgres
    ? (sqlEspressoList ?? [])
    : fbEspressoList;
  const partialEspressos = readFromPostgres
    ? (sqlPartialEspressos ?? [])
    : fbPartialEspressos;
  const beansList = readFromPostgres
    ? (sqlBeansList ?? []).map((b) => b.beans)
    : fbBeansList;

  // Calculate recently used beans (sorted by most recent usage)
  const recentlyUsedBeans = getRecentlyUsedBeans(
    brewsList,
    espressoList,
    beansList,
    readFromPostgres ?? false,
  );

  // Get latest drinks (limited to 10 total)
  const latestDrinks = readFromPostgres
    ? mergePostgres(
        (sqlBrewsList ?? []).slice(0, 10),
        (sqlEspressoList ?? []).slice(0, 10),
      ).slice(0, 3) // Limit to 3 days worth of drinks
    : mergeFirebase(
        fbBrewsList.slice(0, 10),
        fbEspressoList.slice(0, 10),
      ).slice(0, 3); // Limit to 3 days worth of drinks

  return (
    <>
      <Heading>Memento</Heading>

      {/* Recently Used Beans Section */}
      {recentlyUsedBeans.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recently used beans
            </h2>
            <Button variant="secondary" colour="accent" size="sm" asChild>
              <Link to="/beans/add">
                <PlusIcon />
                Add beans
              </Link>
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyUsedBeans.slice(0, 5).map((beans) => (
              <li key={beans.id}>
                <BeansCard
                  beans={beans}
                  shouldReadFromPostgres={readFromPostgres}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Partial Espressos Section */}
      {partialEspressos.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Espressos pending details
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partialEspressos.map((item) => {
              if (readFromPostgres) {
                const { espresso, beans: espressoBeans } =
                  item as EspressoWithBeans;
                return (
                  <li key={espresso.fbId}>
                    <PartialEspressoCard
                      espresso={espresso}
                      beans={espressoBeans}
                      readFromPostgres={true}
                      beansList={beansList}
                    />
                  </li>
                );
              } else {
                const espresso = item as Espresso;
                return (
                  <li key={espresso.id}>
                    <PartialEspressoCard
                      espresso={espresso}
                      beans={null}
                      readFromPostgres={false}
                      beansList={beansList}
                    />
                  </li>
                );
              }
            })}
          </ul>
        </section>
      )}

      {/* Latest Drinks Section */}
      {latestDrinks.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Latest drinks
            </h2>
            <div className="flex gap-2">
              <Button variant="secondary" colour="main" size="sm" asChild>
                <Link to="/drinks/brews/add">
                  <PlusIcon />
                  Add brew
                </Link>
              </Button>
              <Button variant="secondary" colour="main" size="sm" asChild>
                <Link to="/drinks/espresso/add">
                  <PlusIcon />
                  Add espresso
                </Link>
              </Button>
            </div>
          </div>
          {readFromPostgres ? (
            <DrinksListPostgres drinks={latestDrinks as any} />
          ) : (
            <DrinksListFirebase
              drinks={latestDrinks as any}
              beansList={beansList as any}
            />
          )}
        </section>
      )}
    </>
  );
}

// Helper function to get recently used beans
function getRecentlyUsedBeans(
  brewsList: any[],
  espressoList: any[],
  beansList: any[],
  readFromPostgres: boolean,
): any[] {
  // Create a map of beans ID to most recent usage date
  const beansUsageMap = new Map<string, Date>();

  // Process brews
  brewsList.forEach((item) => {
    const brew = readFromPostgres ? item.brews : item;
    const beansId = readFromPostgres
      ? item.beans?.fbId
      : brew.beans?.path?.split("/")[1];
    const date = new Date(brew.date);

    if (beansId) {
      const existingDate = beansUsageMap.get(beansId);
      if (!existingDate || date > existingDate) {
        beansUsageMap.set(beansId, date);
      }
    }
  });

  // Process espressos
  espressoList.forEach((item) => {
    const espresso = readFromPostgres ? item.espresso : item;
    const beansId = readFromPostgres
      ? item.beans?.fbId
      : espresso.beans?.path?.split("/")[1];
    const date = new Date(espresso.date);

    if (beansId) {
      const existingDate = beansUsageMap.get(beansId);
      if (!existingDate || date > existingDate) {
        beansUsageMap.set(beansId, date);
      }
    }
  });

  // Get beans sorted by usage
  const sortedBeans = Array.from(beansUsageMap.entries())
    .sort(([, dateA], [, dateB]) => dateB.getTime() - dateA.getTime())
    .map(([beansId]) =>
      beansList.find((b) =>
        readFromPostgres ? b.fbId === beansId : b.id === beansId,
      ),
    )
    .filter(Boolean);

  return sortedBeans;
}

// Partial Espresso Card Component
interface PartialEspressoCardProps {
  espresso: any;
  beans: any;
  readFromPostgres: boolean;
  beansList: any[];
}

function PartialEspressoCard({
  espresso,
  beans: espressoBeans,
  readFromPostgres,
  beansList,
}: PartialEspressoCardProps) {
  // For Firestore, need to resolve beans reference
  const beans = readFromPostgres
    ? espressoBeans
    : beansList.find((b) => `beans/${b.id}` === espresso.beans?.path);

  const espressoId = readFromPostgres ? espresso.fbId : espresso.id;

  return (
    <ListCard
      linkTo={`/drinks/espresso/${espressoId}/decent/add`}
      footerSlot={
        <Card.Footer className="flex items-center h-8 gap-1 text-xs text-gray-500">
          <PortafilterIcon className="w-4 h-4 mr-1 text-gray-400" />
          Pulled at{" "}
          <span>{dayjs(espresso.date).format("ddd DD MMM YYYY | HH:mm")}</span>
        </Card.Footer>
      }
    >
      <div className="flex">
        <div className="grow">
          {espresso.profileName && (
            <ListCard.Title>{espresso.profileName}</ListCard.Title>
          )}
          {beans && (
            <ListCard.Row>
              <ListCard.RowIcon>
                <BeanBagIcon variant="solid" />
              </ListCard.RowIcon>
              {beans.name}
            </ListCard.Row>
          )}
          <ListCard.Row>
            <ListCard.RowIcon>
              <BeanIconSolid />
            </ListCard.RowIcon>
            {espresso.beansWeight ?? "?"}g :{" "}
            {espresso.actualWeight ?? espresso.targetWeight ?? "?"}g
            <DropIcon className="w-3 h-3 text-gray-400" />
          </ListCard.Row>
        </div>
        <div>
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
            Pending
          </span>
        </div>
      </div>
    </ListCard>
  );
}
