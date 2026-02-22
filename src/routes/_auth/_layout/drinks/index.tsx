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

const brewsQueryOptions = () =>
  queryOptions({
    queryKey: ["brews"],
    queryFn: () => getBrews({ data: { limit: 30, offset: 0 } }),
  });

const espressosQueryOptions = () =>
  queryOptions({
    queryKey: ["espressos"],
    queryFn: () => getEspressos({ data: { limit: 30, offset: 0 } }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/")({
  component: DrinksPage,
});

function DrinksPage() {
  console.log("DrinksPage");

  const { data: brewsList } = useSuspenseQuery(brewsQueryOptions());
  const { data: espressosList } = useSuspenseQuery(espressosQueryOptions());

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

      <DrinksListPostgres drinks={mergePostgres(brewsList ?? [], espressosList ?? [])} />
    </>
  );
}
