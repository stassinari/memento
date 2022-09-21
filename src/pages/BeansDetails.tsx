import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import React from "react";
import { Link, useParams } from "react-router-dom";
import "twin.macro";
import { Button } from "../components/Button";
import { Details } from "../components/Details";
import { useBeansDetails } from "../hooks/firestore/useBeansDetails";

export const BeansDetails = () => {
  const { beansId } = useParams();

  const { beans } = useBeansDetails(beansId);

  if (!beans) {
    return null;
  }

  return (
    <div tw="space-y-8">
      <div>
        <h3 tw="text-lg font-medium leading-6 text-gray-900">
          Beans with id {beansId}
        </h3>
        <p tw="max-w-2xl mt-1 text-sm text-gray-500">
          Subtitle in case it's needed.
        </p>
      </div>
      <Button
        variant="primary"
        as={Link}
        to="clone"
        Icon={<DocumentDuplicateIcon />}
      >
        Clone
      </Button>
      <Button
        variant="secondary"
        as={Link}
        to="edit"
        Icon={<PencilSquareIcon />}
      >
        Edit
      </Button>

      <Details
        title="Roast information"
        rows={[
          { label: "Name", value: beans.name },
          { label: "Roaster", value: beans.roaster },
          {
            label: "Roast date",
            value: beans.roastDate?.toDate().toLocaleDateString() || "",
          },
          { label: "Roast style", value: beans.roastStyle || "" },
          { label: "Roast level", value: beans.roastLevel?.toString() || "" },
          { label: "Roasting notes", value: beans.roastingNotes.join(", ") },
        ]}
      />

      {beans.origin === "single-origin" ? (
        <Details
          title="Single-origin terroir"
          rows={[
            { label: "Country", value: beans.country || "" },
            { label: "Region", value: beans.region || "" },
            { label: "Farmer", value: beans.farmer || "" },
            {
              label: "Altitude",
              value: beans.altitude ? `${beans.altitude} masl` : "",
            },
            { label: "Process", value: beans.process || "" },
            { label: "Varietal(s)", value: beans.varietals.join(", ") },
          ]}
        />
      ) : beans.origin === "blend" ? (
        <React.Fragment>
          {beans.blend.map((b, i) => (
            <Details
              key={i}
              title={`Blend item ${i + 1}`}
              rows={[
                { label: "Name", value: b.name || "" },
                {
                  label: "Percentage",
                  value: b.percentage ? `${b.percentage} %` : "",
                },
                { label: "Country", value: b.country || "" },
                { label: "Process", value: b.process || "" },
                { label: "Varietal(s)", value: b.varietals.join(", ") },
              ]}
            />
          ))}
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default BeansDetails;
