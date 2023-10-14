import { PuzzlePieceIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
import React, { useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import {
  ButtonWithDropdown,
  ButtonWithDropdownProps,
} from "../../components/ButtonWithDropdown";
import { DetailsCard } from "../../components/Details";
import { Heading } from "../../components/Heading";
import { BeansShortInfo } from "../../components/beans/BeansShortInfo";
import { useDrinkRatio } from "../../components/drinks/useDrinkRatio";
import { DecentCharts } from "../../components/espresso/charts/DecentCharts";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "../../hooks/firestore/useFirestoreDocRealtime";
import { Espresso } from "../../types/espresso";
import { getEyFromEspresso } from "../../utils";
import { NotFound } from "../NotFound";

const EspressoDetails: React.FC = () => {
  console.log("EspressoDetails");

  const { espressoId } = useParams();
  const navigate = useNavigate();

  const docRef = useDocRef<Espresso>("espresso", espressoId);
  const { details: espresso, isLoading } =
    useFirestoreDocRealtime<Espresso>(docRef);

  const handleDelete = useCallback(async () => {
    await deleteDoc(docRef);
    navigate(`/drinks/espresso`);
  }, [docRef, navigate]);

  const { waterByBeans } = useDrinkRatio(
    espresso?.beansWeight ?? 0,
    espresso?.actualWeight ?? espresso?.targetWeight ?? 0
  );

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

      <div tw="mt-4 space-y-4">
        <DetailsCard
          title="Rating"
          rows={[
            {
              label: "Overall score",
              value: espresso.rating ? `${espresso.rating}/10` : "",
            },
            {
              label: "Notes",
              value: (
                <article tw="prose-sm prose">
                  <ReactMarkdown>{espresso.notes ?? ""}</ReactMarkdown>
                </article>
              ),
            },
          ]}
        />
        <DetailsCard
          title="Tasting scores"
          rows={[
            {
              label: "Aroma",
              value: espresso.tastingScores?.aroma
                ? `${espresso.tastingScores.aroma}/10`
                : "",
            },
            {
              label: "Acidity",
              value: espresso.tastingScores?.acidity
                ? `${espresso.tastingScores.acidity}/10`
                : "",
            },
            {
              label: "Sweetness",
              value: espresso.tastingScores?.sweetness
                ? `${espresso.tastingScores.sweetness}/10`
                : "",
            },
            {
              label: "Body",
              value: espresso.tastingScores?.body
                ? `${espresso.tastingScores.body}/10`
                : "",
            },
            {
              label: "Finish",
              value: espresso.tastingScores?.finish
                ? `${espresso.tastingScores.finish}/10`
                : "",
            },
          ]}
        />
        <DetailsCard
          title="Extraction"
          rows={[
            {
              label: "Extraction yield",
              value: `${getEyFromEspresso(espresso)}%`,
            },
            {
              label: "TDS",
              value: espresso.tds ? `${espresso.tds}%` : "",
            },
          ]}
        />
        {/* The date is rendered below the title */}
        {espresso.fromDecent && (
          <DetailsCard
            title="Prep"
            rows={[
              // {
              //   label: "Date",
              //   value: espresso.date
              //     ? dayjs(espresso.date.toDate()).format("DD MMM YYYY | H:m")
              //     : "",
              // },
              ...(espresso.fromDecent
                ? [{ label: "Profile name", value: espresso.profileName ?? "" }]
                : []),
            ]}
          />
        )}
        {espresso.beans ? (
          <BeansShortInfo
            beansId={espresso.beans.id}
            brewDate={espresso.date.toDate()}
          />
        ) : null}
        <DetailsCard
          title="Equipment"
          rows={[
            { label: "Machine", value: espresso.machine ?? "" },
            { label: "Grinder", value: espresso.grinder ?? "" },
            { label: "Burrs", value: espresso.grinderBurrs ?? "" },
            { label: "Portafilter", value: espresso.portafilter ?? "" },
            { label: "Basket", value: espresso.basket ?? "" },
          ]}
        />
        <DetailsCard
          title="Recipe"
          rows={[
            { label: "Ratio (water / beans)", value: waterByBeans },
            {
              label: "Target weight",
              value: espresso.targetWeight ? `${espresso.targetWeight} g` : "",
            },
            {
              label: "Beans weight",
              value: espresso.beansWeight ? `${espresso.beansWeight} g` : "",
            },
            ...(!espresso.fromDecent
              ? [
                  {
                    label: "Water temperature",
                    value: espresso.waterTemperature
                      ? `${espresso.waterTemperature} °C`
                      : "",
                  },
                ]
              : []),
            { label: "Grind setting", value: espresso.grindSetting ?? "" },
          ]}
        />
        <DetailsCard
          title="Time"
          rows={[
            {
              label: "Time",
              value: `${espresso.actualTime}s`,
            },
          ]}
        />
      </div>
    </>
  );
};

export default EspressoDetails;
