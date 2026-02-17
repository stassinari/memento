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
import { addBeans } from "~/db/mutations";
import { userAtom } from "~/hooks/useInitUser";
import { BeanWithDrinks, beansQueryOptions } from ".";

export const Route = createFileRoute("/_auth/_layout/beans/$beansId/clone")({
  component: BeansClone,
});

function BeansClone() {
  console.log("BeansClone");

  const { beansId } = Route.useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const { data: beansWithDrinks } = useSuspenseQuery<BeanWithDrinks | null>(
    beansQueryOptions(beansId, user?.uid ?? ""),
  );

  const mutation = useMutation({
    mutationFn: async (data: BeansFormInputs) => {
      return await addBeans({
        data: { data, firebaseUid: user?.uid ?? "" },
      });
    },
    onSuccess: (result) => {
      // Invalidate all beans queries
      queryClient.invalidateQueries({ queryKey: ["beans"] });

      // Navigate to detail view
      navigate({ to: "/beans/$beansId", params: { beansId: result.id } });
    },
    onError: (error) => {
      console.error("Clone mutation error:", error);
    },
  });

  const handleClone = (data: BeansFormInputs) => {
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
          { label: "Clone" },
        ]}
      />

      <Heading className="mb-4">Clone beans</Heading>

      <BeansForm
        defaultValues={beansWithDrinks}
        buttonLabel="Clone"
        mutation={handleClone}
        showStorageSection={false}
      />
    </>
  );
}
