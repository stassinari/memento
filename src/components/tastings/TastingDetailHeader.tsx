import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { Heading } from "~/components/Heading";
import { formatTastingDate, getTastingVariableLabel } from "~/components/tastings/utils";
import { deleteTasting } from "~/db/mutations";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => deleteTasting({ data: { tastingId } }),
    onSuccess: () => {
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ["tastings"] });
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      navigate({ to: "/drinks/tastings" });
    },
    onError: (error) => {
      console.error("Delete tasting - mutation error:", error);
    },
  });

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings, { label: "Detail" }]} />

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
        <Button variant="white" size="sm" asChild>
          <RouterLink to="/drinks/tastings/$tastingId/setup" params={{ tastingId }}>
            Edit setup
          </RouterLink>
        </Button>
        <Button
          variant="white"
          size="sm"
          className="text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
          onClick={() => setShowDeleteDialog(true)}
          disabled={deleteMutation.isPending}
        >
          Delete
        </Button>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete tasting?"
        description="This will permanently delete the tasting and all associated samples, including scoring data."
        confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete tasting"}
        cancelLabel="Cancel"
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setShowDeleteDialog(false);
          }
        }}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
};
