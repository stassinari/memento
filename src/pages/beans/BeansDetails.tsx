import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
  MoonIcon,
  SunIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { Button } from "../../components/Button";
import { Details } from "../../components/Details";
import { BeansBrewList } from "../../components/beans/BeansBrewList";
import { BeansEspressoList } from "../../components/beans/BeansEspressoList";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "../../hooks/firestore/useFirestoreDocRealtime";
import { Beans } from "../../types/beans";
import { NotFound } from "../NotFound";

export const BeansDetails = () => {
  const { beansId } = useParams();
  const navigate = useNavigate();

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: beans, isLoading } = useFirestoreDocRealtime<Beans>(docRef);

  const handleArchive = async () => {
    await updateDoc(docRef, {
      isFinished: true,
    });
    navigate(`/beans`);
  };

  const handleUnarchive = async () => {
    await updateDoc(docRef, {
      isFinished: false,
    });
  };

  const handleFreeze = async () => {
    await updateDoc(docRef, {
      freezeDate: serverTimestamp(),
    });
  };

  const handleThaw = async () => {
    await updateDoc(docRef, {
      thawDate: serverTimestamp(),
    });
  };

  const handleDelete = async () => {
    // TODO check if beans have brews/espressos/tastings
    await deleteDoc(docRef);
    navigate(`/beans`);
  };

  if (isLoading) return null;

  if (!beans) {
    return <NotFound />;
  }

  return (
    <div tw="space-y-8">
      <div>
        <h3 tw="text-lg font-medium leading-6 text-gray-900">
          Beans with id {beansId}
        </h3>
        <p tw="max-w-2xl mt-1 text-sm text-gray-500">
          Subtitle in case it is needed.
        </p>
      </div>
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
          Edit
        </Button>
        {beans.isFinished ? (
          <Button
            variant="white"
            Icon={<ArchiveBoxXMarkIcon />}
            onClick={handleUnarchive}
          >
            Unarchive
          </Button>
        ) : (
          <Button
            variant="white"
            Icon={<ArchiveBoxArrowDownIcon />}
            onClick={handleArchive}
          >
            Archive
          </Button>
        )}
        {!beans.freezeDate ? (
          <Button variant="white" Icon={<MoonIcon />} onClick={handleFreeze}>
            Freeze
          </Button>
        ) : !beans.thawDate ? (
          <Button variant="white" Icon={<SunIcon />} onClick={handleThaw}>
            Thaw
          </Button>
        ) : null}
        <Button variant="white" Icon={<TrashIcon />} onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <div tw="grid gap-4 lg:grid-cols-2">
        <BeansBrewList beansId={beans.id ?? ""} />
        <BeansEspressoList beansId={beans.id ?? ""} />
      </div>

      <Details
        title="Roast information"
        rows={[
          { label: "Name", value: beans.name },
          { label: "Roaster", value: beans.roaster },
          {
            label: "Roast date",
            value: beans.roastDate
              ? dayjs(beans.roastDate.toDate()).format("DD MMM YYYY")
              : "",
          },
          { label: "Roast style", value: beans.roastStyle ?? "" },
          { label: "Roast level", value: beans.roastLevel?.toString() ?? "" },
          { label: "Roasting notes", value: beans.roastingNotes.join(", ") },
        ]}
      />

      <Details
        title="Storage"
        rows={[
          {
            label: "Freeze date",
            value: beans.freezeDate
              ? dayjs(beans.freezeDate.toDate()).format("DD MMM YYYY")
              : "",
          },
          {
            label: "Thaw date",
            value: beans.thawDate
              ? dayjs(beans.thawDate.toDate()).format("DD MMM YYYY")
              : "",
          },
        ]}
      />

      {beans.origin === "single-origin" ? (
        <Details
          title="Single-origin terroir"
          rows={[
            { label: "Country", value: beans.country ?? "" },
            { label: "Region", value: beans.region ?? "" },
            { label: "Farmer", value: beans.farmer ?? "" },
            {
              label: "Altitude",
              value: beans.altitude ? `${beans.altitude} masl` : "",
            },
            { label: "Process", value: beans.process ?? "" },
            { label: "Varietal(s)", value: beans.varietals.join(", ") },
            {
              label: "Harvest date",
              value: beans.harvestDate
                ? dayjs(beans.harvestDate.toDate()).format("MMMM YYYY")
                : "",
            },
          ]}
        />
      ) : beans.origin === "blend" ? (
        <React.Fragment>
          {beans.blend.map((b, i) => (
            <Details
              key={i}
              title={`Blend item ${i + 1}`}
              rows={[
                { label: "Name", value: b.name ?? "" },
                {
                  label: "Percentage",
                  value: b.percentage ? `${b.percentage} %` : "",
                },
                { label: "Country", value: b.country ?? "" },
                { label: "Process", value: b.process ?? "" },
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
