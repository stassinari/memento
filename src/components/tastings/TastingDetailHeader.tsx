import type { ReactNode } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { Heading } from "~/components/Heading";
import { formatTastingDate, getTastingVariableLabel } from "~/components/tastings/utils";

interface TastingDetailHeaderProps {
  tastingId: string;
  variable: string | null;
  date: Date | null;
  createdAt: Date;
  headingActionSlot?: ReactNode;
}

export const TastingDetailHeader = ({
  tastingId,
  variable,
  date,
  createdAt,
  headingActionSlot,
}: TastingDetailHeaderProps) => {
  const variableLabel = getTastingVariableLabel(variable ?? "unknown");

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings, { label: variableLabel }]} />

      <Heading actionSlot={headingActionSlot}>Tasting detail</Heading>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/15 dark:text-orange-200 dark:ring-orange-400/40">
          {variableLabel}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatTastingDate(date ?? createdAt)}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button variant="primary" colour="accent" size="sm" asChild>
          <RouterLink to="/drinks/tastings/$tastingId/scoring" params={{ tastingId }}>
            Edit scoring
          </RouterLink>
        </Button>
        <Button variant="white" size="sm" disabled>
          Edit setup
        </Button>
        <Button variant="white" size="sm" disabled>
          Clone
        </Button>
        <Button variant="white" size="sm" disabled>
          Delete
        </Button>
      </div>
    </>
  );
};
