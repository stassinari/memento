import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { notification } from "~/components/Notification";
import { TastingCreateForm } from "~/components/tastings/TastingCreateForm";
import { TastingSetupFormInputs } from "~/components/tastings/form-types";
import { addTasting } from "~/db/mutations";
import { getSelectableBeans } from "~/db/queries";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/add")({
  component: TastingAddPage,
});

function TastingAddPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: beansList = [] } = useQuery({
    queryKey: ["beans", "notArchived"],
    queryFn: () => getSelectableBeans(),
  });

  const mutation = useMutation({
    mutationFn: async (data: TastingSetupFormInputs) => addTasting({ data: { data } }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["tastings"] });
      queryClient.invalidateQueries({ queryKey: ["beans"] });

      navigate({
        to: "/drinks/tastings/$tastingId/scoring",
        params: { tastingId: result.id },
      });
    },
    onError: (error) => {
      console.error("Add tasting - mutation error:", error);
      notification({
        title: "Could not create tasting",
        subtitle: "Please try again.",
        Icon: <ExclamationCircleIcon className="text-red-400" />,
      });
    },
  });

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings, { label: "Setup" }]} />

      <Heading className="mb-4">Tasting setup</Heading>

      <TastingCreateForm
        beansList={beansList}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </>
  );
}
