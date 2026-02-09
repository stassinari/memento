import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { doc, setDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  EspressoForm,
  EspressoFormInputs,
  espressoFormEmptyValues,
} from "~/components/espresso/EspressoForm";
import { Heading } from "~/components/Heading";
import { addEspresso } from "~/db/mutations";
import { getEspresso } from "~/db/queries";
import type { EspressoWithBeans } from "~/db/types";
import { db } from "~/firebaseConfig";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";
import { BaseEspresso } from "~/types/espresso";
import { flagsQueryOptions } from "../../../feature-flags";
import { espressoToFirestore } from "../add";

const espressoQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions<EspressoWithBeans | null>({
    queryKey: ["espresso", espressoId, firebaseUid],
    queryFn: () =>
      getEspresso({
        data: { espressoFbId: espressoId, firebaseUid },
      }) as Promise<EspressoWithBeans | null>,
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/clone",
)({
  component: EspressoClone,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function EspressoClone() {
  const { espressoId } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlEspresso } = useSuspenseQuery<EspressoWithBeans | null>(
    espressoQueryOptions(espressoId ?? "", user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const docRef = useDocRef<BaseEspresso>("espresso", espressoId);
  const { details: fbEspresso } = useFirestoreDocOneTime<BaseEspresso>(docRef);

  const mutation = useMutation({
    mutationFn: async (data: EspressoFormInputs) => {
      console.log("Clone espresso - mutation starting", data);

      // 1. Call server function (PostgreSQL write)
      const result = await addEspresso({
        data: { data, firebaseUid: user?.uid ?? "" },
      });

      console.log("Clone espresso - PostgreSQL write complete", result);

      // 2. Conditionally write to Firestore (client-side)
      if (writeToFirestore) {
        try {
          console.log("Clone espresso - Writing to Firestore");
          const fsData = espressoToFirestore(data);
          await setDoc(
            doc(db, `users/${user?.uid}/espresso/${result.id}`),
            fsData,
          );
          console.log("Clone espresso - Firestore write complete");
        } catch (error) {
          console.error("Clone espresso - Firestore write error:", error);
          // Continue anyway - data is in PostgreSQL
        }
      }

      return result;
    },
    onSuccess: (result) => {
      console.log(
        "Clone espresso - onSuccess called, navigating to:",
        result.id,
      );
      // Invalidate all espresso queries
      queryClient.invalidateQueries({ queryKey: ["espresso"] });

      // Navigate to detail view
      navigate({
        to: "/drinks/espresso/$espressoId",
        params: { espressoId: result.id },
      });
    },
    onError: (error) => {
      console.error("Clone espresso - mutation error:", error);
    },
  });

  const handleClone = (data: EspressoFormInputs) => {
    mutation.mutate(data);
  };

  // Check the appropriate data source based on flag
  const espresso = shouldReadFromPostgres ? sqlEspresso?.espresso : fbEspresso;

  if (!espresso || !espressoId) {
    return null;
  }

  // Convert to form inputs based on data source
  const defaultValues: EspressoFormInputs = shouldReadFromPostgres
    ? {
        // From PostgreSQL
        ...espressoFormEmptyValues(),
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
      }
    : {
        // From Firestore
        ...espressoFormEmptyValues(),
        beans: fbEspresso!.beans?.path ?? null,
        machine: fbEspresso!.machine,
        grinder: fbEspresso!.grinder,
        grinderBurrs: fbEspresso!.grinderBurrs,
        portafilter: fbEspresso!.portafilter,
        basket: fbEspresso!.basket,
        targetWeight: fbEspresso!.targetWeight ?? null,
        beansWeight: fbEspresso!.beansWeight ?? null,
        waterTemperature: fbEspresso!.waterTemperature,
        grindSetting: fbEspresso!.grindSetting,
      };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: `/drinks/espresso/${espressoId}` },
          { label: "Clone", linkTo: "#" },
        ]}
      />

      <Heading className="mb-4">Clone espresso</Heading>

      <EspressoForm
        defaultValues={defaultValues}
        buttonLabel="Clone"
        mutation={handleClone}
      />
    </>
  );
}
