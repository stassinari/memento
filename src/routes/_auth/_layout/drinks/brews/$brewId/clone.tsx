import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { BrewForm, BrewFormInputs } from "~/components/brews/BrewForm";
import { Heading } from "~/components/Heading";
import { addBrew } from "~/db/mutations";
import { getBrew } from "~/db/queries";
import { userAtom } from "~/hooks/useInitUser";

const brewQueryOptions = (brewId: string, firebaseUid: string) =>
  queryOptions({
    queryKey: ["brews", brewId],
    queryFn: () =>
      getBrew({
        data: { brewId, firebaseUid },
      }),
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/clone",
)({
  component: BrewClone,
});

function BrewClone() {
  console.log("BrewClone");

  const { brewId } = Route.useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const { data: brew, isLoading } = useSuspenseQuery(
    brewQueryOptions(brewId ?? "", user?.uid ?? ""),
  );

  const mutation = useMutation({
    mutationFn: async (data: BrewFormInputs) => {
      return await addBrew({
        data: { data, firebaseUid: user?.uid ?? "" },
      });
    },
    onSuccess: (result) => {
      // Invalidate all brews queries
      queryClient.invalidateQueries({ queryKey: ["brews"] });

      // Navigate to detail view
      navigate({
        to: "/drinks/brews/$brewId",
        params: { brewId: result.id },
      });
    },
    onError: (error) => {
      console.error("Clone brew - mutation error:", error);
    },
  });

  const handleClone = (data: BrewFormInputs) => {
    mutation.mutate(data);
  };

  if (!brew || !brewId || isLoading) {
    return null;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: "/drinks/brews/$brewId" },
          { label: "Clone" },
        ]}
      />

      <Heading className="mb-4">Clone brew</Heading>

      <BrewForm
        defaultValues={{ ...brew, beans: brew.beans.id }}
        buttonLabel="Clone"
        mutation={handleClone}
      />
    </>
  );
}
