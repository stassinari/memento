import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { setDoc } from "firebase/firestore";
import { navLinks } from "../../../../../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../../../../../components/Breadcrumbs";
import {
  EspressoForm,
  EspressoFormInputs,
  espressoFormEmptyValues,
} from "../../../../../../components/espresso/EspressoForm";
import { Heading } from "../../../../../../components/Heading";
import { useDocRef } from "../../../../../../hooks/firestore/useDocRef";
import { useFirestoreDocOneTime } from "../../../../../../hooks/firestore/useFirestoreDocOneTime";
import { useNewRef } from "../../../../../../hooks/firestore/useNewBeansRef";
import { espressoToFirestore } from "../../../../../../pages/espresso/EspressoAdd";
import { BaseEspresso } from "../../../../../../types/espresso";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/clone",
)({
  component: EspressoClone,
});

function EspressoClone() {
  const { espressoId } = useParams({ strict: false });
  const navigate = useNavigate();

  const docRef = useDocRef<BaseEspresso>("espresso", espressoId);
  const { details: espresso } = useFirestoreDocOneTime<BaseEspresso>(docRef);

  const newEspressoRef = useNewRef("espresso");

  const addEspresso = async (data: EspressoFormInputs) => {
    await setDoc(newEspressoRef, espressoToFirestore(data));
    navigate({
      to: "/drinks/espresso/$espressoId",
      params: { espressoId: newEspressoRef.id },
    });
  };

  if (!espresso || !espressoId) {
    return null;
  }

  // TODO find an automated way to do this
  const fromFirestore: EspressoFormInputs = {
    ...espressoFormEmptyValues(),
    beans: espresso.beans?.path ?? null,

    machine: espresso.machine,
    grinder: espresso.grinder,
    grinderBurrs: espresso.grinderBurrs,
    portafilter: espresso.portafilter,
    basket: espresso.basket,

    targetWeight: espresso.targetWeight ?? null,
    beansWeight: espresso.beansWeight ?? null,
    waterTemperature: espresso.waterTemperature,
    grindSetting: espresso.grindSetting,
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

      <Heading className="mb-4">Edit espresso details</Heading>

      <EspressoForm
        defaultValues={fromFirestore}
        buttonLabel="Clone"
        mutation={addEspresso}
      />
    </>
  );
}
