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
import { Heading } from "~/components/Heading";
import { BrewForm, BrewFormInputs } from "~/components/brews/BrewForm";
import { updateBrew } from "~/db/mutations";
import { getBrew } from "~/db/queries";
import { db } from "~/firebaseConfig";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { userAtom } from "~/hooks/useInitUser";
import { Brew } from "~/types/brew";
import { flagsQueryOptions } from "../../../feature-flags";
import { brewToFirestore } from "../add";

type BrewWithBeans = NonNullable<Awaited<ReturnType<typeof getBrew>>>;

const brewQueryOptions = (brewId: string, firebaseUid: string) =>
  queryOptions<BrewWithBeans | null>({
    queryKey: ["brews", brewId, firebaseUid],
    queryFn: () =>
      getBrew({
        data: { brewFbId: brewId, firebaseUid },
      }) as Promise<BrewWithBeans | null>,
  });

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/edit",
)({
  component: BrewEditDetails,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(flagsQueryOptions());
  },
});

function BrewEditDetails() {
  console.log("BrewEditDetails");

  const user = useAtomValue(userAtom);
  const { brewId } = useParams({ strict: false });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const { data: flags } = useSuspenseQuery(flagsQueryOptions());
  const { data: sqlBrew } = useSuspenseQuery<BrewWithBeans | null>(
    brewQueryOptions(brewId ?? "", user?.uid ?? ""),
  );

  const shouldReadFromPostgres = flags?.find(
    (flag) => flag.name === "read_from_postgres",
  )?.enabled;

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: fbBrew, isLoading } = useFirestoreDocOneTime<Brew>(docRef);

  const mutation = useMutation({
    mutationFn: async (data: BrewFormInputs) => {
      // 1. Call server function (PostgreSQL write)
      await updateBrew({
        data: {
          data,
          brewFbId: brewId ?? "",
          firebaseUid: user?.uid ?? "",
        },
      });

      // 2. Conditionally write to Firestore (client-side)
      if (writeToFirestore) {
        try {
          const fsData = brewToFirestore(data);
          await setDoc(doc(db, `users/${user?.uid}/brews/${brewId}`), fsData);
        } catch (error) {
          console.error("Edit brew - Firestore write error:", error);
          // Continue anyway - data is in PostgreSQL
        }
      }
    },
    onSuccess: () => {
      // Invalidate all brews queries
      queryClient.invalidateQueries({ queryKey: ["brews"] });

      // Navigate to detail view
      navigate({ to: "/drinks/brews/$brewId", params: { brewId: brewId! } });
    },
  });

  const handleEdit = (data: BrewFormInputs) => {
    mutation.mutate(data);
  };

  // Check the appropriate data source based on flag
  const brew = shouldReadFromPostgres ? sqlBrew?.brews : fbBrew;

  if (isLoading) return null;

  if (!brewId || !brew) {
    throw new Error("Brew does not exist.");
  }

  // Convert to form inputs based on data source
  const defaultValues: BrewFormInputs = shouldReadFromPostgres
    ? {
        // From PostgreSQL
        date: sqlBrew!.brews.date,
        method: sqlBrew!.brews.method,
        beans: `users/${user?.uid}/beans/${sqlBrew!.beans.fbId}`,
        grinder: sqlBrew!.brews.grinder,
        grinderBurrs: sqlBrew!.brews.grinderBurrs,
        waterType: sqlBrew!.brews.waterType,
        filterType: sqlBrew!.brews.filterType,
        waterWeight: sqlBrew!.brews.waterWeight,
        beansWeight: sqlBrew!.brews.beansWeight,
        waterTemperature: sqlBrew!.brews.waterTemperature,
        grindSetting: sqlBrew!.brews.grindSetting,
        timeMinutes: sqlBrew!.brews.timeMinutes,
        timeSeconds: sqlBrew!.brews.timeSeconds,
      }
    : {
        // From Firestore
        ...fbBrew!,
        date: fbBrew!.date.toDate(),
        beans: fbBrew!.beans.path,
      };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: "/drinks/brews/$brewId" },
          { label: "Edit" },
        ]}
      />

      <Heading className="mb-4">Edit brew details</Heading>

      <BrewForm
        defaultValues={defaultValues}
        buttonLabel="Edit"
        mutation={handleEdit}
      />
    </>
  );
}
