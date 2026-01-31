import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { doc, setDoc } from "firebase/firestore";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";
import { BrewForm, BrewFormInputs } from "~/components/brews/BrewForm";
import { db } from "~/firebaseConfig";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "~/hooks/useInitUser";
import { Brew } from "~/types/brew";
import { brewToFirestore } from "../add.lazy";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/edit",
)({
  component: BrewEditDetails,
});

function BrewEditDetails() {
  console.log("BrewEditDetails");

  const user = useCurrentUser();
  const { brewId } = useParams({ strict: false });

  const navigate = useNavigate();

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: brew, isLoading } = useFirestoreDocOneTime<Brew>(docRef);

  if (!user) throw new Error("User is not logged in.");

  if (isLoading) return null;

  if (!brewId || !brew) {
    throw new Error("Brew does not exist.");
  }

  const existingBrewRef = doc(db, "users", user.uid, "brews", brewId);

  const editBrew = async (data: BrewFormInputs) => {
    await setDoc(existingBrewRef, brewToFirestore(data));
    navigate({ to: "/drinks/brews/$brewId", params: { brewId: brewId! } });
  };

  // TODO find an automated way to do this
  const fromFirestore: BrewFormInputs = {
    ...brew,
    date: brew.date.toDate(),
    beans: brew.beans.path,
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: `/drinks/brews/${brewId}` },
          { label: "Edit", linkTo: "#" },
        ]}
      />

      <Heading className="mb-4">Edit brew details</Heading>

      <BrewForm
        defaultValues={fromFirestore}
        buttonLabel="Edit"
        mutation={editBrew}
      />
    </>
  );
}
