import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { Heading } from "~/components/Heading";
import { formatTastingDate, getTastingVariableLabel } from "~/components/tastings/utils";
import { deleteTasting } from "~/db/mutations";
import { Badge } from "../Badge";
import { ButtonWithDropdown } from "../ButtonWithDropdown";

interface TastingDetailHeaderProps {
  tastingId: string;
  variable: string | null;
  date: Date | null;
  createdAt: Date;
}

export const TastingDetailHeader = ({
  tastingId,
  variable,
  date,
  createdAt,
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

      <Heading
        actionSlot={
          <ButtonWithDropdown
            mainButton={{
              type: "link",
              label: "Edit scoring",
              linkProps: { to: "/drinks/tastings/$tastingId/scoring", params: { tastingId } },
            }}
            dropdownItems={[
              {
                type: "link",
                label: "Edit setup",
                linkProps: { to: "/drinks/tastings/$tastingId/setup", params: { tastingId } },
              },
              {
                type: "button",
                label: "Delete",
                onClick: () => setShowDeleteDialog(true),
              },
            ]}
          />
        }
      >
        Tasting detail
      </Heading>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatTastingDate(date ?? createdAt)}
        </span>
        <Badge label={variableLabel} colour="orange" />
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
