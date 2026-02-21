import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  DrinksList as DrinksListPostgres,
  mergeBrewsAndEspressoByUniqueDate as mergePostgres,
} from "~/components/drinks/DrinksList";
import { Heading } from "~/components/Heading";
import { Link } from "~/components/Link";
import { getBrews, getEspressos } from "~/db/queries";
import { useCurrentUser } from "~/hooks/useInitUser";

const brewsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["brews", userId],
    queryFn: () => getBrews({ data: { userId, limit: 30, offset: 0 } }),
  });

const espressosQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["espressos", userId],
    queryFn: () =>
      getEspressos({ data: { userId, limit: 30, offset: 0 } }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/")({
  component: DrinksPage,
});

function DrinksPage() {
  console.log("DrinksPage");
  const user = useCurrentUser();

  const { data: brewsList } = useSuspenseQuery(
    brewsQueryOptions(user?.dbId ?? ""),
  );
  const { data: espressosList } = useSuspenseQuery(
    espressosQueryOptions(user?.dbId ?? ""),
  );

  if (!brewsList || !espressosList) {
    return null;
  }

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks]} />

      <Heading>Drinks</Heading>

      <ul className="mt-4">
        <li>
          <Link asChild>
            <RouterLink to="/drinks/brews">Go to brews</RouterLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <RouterLink to="/drinks/espresso">Go to espressos</RouterLink>
          </Link>
        </li>
        <li>
          <Link asChild>
            <RouterLink to="/drinks/tastings">Go to tastings</RouterLink>
          </Link>
        </li>
      </ul>

      <DrinksListPostgres
        drinks={mergePostgres(brewsList ?? [], espressosList ?? [])}
      />
    </>
  );
}
