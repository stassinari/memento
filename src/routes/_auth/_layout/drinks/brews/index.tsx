import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { queryOptions } from "node_modules/@tanstack/react-query/build/modern/queryOptions";
import { useEffect, useMemo, useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import {
  DrinksList,
  mergeBrewsAndEspressoByUniqueDate,
} from "~/components/drinks/DrinksList";
import { Heading } from "~/components/Heading";
import { getBrews } from "~/db/queries";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";

type BrewWithBeans = Awaited<ReturnType<typeof getBrews>>[number];

const PAGE_SIZE = 15;

const brewsQueryOptions = (
  limit: number,
  offset: number,
) =>
  queryOptions({
    queryKey: ["brews", limit, offset],
    queryFn: () => getBrews({ data: { limit, offset } }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/brews/")({
  component: BrewsList,
});

function BrewsList() {
  const [offset, setOffset] = useState(0);
  const [allBrews, setAllBrews] = useState<BrewWithBeans[]>([]);

  const { data: brewsWithBeans, isLoading } = useQuery<BrewWithBeans[]>({
    ...brewsQueryOptions(PAGE_SIZE, offset),
  });

  // TODO: i'm not in love with this
  useEffect(() => {
    if (brewsWithBeans) {
      setAllBrews((prev) => {
        if (offset === 0) return brewsWithBeans;
        return [...prev, ...brewsWithBeans];
      });
    }
  }, [brewsWithBeans, offset]);

  const drinks = useMemo(
    () => mergeBrewsAndEspressoByUniqueDate(allBrews, []),
    [allBrews],
  );

  const isSm = useScreenMediaQuery("sm");

  const hasMore = brewsWithBeans && brewsWithBeans.length >= PAGE_SIZE;

  const loadMore = () => {
    setOffset((prev) => prev + PAGE_SIZE);
  };

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.brews]} />

      <Heading
        actionSlot={
          <Button
            variant="primary"
            colour="accent"
            size={isSm ? "md" : "sm"}
            asChild
          >
            <RouterLink to="/drinks/brews/add">Add brew</RouterLink>
          </Button>
        }
      >
        Brews
      </Heading>

      <div className="mt-4">
        <DrinksList drinks={drinks} />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {hasMore && (
          <Button
            variant="white"
            colour="accent"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load more"}
          </Button>
        )}
        <Button variant="white" colour="accent" asChild>
          <RouterLink to="/drinks/brews/table">View all brews</RouterLink>
        </Button>
      </div>
    </>
  );
}
