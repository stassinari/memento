import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import {
  BeansForm,
  BeansFormInputs,
  beansFormEmptyValues,
} from "~/components/beans/BeansForm";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { addBeans } from "~/db/mutations";
import { db as firestore } from "~/firebaseConfig";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";

export const Route = createFileRoute("/_auth/_layout/beans/add")({
  component: BeansAdd,
});

function BeansAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const mutation = useMutation({
    mutationFn: async (data: BeansFormInputs) => {
      // 1. Call server function (handles PostgreSQL write)
      const result = await addBeans({
        data: { data, firebaseUid: user?.uid ?? "" },
      });

      // 2. Conditionally write to Firestore (client-side)
      if (writeToFirestore) {
        const fsData =
          data.origin === "single-origin"
            ? {
                name: data.name!,
                roaster: data.roaster!,
                roastDate: data.roastDate
                  ? Timestamp.fromDate(data.roastDate)
                  : null,
                roastStyle: data.roastStyle,
                roastLevel: data.roastLevel,
                roastingNotes: data.roastingNotes,
                freezeDate: data.freezeDate
                  ? Timestamp.fromDate(data.freezeDate)
                  : null,
                thawDate: data.thawDate
                  ? Timestamp.fromDate(data.thawDate)
                  : null,
                isFinished: data.isFinished ?? false,
                origin: "single-origin" as const,
                country: data.country,
                region: data.region,
                varietals: data.varietals,
                altitude: data.altitude,
                process: data.process,
                farmer: data.farmer,
                harvestDate: data.harvestDate
                  ? Timestamp.fromDate(data.harvestDate)
                  : null,
              }
            : {
                name: data.name!,
                roaster: data.roaster!,
                roastDate: data.roastDate
                  ? Timestamp.fromDate(data.roastDate)
                  : null,
                roastStyle: data.roastStyle,
                roastLevel: data.roastLevel,
                roastingNotes: data.roastingNotes,
                freezeDate: data.freezeDate
                  ? Timestamp.fromDate(data.freezeDate)
                  : null,
                thawDate: data.thawDate
                  ? Timestamp.fromDate(data.thawDate)
                  : null,
                isFinished: data.isFinished ?? false,
                origin: "blend" as const,
                blend: data.blend,
              };

        await setDoc(
          doc(firestore, `users/${user?.uid}/beans/${result.id}`),
          fsData,
        );
      }

      return result;
    },
    onSuccess: (result) => {
      // Invalidate all beans queries
      queryClient.invalidateQueries({ queryKey: ["beans"] });

      // Navigate to detail view
      navigate({ to: "/beans/$beansId", params: { beansId: result.id } });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const handleAdd = (data: BeansFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.beans, { label: "Add" }]} />

      <Heading className="mb-4">Add beans</Heading>

      <BeansForm
        defaultValues={beansFormEmptyValues}
        buttonLabel="Add"
        mutation={handleAdd}
        showStorageSection={false}
      />
    </>
  );
}
