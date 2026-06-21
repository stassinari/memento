import { Link } from "@tanstack/react-router";
import { Fragment, ReactNode } from "react";
import { Card } from "~/components/Card";
import { BeansListItem } from "~/db/types";
import { BeanScore } from "../BeanScore";
import { CountryOptionFlag } from "../CountryOptionFlag";

interface BeansHistoryCardsProps {
  beans: BeansListItem[];
}

/**
 * The mobile presentation of History: a card list of compact 2-line rows
 * instead of the table (no room for columns on a phone). Driven by the same
 * filtered + sorted rows as the desktop table, so search/filter/sort all carry
 * over. The whole row links to the bean.
 */
export const BeansHistoryCards = ({ beans }: BeansHistoryCardsProps) => {
  if (beans.length === 0) {
    return (
      <Card.Container
        variant="elevated"
        className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        No beans match these filters.
      </Card.Container>
    );
  }

  return (
    <Card.Container variant="elevated" className="overflow-hidden">
      <div className="divide-y divide-gray-100 dark:divide-white/10">
        {beans.map((bean) => (
          <BeansHistoryCardRow key={bean.id} bean={bean} />
        ))}
      </div>
    </Card.Container>
  );
};

const BeansHistoryCardRow = ({ bean }: { bean: BeansListItem }) => {
  // Roaster · origin · process — origin shows the country (with flag), or "Blend".
  // Only the roaster truncates; the shorter origin/process stay intact.
  const parts: ReactNode[] = [];
  if (bean.roaster) parts.push(<span className="truncate">{bean.roaster}</span>);
  if (bean.origin === "blend") {
    parts.push(<span className="shrink-0">Blend</span>);
  } else if (bean.country) {
    parts.push(
      <span className="flex shrink-0 items-center gap-1">
        <CountryOptionFlag country={bean.country} className="h-3 w-auto rounded-sm" />
        {bean.country}
      </span>,
    );
  }
  if (bean.process) parts.push(<span className="shrink-0">{bean.process}</span>);

  return (
    <div className="relative flex items-center gap-3 px-3.5 py-2.5 hover:bg-gray-50 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-orange-500 dark:hover:bg-white/5">
      <Link
        to="/beans/$beansId"
        params={{ beansId: bean.id }}
        className="min-w-0 flex-1 after:absolute after:inset-0 focus:outline-hidden"
      >
        <p className="truncate text-[14.5px] font-semibold text-gray-900 dark:text-gray-100">
          {bean.name}
        </p>
        {parts.length > 0 && (
          <p className="mt-0.5 flex items-center gap-1.5 overflow-hidden text-[12px] text-gray-500 dark:text-gray-400">
            {parts.map((part, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="shrink-0 text-gray-300 dark:text-gray-600">·</span>}
                {part}
              </Fragment>
            ))}
          </p>
        )}
      </Link>
      <BeanScore score={bean.avgScore} />
    </div>
  );
};
