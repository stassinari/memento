import { Tab } from "@headlessui/react";
import { PuzzlePieceIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import tw from "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import {
  ButtonWithDropdown,
  ButtonWithDropdownProps,
} from "../../components/ButtonWithDropdown";
import { Heading } from "../../components/Heading";
import { DecentCharts } from "../../components/espresso/charts/DecentCharts";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "../../hooks/firestore/useFirestoreDocRealtime";
import useScreenMediaQuery from "../../hooks/useScreenMediaQuery";
import { Espresso } from "../../types/espresso";
import { NotFound } from "../NotFound";
import { tabStyles } from "../beans/BeansList/BeansList";
import { EspressoDetailsInfo } from "./EspressoDetailsInfo";
import { EspressoDetailsOutcome } from "./EspressoDetailsOutcome";

const EspressoDetails: React.FC = () => {
  console.log("EspressoDetails");

  const { espressoId } = useParams();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const docRef = useDocRef<Espresso>("espresso", espressoId);
  const { details: espresso, isLoading } =
    useFirestoreDocRealtime<Espresso>(docRef);

  const handleDelete = useCallback(async () => {
    await deleteDoc(docRef);
    navigate(`/drinks/espresso`);
  }, [docRef, navigate]);

  const decentEspressoButtons: ButtonWithDropdownProps = useMemo(
    () => ({
      mainButton: { type: "link", label: "Edit outcome", href: "outcome" },
      dropdownItems: [
        { type: "link", label: "Edit details", href: "decent/edit" },
        { type: "button", label: "Delete", onClick: handleDelete },
      ],
    }),
    [handleDelete]
  );

  const normalEspressoButtons: ButtonWithDropdownProps = useMemo(
    () => ({
      mainButton: { type: "link", label: "Clone", href: "clone" },
      dropdownItems: [
        { type: "link", label: "Edit details", href: "edit" },
        { type: "link", label: "Edit outcome", href: "outcome" },
        { type: "button", label: "Delete", onClick: handleDelete },
      ],
    }),
    [handleDelete]
  );

  if (isLoading) return null;

  if (!espresso) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.espresso,
          { label: "Detail", linkTo: "#" },
        ]}
      />

      <Heading
        actionSlot={
          <ButtonWithDropdown
            {...(espresso.fromDecent
              ? decentEspressoButtons
              : normalEspressoButtons)}
          />
        }
      >
        Espresso detail
      </Heading>

      <div tw="mb-2 text-sm text-gray-500">
        {dayjs(espresso.date.toDate()).format("DD MMM YYYY @ H:m")}
      </div>

      {espresso.fromDecent && espresso.partial && (
        <div tw="inline-flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            as={Link}
            to="decent/add"
            Icon={<PuzzlePieceIcon />}
            tw="shrink-0"
          >
            Add shot info
          </Button>
          <span>This shot is missing some information!</span>
        </div>
      )}

      {espresso.fromDecent && <DecentCharts espressoId={espressoId} />}

      {isSm ? (
        <div tw="grid grid-cols-2 gap-4 my-6">
          <div>
            <h2 tw="mb-5 text-lg font-semibold text-center text-gray-900">
              Espresso info
            </h2>

            <EspressoDetailsInfo espresso={espresso} />
          </div>

          <div>
            <h2 tw="mb-5 text-lg font-semibold text-center text-gray-900">
              Outcome
            </h2>

            <EspressoDetailsOutcome espresso={espresso} />
          </div>
        </div>
      ) : (
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List tw="flex -mb-px">
            <Tab css={[tabStyles(selectedIndex === 0), tw`w-1/2`]}>Info</Tab>
            <Tab css={[tabStyles(selectedIndex === 1), tw`w-1/2`]}>Outcome</Tab>
          </Tab.List>
          <Tab.Panels tw="mt-4">
            <Tab.Panel>
              <EspressoDetailsInfo espresso={espresso} />
            </Tab.Panel>
            <Tab.Panel>
              <EspressoDetailsOutcome espresso={espresso} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </>
  );
};

export default EspressoDetails;
