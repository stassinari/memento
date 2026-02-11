import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { doc, limit, orderBy, setDoc, Timestamp } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  EspressoForm,
  espressoFormEmptyValues,
  EspressoFormInputs,
} from "~/components/espresso/EspressoForm";
import { Heading } from "~/components/Heading";
import { addEspresso } from "~/db/mutations";
import { db } from "~/firebaseConfig";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "~/hooks/firestore/useFirestoreCollectionOneTime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";
import { Espresso } from "~/types/espresso";

export const Route = createFileRoute("/_auth/_layout/drinks/espresso/add")({
  component: EspressoAdd,
});

export const espressoToFirestore = (espresso: EspressoFormInputs) => ({
  ...espresso,
  beans: doc(db, espresso.beans ?? ""),
  date: espresso.date ? Timestamp.fromDate(espresso.date) : Timestamp.now(),
});

function EspressoAdd() {
  console.log("EspressoAdd");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const filters = useMemo(() => [orderBy("date", "desc"), limit(1)], []);
  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading } =
    useFirestoreCollectionOneTime<Espresso>(query);

  const mutation = useMutation({
    mutationFn: async (data: EspressoFormInputs) => {
      console.log("Add espresso - mutation starting", data);

      // 1. Call server function (PostgreSQL write)
      const result = await addEspresso({
        data: { data, firebaseUid: user?.uid ?? "" },
      });

      console.log("Add espresso - PostgreSQL write complete", result);

      // 2. Conditionally write to Firestore (client-side)
      if (writeToFirestore) {
        try {
          console.log("Add espresso - Writing to Firestore");
          const fsData = espressoToFirestore(data);
          await setDoc(
            doc(db, `users/${user?.uid}/espresso/${result.id}`),
            fsData,
          );
          console.log("Add espresso - Firestore write complete");
        } catch (error) {
          console.error("Add espresso - Firestore write error:", error);
          // Continue anyway - data is in PostgreSQL
        }
      }

      return result;
    },
    onSuccess: (result) => {
      console.log("Add espresso - onSuccess called, navigating to:", result.id);
      // Invalidate all espresso queries
      queryClient.invalidateQueries({ queryKey: ["espresso"] });

      // Navigate to detail view
      navigate({
        to: "/drinks/espresso/$espressoId",
        params: { espressoId: result.id },
      });
    },
    onError: (error) => {
      console.error("Add espresso - mutation error:", error);
    },
  });

  const handleAdd = (data: EspressoFormInputs) => {
    mutation.mutate(data);
  };

  if (isLoading) return null;

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.drinks, navLinks.espresso, { label: "Add" }]}
      />

      <Heading className="mb-4">Add espresso</Heading>

      <EspressoForm
        defaultValues={espressoFormEmptyValues(espressoList[0])}
        buttonLabel="Add"
        mutation={handleAdd}
      />
    </>
  );
}
