import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { notification } from "~/components/Notification";
import { TastingCreateForm } from "~/components/tastings/TastingCreateForm";
import { TastingSetupFormInputs } from "~/components/tastings/form-types";
import { mapTastingSetupFormValuesFromTasting } from "~/components/tastings/setup-mappers";
import { updateTastingSetup } from "~/db/mutations";
import { getSelectableBeans } from "~/db/queries";
import { tastingQueryOptions } from "~/hooks/queries/tastings";

const selectableBeansQueryOptions = () =>
  queryOptions({
    queryKey: ["beans", "notArchived"],
    queryFn: () => getSelectableBeans(),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId/setup")({
  component: TastingEditSetupPage,
});

function TastingEditSetupPage() {
  const { tastingId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tasting, isLoading: isLoadingTasting } = useQuery(tastingQueryOptions(tastingId));
  const { data: beansList = [], isLoading: isLoadingBeans } = useQuery(
    selectableBeansQueryOptions(),
  );

  const mutation = useMutation({
    mutationFn: async (data: TastingSetupFormInputs) =>
      updateTastingSetup({ data: { tastingId, data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tastings"] });
      queryClient.invalidateQueries({ queryKey: ["tastings", tastingId] });
      queryClient.invalidateQueries({ queryKey: ["beans"] });

      navigate({
        to: "/drinks/tastings/$tastingId",
        params: { tastingId },
      });
    },
    onError: (error) => {
      console.error("Update tasting setup - mutation error:", error);
      notification({
        title: "Could not update tasting setup",
        subtitle: "Please try again.",
        Icon: <ExclamationCircleIcon className="text-red-400" />,
      });
    },
  });

  if (isLoadingTasting || isLoadingBeans) {
    return null;
  }

  if (!tasting) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.tastings,
          { label: "Detail", link: { to: "/drinks/tastings/$tastingId", params: { tastingId } } },
          { label: "Setup" },
        ]}
      />

      <Heading className="mb-4">Edit tasting setup</Heading>

      <TastingCreateForm
        beansList={beansList}
        mode="edit"
        defaultValues={mapTastingSetupFormValuesFromTasting(tasting)}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </>
  );
}
