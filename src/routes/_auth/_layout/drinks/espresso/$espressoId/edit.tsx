import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  EspressoForm,
  EspressoFormInputs,
} from "~/components/espresso/EspressoForm";
import { Heading } from "~/components/Heading";
import { updateEspresso } from "~/db/mutations";
import { getEspresso } from "~/db/queries";
import type { EspressoWithBeans } from "~/db/types";
import { db } from "~/firebaseConfig";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";
import { BaseEspresso } from "~/types/espresso";
import { espressoToFirestore } from "../add";
import { flagsQueryOptions } from "../../../featureFlags";

const espressoQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions<EspressoWithBeans | null>({
    queryKey: ["espresso", espressoId, firebaseUid],
    queryFn: () =>
      getEspresso({ data: { espressoFbId: espressoId, firebaseUid } }) as Promise<EspressoWithBeans | null>,
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/edit",
)({
  component: EspressoEditDetails,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function EspressoEditDetails() {
  const user = useAtomValue(userAtom);
  const { espressoId } = useParams({ strict: false });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlEspresso } = useSuspenseQuery<EspressoWithBeans | null>(
    espressoQueryOptions(espressoId ?? "", user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const docRef = useDocRef<BaseEspresso>("espresso", espressoId);
  const { details: fbEspresso, isLoading } =
    useFirestoreDocOneTime<BaseEspresso>(docRef);

  const mutation = useMutation({
    mutationFn: async (data: EspressoFormInputs) => {
      // 1. Call server function (PostgreSQL write)
      await updateEspresso({
        data: {
          data,
          espressoFbId: espressoId ?? "",
          firebaseUid: user?.uid ?? "",
        },
      });

      // 2. Conditionally write to Firestore (client-side)
      if (writeToFirestore) {
        try {
          const fsData = espressoToFirestore(data);
          await setDoc(doc(db, `users/${user?.uid}/espresso/${espressoId}`), fsData);
        } catch (error) {
          console.error("Edit espresso - Firestore write error:", error);
          // Continue anyway - data is in PostgreSQL
        }
      }
    },
    onSuccess: () => {
      // Invalidate all espresso queries
      queryClient.invalidateQueries({ queryKey: ["espresso"] });

      // Navigate to detail view
      navigate({
        to: "/drinks/espresso/$espressoId",
        params: { espressoId: espressoId! },
      });
    },
  });

  const handleEdit = (data: EspressoFormInputs) => {
    mutation.mutate(data);
  };

  // Check the appropriate data source based on flag
  const espresso = shouldReadFromPostgres ? sqlEspresso?.espresso : fbEspresso;

  if (isLoading) return null;

  if (!espressoId || !espresso) {
    throw new Error("Espresso does not exist.");
  }

  // Convert to form inputs based on data source
  const defaultValues: EspressoFormInputs = shouldReadFromPostgres
    ? {
        // From PostgreSQL
        date: sqlEspresso!.espresso.date,
        beans: `users/${user?.uid}/beans/${sqlEspresso!.beans?.fbId}`,
        machine: sqlEspresso!.espresso.machine,
        grinder: sqlEspresso!.espresso.grinder,
        grinderBurrs: sqlEspresso!.espresso.grinderBurrs,
        portafilter: sqlEspresso!.espresso.portafilter,
        basket: sqlEspresso!.espresso.basket,
        targetWeight: sqlEspresso!.espresso.targetWeight ?? null,
        beansWeight: sqlEspresso!.espresso.beansWeight ?? null,
        waterTemperature: sqlEspresso!.espresso.waterTemperature,
        grindSetting: sqlEspresso!.espresso.grindSetting,
        actualTime: sqlEspresso!.espresso.actualTime,
        actualWeight: sqlEspresso!.espresso.actualWeight ?? null,
      }
    : {
        // From Firestore
        ...fbEspresso!,
        date: fbEspresso!.date.toDate(),
        beans: fbEspresso!.beans.path,
      };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: `/drinks/espresso/${espressoId}` },
          { label: "Edit", linkTo: "#" },
        ]}
      />

      <Heading className="mb-4">Edit espresso details</Heading>

      <EspressoForm
        defaultValues={defaultValues}
        buttonLabel="Edit"
        mutation={handleEdit}
      />
    </>
  );
}
