import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import { Button } from "../../components/Button";
import { Details } from "../../components/Details";
import { Heading } from "../../components/Heading";
import { BeansShortInfo } from "../../components/beans/BeansShortInfo";
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

      <Heading>{brew.method}</Heading>

      <div tw="space-x-2">
        <Button
          variant="primary"
          as={Link}
          to="clone"
          Icon={<DocumentDuplicateIcon />}
        >
          Clone
        </Button>
        <Button variant="white" as={Link} to="edit" Icon={<PencilSquareIcon />}>
          Edit details
        </Button>
        <Button variant="white" as={Link} to="outcome" Icon={<SparklesIcon />}>
          Edit outcome
        </Button>
        <Button variant="white" Icon={<TrashIcon />} onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <div tw="space-y-8">
        <Details
          title="Rating"
          rows={[
            {
              label: "Overall score",
              value: brew.rating ? `${brew.rating}/10` : "",
            },
            {
              label: "Notes",
              value: (
                <article tw="prose-sm prose">
                  <ReactMarkdown>{brew.notes ?? ""}</ReactMarkdown>
                </article>
              ),
            },
          ]}
        />
        <Details
          title="Tasting scores"
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
        <Details
          title="Extraction"
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
        <Details
          title="Prep"
          rows={[
            {
              label: "Date",
              value: dayjs(brew.date.toDate()).format("DD MMM YYYY | H:m"),
            },
            { label: "Method", value: brew.method },
            // { label: "Beans", value: brew.beans }, TBD
          ]}
        />
        <BeansShortInfo beansId={brew.beans.id} brewDate={brew.date.toDate()} />
        <Details
          title="Equipment"
          rows={[
            { label: "Grinder", value: brew.grinder ?? "" },
            { label: "Burrs", value: brew.grinderBurrs ?? "" },
            { label: "Water type", value: brew.waterType ?? "" },
            { label: "Filter type", value: brew.filterType ?? "" },
          ]}
        />
        <Details
          title="Recipe"
          rows={[
            {
              label: "Water weight",
              value: brew.waterWeight ? `${brew.waterWeight} g` : "",
            },
            {
              label: "Beans weight",
              value: brew.beansWeight ? `${brew.beansWeight} g` : "",
            },
            {
              label: "Water temperature",
              value: brew.waterTemperature ? `${brew.waterTemperature} °C` : "",
            },
            { label: "Grind setting", value: brew.grindSetting ?? "" },
          ]}
        />
        <Details
          title="Time"
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
      </div>
    </>
  );
};

export default BrewDetails;
