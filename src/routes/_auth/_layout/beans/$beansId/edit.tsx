import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { BeansForm, BeansFormInputs } from "~/components/beans/BeansForm";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { updateBeans } from "~/db/mutations";
import { userAtom } from "~/hooks/useInitUser";
import { beansQueryOptions, BeanWithDrinks } from ".";

export const Route = createFileRoute("/_auth/_layout/beans/$beansId/edit")({
  component: BeansEdit,
});

function BeansEdit() {
  console.log("BeansEdit");

  const { beansId } = Route.useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const { data: beansWithDrinks } = useSuspenseQuery<BeanWithDrinks | null>(
    beansQueryOptions(beansId, user?.dbId ?? ""),
  );

  const mutation = useMutation({
    mutationFn: async (data: BeansFormInputs) => {
      await updateBeans({
        data: {
          data,
          beansId,
          userId: user?.dbId ?? "",
        },
      });
    },
    onSuccess: () => {
      // Invalidate all beans queries
      queryClient.invalidateQueries({ queryKey: ["beans"] });

      // Navigate to detail view
      navigate({ to: "/beans/$beansId", params: { beansId } });
    },
    onError: (error) => {
      console.error("Edit mutation error:", error);
    },
  });

  const handleEdit = (data: BeansFormInputs) => {
    mutation.mutate(data);
  };

  if (!beansWithDrinks) {
    return null;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.beans,
          { label: beansWithDrinks.name, linkTo: "/beans/$beansId" },
          { label: "Edit" },
        ]}
      />

      <Heading className="mb-4">Edit beans</Heading>

      <BeansForm
        defaultValues={beansWithDrinks}
        buttonLabel="Edit"
        mutation={handleEdit}
      />
    </>
  );
}
