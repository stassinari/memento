import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { ButtonWithDropdown } from "../../components/ButtonWithDropdown";
import { Card } from "../../components/Card";
import { DetailsCard } from "../../components/Details";
import { Heading } from "../../components/Heading";
import { BeansShortInfo } from "../../components/beans/BeansShortInfo";
import { useDrinkRatio } from "../../components/drinks/useDrinkRatio";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "../../hooks/firestore/useFirestoreDocRealtime";
import { Brew } from "../../types/brew";
import { getEyFromBrew } from "../../utils";
import { NotFound } from "../NotFound";

export const BrewDetails: React.FC = () => {
  console.log("BrewDetails");

  const { brewId } = useParams();
  const navigate = useNavigate();

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: brew, isLoading } = useFirestoreDocRealtime<Brew>(docRef);

  const { beansByWater, waterByBeans } = useDrinkRatio(
    brew?.beansWeight ?? 0,
    brew?.waterWeight ?? 0
  );

  const handleDelete = async () => {
    await deleteDoc(docRef);
    navigate(`/drinks/brews`);
  };

  if (isLoading) return null;

  if (!brew) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.brews,
          { label: brew.method, linkTo: "#" },
        ]}
      />

      <Heading
        actionSlot={
          <ButtonWithDropdown
            mainButton={{ type: "link", label: "Clone", href: "clone" }}
            dropdownItems={[
              { type: "link", label: "Edit details", href: "edit" },
              { type: "link", label: "Edit outcome", href: "outcome" },
              {
                type: "button",
                label: "Delete",
                onClick: handleDelete,
              },
            ]}
          />
        }
      >
        {brew.method}
      </Heading>

      <div tw="mb-2 text-sm text-gray-500">
        {dayjs(brew.date.toDate()).format("DD MMM YYYY @ H:m")}
      </div>

      <div tw="mt-4 space-y-4">
        {/* This below is represented by the sections above */}
        {/* <DetailsCard
          title="Prep"
          action={{ type: "link", label: "Edit", href: "edit" }}
          rows={[
            {
              label: "Date",
              value: dayjs(brew.date.toDate()).format("DD MMM YYYY @ H:m"),
            },
            { label: "Method", value: brew.method },
          ]}
        /> */}

        <BeansShortInfo beansId={brew.beans.id} brewDate={brew.date.toDate()} />

        <DetailsCard
          title="Recipe"
          action={{ type: "link", label: "Edit", href: "edit" }}
          rows={[
            { label: "Ratio (beans / water)", value: beansByWater },
            { label: "Ratio (water / beans)", value: waterByBeans },
            {
              label: "Water weight",
              value: `${brew.waterWeight} g`,
            },
            {
              label: "Beans weight",
              value: `${brew.beansWeight} g`,
            },
            {
              label: "Water temperature",
              value: brew.waterTemperature ? `${brew.waterTemperature} °C` : "",
            },
            { label: "Grind setting", value: brew.grindSetting ?? "" },
          ]}
        />

        <DetailsCard
          title="Outcome"
          action={{ type: "link", label: "Edit", href: "outcome" }}
          rows={[
            {
              label: "Overall score",
              value: brew.rating ? `${brew.rating}/10` : "",
            },
          ]}
        />

        <Card.Container>
          <Card.Header title="Notes" />

          <Card.Content>
            <article tw="prose-sm prose">
              <ReactMarkdown>{brew.notes ?? ""}</ReactMarkdown>
            </article>
          </Card.Content>
        </Card.Container>

        <DetailsCard
          title="Time"
          action={{ type: "link", label: "Edit", href: "edit" }}
          rows={[
            {
              label: "Time",
              value:
                brew.timeMinutes ?? brew.timeSeconds
                  ? `${brew.timeMinutes ?? ""}:${brew.timeSeconds ?? ""}`
                  : "",
            },
          ]}
        />

        <DetailsCard
          title="Tasting notes"
          action={{ type: "link", label: "Edit", href: "outcome" }}
          rows={[
            {
              label: "Aroma",
              value: brew.tastingScores?.aroma
                ? `${brew.tastingScores.aroma}/10`
                : "",
            },
            {
              label: "Acidity",
              value: brew.tastingScores?.acidity
                ? `${brew.tastingScores.acidity}/10`
                : "",
            },
            {
              label: "Sweetness",
              value: brew.tastingScores?.sweetness
                ? `${brew.tastingScores.sweetness}/10`
                : "",
            },
            {
              label: "Body",
              value: brew.tastingScores?.body
                ? `${brew.tastingScores.body}/10`
                : "",
            },
            {
              label: "Finish",
              value: brew.tastingScores?.finish
                ? `${brew.tastingScores.finish}/10`
                : "",
            },
          ]}
        />

        <DetailsCard
          title="Extraction"
          action={{ type: "link", label: "Edit", href: "outcome" }}
          rows={[
            {
              label: "Extraction type",
              value: brew.extractionType ?? "",
            },
            {
              label: "Extraction yield",
              value: `${getEyFromBrew(brew)}%`,
            },
            {
              label: "Final brew weight",
              value: brew.finalBrewWeight ? `${brew.finalBrewWeight}g` : "",
            },
            {
              label: "TDS",
              value: brew.tds ? `${brew.tds}%` : "",
            },
          ]}
        />

        <DetailsCard
          title="Equipment"
          action={{ type: "link", label: "Edit", href: "edit" }}
          rows={[
            { label: "Grinder", value: brew.grinder ?? "" },
            { label: "Burrs", value: brew.grinderBurrs ?? "" },
            { label: "Water type", value: brew.waterType ?? "" },
            { label: "Filter type", value: brew.filterType ?? "" },
          ]}
        />
      </div>
    </>
  );
};

export default BrewDetails;
