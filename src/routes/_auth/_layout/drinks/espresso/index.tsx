import { queryOptions, useQuery } from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import {
  DrinksList as PostgresDrinksList,
  mergeBrewsAndEspressoByUniqueDate,
} from "~/components/drinks/DrinksList";
import { Heading } from "~/components/Heading";
import { getEspressos } from "~/db/queries";
import { userAtom } from "~/hooks/useInitUser";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { flagsQueryOptions } from "../../feature-flags";

type EspressoWithBeans = Awaited<ReturnType<typeof getEspressos>>[number];

const PAGE_SIZE = 15;

const espressosQueryOptions = (
  firebaseUid: string,
  limit: number,
  offset: number,
) =>
  queryOptions({
    queryKey: ["espressos", firebaseUid, limit, offset],
    queryFn: () =>
      getEspressos({
        data: { firebaseUid, limit, offset },
      }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/espresso/")({
  component: EspressoList,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function EspressoList() {
  const user = useAtomValue(userAtom);

  const [offset, setOffset] = useState(0);
  const [allEspressos, setAllEspressos] = useState<EspressoWithBeans[]>([]);

  const { data: espressosWithBeans, isLoading } = useQuery<EspressoWithBeans[]>(
    {
      ...espressosQueryOptions(user?.uid ?? "", PAGE_SIZE, offset),
    },
  );

  // TODO: i'm not in love with this
  useEffect(() => {
    if (espressosWithBeans) {
      setAllEspressos((prev) => {
        if (offset === 0) return espressosWithBeans;
        return [...prev, ...espressosWithBeans];
      });
    }
  }, [espressosWithBeans, offset]);

  const drinks = useMemo(
    () => mergeBrewsAndEspressoByUniqueDate([], allEspressos),
    [allEspressos],
  );

  const isSm = useScreenMediaQuery("sm");

  const hasMore = espressosWithBeans && espressosWithBeans.length >= PAGE_SIZE;

  const loadMore = () => {
    setOffset((prev) => prev + PAGE_SIZE);
  };

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.espresso]} />

      <Heading
        actionSlot={
          <Button
            variant="primary"
            colour="accent"
            size={isSm ? "md" : "sm"}
            asChild
          >
            <RouterLink to="/drinks/espresso/add">Add espresso</RouterLink>
          </Button>
        }
      >
        Espressos
      </Heading>

      <div className="mt-4">
        <PostgresDrinksList drinks={drinks} />
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
          <RouterLink to="/drinks/espresso">View all espresso (TBD)</RouterLink>
        </Button>
      </div>
    </>
  );
}
