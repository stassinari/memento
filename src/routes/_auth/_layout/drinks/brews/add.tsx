import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { doc, limit, orderBy, setDoc, Timestamp } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  BrewForm,
  brewFormEmptyValues,
  BrewFormInputs,
} from "~/components/brews/BrewForm";
import { Heading } from "~/components/Heading";
import { addBrew } from "~/db/mutations";
import { db } from "~/firebaseConfig";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionOneTime } from "~/hooks/firestore/useFirestoreCollectionOneTime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";
import { Brew } from "~/types/brew";

export const Route = createFileRoute("/_auth/_layout/drinks/brews/add")({
  component: BrewsAdd,
});

export const brewToFirestore = (brew: BrewFormInputs) => ({
  ...brew,
  beans: doc(db, brew.beans ?? ""),
  date: brew.date ? Timestamp.fromDate(brew.date) : Timestamp.now(),
});

function BrewsAdd() {
  console.log("BrewsAdd");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const filters = useMemo(() => [orderBy("date", "desc"), limit(1)], []);

  const query = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList, isLoading } =
    useFirestoreCollectionOneTime<Brew>(query);

  const mutation = useMutation({
    mutationFn: async (data: BrewFormInputs) => {
      // 1. Call server function (PostgreSQL write)
      const result = await addBrew({
        data: { data, firebaseUid: user?.uid ?? "" },
      });

      // 2. Conditionally write to Firestore (client-side)
      if (writeToFirestore) {
        try {
          const fsData = brewToFirestore(data);
          await setDoc(
            doc(db, `users/${user?.uid}/brews/${result.id}`),
            fsData,
          );
        } catch (error) {
          console.error("Add brew - Firestore write error:", error);
          // Continue anyway - data is in PostgreSQL
        }
      }

      return result;
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
  });

  const handleAdd = (data: BrewFormInputs) => {
    mutation.mutate(data);
  };

  if (isLoading) return null;

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.drinks, navLinks.brews, { label: "Add" }]}
      />

      <Heading className="mb-4">Add brew</Heading>

      <BrewForm
        defaultValues={brewFormEmptyValues(brewsList[0])}
        buttonLabel="Add"
        mutation={handleAdd}
      />
    </>
  );
}
