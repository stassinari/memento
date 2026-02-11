import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { doc, orderBy, updateDoc } from "firebase/firestore";
import { useMemo } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  DecentEspressoForm,
  DecentEspressoFormInputs,
  decentEspressoFormEmptyValues,
} from "~/components/espresso/steps/DecentEspressoForm.Firebase";
import {
  DecentEspressoFormPostgres,
  decentEspressoFormEmptyValuesPostgres,
} from "~/components/espresso/steps/DecentEspressoForm.Postgres";
import { Heading } from "~/components/Heading";
import { updateDecentEspressoDetails } from "~/db/mutations";
import { getBeans, getEspresso, getEspressos } from "~/db/queries";
import type { BeansWithUser, EspressoWithBeans } from "~/db/types";
import { db } from "~/firebaseConfig";
import { useCollectionQuery } from "~/hooks/firestore/useCollectionQuery";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreCollectionOneTime } from "~/hooks/firestore/useFirestoreCollectionOneTime";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { useCurrentUser } from "~/hooks/useInitUser";
import { flagsQueryOptions } from "~/routes/_auth/_layout/feature-flags";
import { DecentEspressoPrep, Espresso } from "~/types/espresso";

const espressoQueryOptions = (espressoId: string, firebaseUid: string) =>
  queryOptions<EspressoWithBeans | null>({
    queryKey: ["espresso", espressoId, firebaseUid],
    queryFn: () =>
      getEspresso({
        data: { espressoFbId: espressoId, firebaseUid },
      }) as Promise<EspressoWithBeans | null>,
  });

const espressosQueryOptions = (firebaseUid: string) =>
  queryOptions<EspressoWithBeans[]>({
    queryKey: ["espressos", firebaseUid],
    queryFn: () =>
      getEspressos({ data: firebaseUid }) as Promise<EspressoWithBeans[]>,
  });

const beansQueryOptions = (firebaseUid: string) =>
  queryOptions<BeansWithUser[]>({
    queryKey: ["beans", firebaseUid],
    queryFn: () => getBeans({ data: firebaseUid }) as Promise<BeansWithUser[]>,
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/decent/add",
)({
  component: DecentEspressoAddDetails,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

const decentEspressoToFirestore = (espresso: DecentEspressoFormInputs) => ({
  ...espresso,
  partial: false,
  beans: doc(db, espresso.beans ?? ""),
});

function DecentEspressoAddDetails() {
  const user = useCurrentUser();
  const { espressoId } = useParams({ strict: false });
  const navigate = useNavigate();

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const readFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  // PostgreSQL data
  const { data: sqlEspresso } = useSuspenseQuery(
    espressoQueryOptions(espressoId ?? "", user?.uid ?? ""),
  );
  const { data: sqlEspressoList } = useSuspenseQuery(
    espressosQueryOptions(user?.uid ?? ""),
  );
  const { data: sqlBeansList } = useSuspenseQuery(
    beansQueryOptions(user?.uid ?? ""),
  );

  // Firestore data
  const existingEspressoRef = useDocRef<DecentEspressoPrep>(
    "espresso",
    espressoId,
  );
  const { details: fbPartialEspresso, isLoading } =
    useFirestoreDocOneTime<DecentEspressoPrep>(existingEspressoRef);

  const filters = useMemo(() => [orderBy("date", "desc")], []);
  const query = useCollectionQuery<Espresso>("espresso", filters);
  const { list: fbEspressoList, isLoading: areEspressoLoading } =
    useFirestoreCollectionOneTime(query);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading || areEspressoLoading) return null;

  const editDecentEspresso = async (data: DecentEspressoFormInputs) => {
    if (!user?.uid || !espressoId) {
      throw new Error("User or espresso ID missing");
    }

    // 1. Update PostgreSQL
    await updateDecentEspressoDetails({
      data: {
        data: {
          beans: data.beans,
          grindSetting: data.grindSetting,
          machine: data.machine,
          grinder: data.grinder,
          grinderBurrs: data.grinderBurrs,
          portafilter: data.portafilter,
          basket: data.basket,
          actualWeight: data.actualWeight,
          targetWeight: data.targetWeight,
          beansWeight: data.beansWeight,
        },
        espressoFbId: espressoId,
        firebaseUid: user.uid,
      },
    });

    // 2. Conditionally update Firestore
    if (writeToFirestore) {
      try {
        await updateDoc(existingEspressoRef, decentEspressoToFirestore(data));
      } catch (error: any) {
        if (error?.code === "not-found") {
          console.warn(
            "Update decent espresso - Espresso not found in Firestore",
          );
        } else {
          console.error(
            "Update decent espresso - Firestore update error:",
            error,
          );
        }
      }
    }

    navigate({
      to: "/drinks/espresso/$espressoId",
      params: { espressoId: espressoId! },
    });
  };

  // Render Postgres version
  if (readFromPostgres) {
    const partialEspresso = sqlEspresso?.espresso;
    const lastNonPartialEspresso = sqlEspressoList?.find(
      (e) => e.espresso.fromDecent && !e.espresso.partial,
    )?.espresso;

    if (!espressoId || !partialEspresso) {
      throw new Error("Espresso does not exist.");
    }

    const espressoListForForm = sqlEspressoList?.map((e) => e.espresso) ?? [];

    return (
      <>
        <BreadcrumbsWithHome
          items={[
            navLinks.drinks,
            navLinks.espresso,
            { label: "Detail", linkTo: "/drinks/espresso/$espressoId" },
            { label: "Add info" },
          ]}
        />

        <Heading className="mb-4">
          Add info ({partialEspresso.profileName})
        </Heading>

        <DecentEspressoFormPostgres
          defaultValues={decentEspressoFormEmptyValuesPostgres(
            partialEspresso,
            lastNonPartialEspresso,
          )}
          espressoList={espressoListForForm}
          beansList={sqlBeansList?.map((b) => b.beans) ?? []}
          mutation={editDecentEspresso}
          backLink={"/drinks/espresso"}
        />
      </>
    );
  }

  // Render Firebase version
  const partialEspresso = fbPartialEspresso;
  const lastNonPartialEspresso = fbEspressoList.filter(
    (e) => e.fromDecent && !e.partial,
  )[0];

  if (!espressoId || !partialEspresso) {
    throw new Error("Espresso does not exist.");
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: "/drinks/espresso/$espressoId" },
          { label: "Add info" },
        ]}
      />

      <Heading className="mb-4">
        Add info ({partialEspresso.profileName})
      </Heading>

      <DecentEspressoForm
        defaultValues={decentEspressoFormEmptyValues(
          partialEspresso,
          lastNonPartialEspresso,
        )}
        espressoList={fbEspressoList}
        mutation={editDecentEspresso}
        backLink={"/drinks/espresso"}
      />
    </>
  );
}
