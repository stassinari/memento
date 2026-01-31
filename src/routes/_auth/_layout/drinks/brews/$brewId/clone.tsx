import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { setDoc } from "firebase/firestore";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import {
  BrewForm,
  BrewFormInputs,
  brewFormEmptyValues,
} from "~/components/brews/BrewForm";
import { Heading } from "~/components/Heading";
import { useDocRef } from "~/hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "~/hooks/firestore/useFirestoreDocOneTime";
import { useNewRef } from "~/hooks/firestore/useNewBeansRef";
import { Brew } from "~/types/brew";
import { brewToFirestore } from "../add.lazy";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/clone",
)({
  component: BrewClone,
});

function BrewClone() {
  console.log("BrewClone");

  const { brewId } = useParams({ strict: false });
  const navigate = useNavigate();

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: brew } = useFirestoreDocOneTime<Brew>(docRef);

  const newBrewRef = useNewRef("brews");

  const addBrew = async (data: BrewFormInputs) => {
    await setDoc(newBrewRef, brewToFirestore(data));
    navigate({
      to: "/drinks/brews/$brewId",
      params: { brewId: newBrewRef.id },
    });
  };

  if (!brew || !brewId) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: BrewFormInputs = {
    ...brewFormEmptyValues(),
    method: brew.method,
    beans: brew.beans.path,

    grinder: brew.grinder,
    grinderBurrs: brew.grinderBurrs,
    waterType: brew.waterType,
    filterType: brew.filterType,

    waterWeight: brew.waterWeight,
    beansWeight: brew.beansWeight,
    waterTemperature: brew.waterTemperature,
    grindSetting: brew.grindSetting,
  };

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: `/drinks/brews/${brewId}` },
          { label: "Clone", linkTo: "#" },
        ]}
      />

      <Heading className="mb-4">Clone brew</Heading>

      <BrewForm
        defaultValues={fromFirestore}
        buttonLabel="Clone"
        mutation={addBrew}
      />
    </>
  );
}
