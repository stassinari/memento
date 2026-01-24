import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { doc, setDoc } from "firebase/firestore";
import { navLinks } from "../../../../../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../../../../../components/Breadcrumbs";
import {
  EspressoForm,
  EspressoFormInputs,
} from "../../../../../../components/espresso/EspressoForm";
import { Heading } from "../../../../../../components/Heading";
import { db } from "../../../../../../firebaseConfig";
import { useDocRef } from "../../../../../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../../../../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../../../../../hooks/useInitUser";
import { espressoToFirestore } from "../../../../../../pages/espresso/EspressoAdd";
import { BaseEspresso } from "../../../../../../types/espresso";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/edit",
)({
  component: EspressoEditDetails,
});

function EspressoEditDetails() {
  const user = useCurrentUser();
  const { espressoId } = useParams({ strict: false });

  const navigate = useNavigate();

  const docRef = useDocRef<BaseEspresso>("espresso", espressoId);
  const { details: espresso, isLoading } =
    useFirestoreDocOneTime<BaseEspresso>(docRef);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!espressoId || !espresso) {
    throw new Error("Espresso does not exist.");
  }

  const existingEspressoRef = doc(
    db,
    "users",
    user.uid,
    "espresso",
    espressoId,
  );

  const editEspresso = async (data: EspressoFormInputs) => {
    await setDoc(existingEspressoRef, espressoToFirestore(data));
    navigate({
      to: "/drinks/espresso/$espressoId",
      params: { espressoId: espressoId! },
    });
  };

  // TODO find an automated way to do this
  const fromFirestore: EspressoFormInputs = {
    ...espresso,
    date: espresso.date.toDate(),
    beans: espresso.beans.path,
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
        defaultValues={fromFirestore}
        buttonLabel="Edit"
        mutation={editEspresso}
      />
    </>
  );
}
