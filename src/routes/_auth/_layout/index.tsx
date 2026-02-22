import { PlusIcon } from "@heroicons/react/20/solid";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { BeansCard } from "~/components/beans/BeansCard";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import {
  DrinksList,
  mergeBrewsAndEspressoByUniqueDate,
} from "~/components/drinks/DrinksList";
import { BeanBagIcon } from "~/components/icons/BeanBagIcon";
import { BeanIconSolid } from "~/components/icons/BeanIconSolid";
import { DropIcon } from "~/components/icons/DropIcon";
import { PortafilterIcon } from "~/components/icons/PortafilterIcon";
import { ListCard } from "~/components/ListCard";
import { getBrews, getEspressos, getPartialEspressos } from "~/db/queries";
import type { Beans, Espresso } from "~/db/types";

const brewsQueryOptions = () =>
  queryOptions({
    queryKey: ["brews"],
    queryFn: () => getBrews({ data: { limit: 30, offset: 0 } }),
  });

const espressosQueryOptions = () =>
  queryOptions({
    queryKey: ["espressos"],
    queryFn: () =>
      getEspressos({ data: { limit: 30, offset: 0 } }),
  });

const partialEspressosQueryOptions = () =>
  queryOptions({
    queryKey: ["espressos", "partial"],
    queryFn: () => getPartialEspressos(),
  });

export const Route = createFileRoute("/_auth/_layout/")({
  component: Home,
});

function Home() {
  const { data: brewsList } = useSuspenseQuery(
    brewsQueryOptions(),
  );
  const { data: espressoList } = useSuspenseQuery(
    espressosQueryOptions(),
  );
  const { data: partialEspressos } = useSuspenseQuery(
    partialEspressosQueryOptions(),
  );

  // Calculate recently used beans from the already-fetched brew/espresso data
  const recentlyUsedBeans = getRecentlyUsedBeans(
    brewsList ?? [],
    espressoList ?? [],
  );

  // Get latest drinks (limited to 3 days worth)
  const latestDrinks = mergeBrewsAndEspressoByUniqueDate(
    (brewsList ?? []).slice(0, 10),
    (espressoList ?? []).slice(0, 10),
  ).slice(0, 3);

  return (
    <>
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
                <BeansCard beans={beans} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Partial Espressos Section */}
      {(partialEspressos ?? []).length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Espressos pending details
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(partialEspressos ?? []).map(({ espresso, beans }) => (
              <li key={espresso.id}>
                <PartialEspressoCard espresso={espresso} beans={beans} />
              </li>
            ))}
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
          <DrinksList drinks={latestDrinks} />
        </section>
      )}
    </>
  );
}

// Extract recently used beans from the joined brew/espresso data
// No extra DB query needed since beans are already joined in the results
function getRecentlyUsedBeans(
  brewsList: Awaited<ReturnType<typeof getBrews>>,
  espressoList: Awaited<ReturnType<typeof getEspressos>>,
): Beans[] {
  const beansUsageMap = new Map<string, { beans: Beans; date: Date }>();

  brewsList.forEach((item) => {
    if (item.beans) {
      const date = new Date(item.brews.date);
      const existing = beansUsageMap.get(item.beans.id);
      if (!existing || date > existing.date) {
        beansUsageMap.set(item.beans.id, { beans: item.beans, date });
      }
    }
  });

  espressoList.forEach((item) => {
    if (item.beans) {
      const date = new Date(item.espresso.date);
      const existing = beansUsageMap.get(item.beans.id);
      if (!existing || date > existing.date) {
        beansUsageMap.set(item.beans.id, { beans: item.beans, date });
      }
    }
  });

  return [...beansUsageMap.values()]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
    .map(({ beans }) => beans);
}

// Partial Espresso Card Component
function PartialEspressoCard({
  espresso,
  beans,
}: {
  espresso: Espresso;
  beans: Beans | null;
}) {
  return (
    <ListCard
      linkProps={{
        to: "/drinks/espresso/$espressoId/decent/add",
        params: { espressoId: espresso.id },
      }}
      footerSlot={
        <Card.Footer className="flex items-center h-8 gap-1 text-xs text-gray-500">
          <PortafilterIcon className="w-4 h-4 mr-1 text-gray-400" />
          Pulled at{" "}
          <span>
            {dayjs(espresso.date).format("ddd DD MMM YYYY | HH:mm")}
          </span>
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
