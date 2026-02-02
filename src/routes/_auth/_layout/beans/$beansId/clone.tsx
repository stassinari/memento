import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
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
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";
import { Beans } from "~/types/beans";

export const Route = createFileRoute("/_auth/_layout/beans/$beansId/clone")({
  component: BeansClone,
});

function BeansClone() {
  console.log("BeansClone");

  const { beansId } = useParams({ strict: false });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: beans } = useFirestoreDocOneTime<Beans>(docRef);

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
      console.error("Clone mutation error:", error);
    },
  });

  const handleClone = (data: BeansFormInputs) => {
    mutation.mutate(data);
  };

  if (!beans) {
    return null;
  }

  const fromFirestore: BeansFormInputs = {
    ...beansFormEmptyValues,

    name: beans.name,
    roaster: beans.roaster,
    roastDate: beans.roastDate?.toDate() ?? null,
    roastStyle: beans.roastStyle,
    roastLevel: beans.roastLevel,
    roastingNotes: beans.roastingNotes,

    origin: beans.origin,

    ...(beans.origin === "single-origin"
      ? {
          country: beans.country,
          farmer: beans.farmer,
          region: beans.region,
          process: beans.process,
          varietals: beans.varietals,
          harvestDate: beans.harvestDate?.toDate() ?? null,
          altitude: beans.altitude,
        }
      : {
          blend: beans.blend,
        }),
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.beans,
          { label: beans.name, linkTo: `/beans/${beansId}` },
          { label: "Clone", linkTo: "#" },
        ]}
      />

      <Heading className="mb-4">Clone beans</Heading>

      <BeansForm
        defaultValues={fromFirestore}
        buttonLabel="Clone"
        mutation={handleClone}
        showStorageSection={false}
      />
    </>
  );
}
