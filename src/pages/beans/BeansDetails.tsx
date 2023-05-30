import dayjs from "dayjs";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../components/Breadcrumbs";
import {
  ButtonWithDropdown,
  ButtonWithDropdownProps,
} from "../../components/ButtonWithDropdown";
import { Details } from "../../components/Details";
import { Heading } from "../../components/Heading";
import { BeansBrewList } from "../../components/beans/BeansBrewList";
import { BeansEspressoList } from "../../components/beans/BeansEspressoList";
import { areBeansFresh, areBeansFrozen } from "../../components/beans/utils";
import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "../../hooks/firestore/useFirestoreDocRealtime";
import { Beans } from "../../types/beans";
import { NotFound } from "../NotFound";

export const BeansDetails: React.FC = () => {
  const { beansId } = useParams();
  const navigate = useNavigate();

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: beans, isLoading } = useFirestoreDocRealtime<Beans>(docRef);

  const handleArchive = useCallback(async () => {
    await updateDoc(docRef, {
      isFinished: true,
    });
    navigate(`/beans`);
  }, [docRef, navigate]);

  const handleUnarchive = useCallback(async () => {
    await updateDoc(docRef, {
      isFinished: false,
    });
  }, [docRef]);

  const handleFreeze = useCallback(async () => {
    await updateDoc(docRef, {
      freezeDate: serverTimestamp(),
    });
  }, [docRef]);

  const handleThaw = useCallback(async () => {
    await updateDoc(docRef, {
      thawDate: serverTimestamp(),
    });
  }, [docRef]);

  const handleDelete = useCallback(async () => {
    // TODO check if beans have brews/espressos/tastings
    await deleteDoc(docRef);
    navigate(`/beans`);
  }, [docRef, navigate]);

  const dropdownButtons: ButtonWithDropdownProps = useMemo(
    () => ({
      mainButton: { type: "link", label: "Clone", href: "clone" },
      dropdownItems: [
        { type: "link", label: "Edit details", href: "edit" },
        ...(beans?.isFinished
          ? [
              {
                type: "button" as const,
                label: "Unarchive",
                onClick: handleUnarchive,
              },
            ]
          : [
              {
                type: "button" as const,
                label: "Archive",
                onClick: handleArchive,
              },
            ]),
        ...(areBeansFresh(beans)
          ? [
              {
                type: "button" as const,
                label: "Freeze",
                onClick: handleFreeze,
              },
            ]
          : areBeansFrozen(beans)
          ? [{ type: "button" as const, label: "Thaw", onClick: handleThaw }]
          : []),

        { type: "button", label: "Delete", onClick: handleDelete },
      ],
    }),
    [
      beans,
      handleArchive,
      handleDelete,
      handleFreeze,
      handleThaw,
      handleUnarchive,
    ]
  );

  if (isLoading) return null;

  if (!beans) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[navLinks.beans, { label: beans.name, linkTo: "#" }]}
      />

      <Heading actionSlot={<ButtonWithDropdown {...dropdownButtons} />}>
        {beans.name}
      </Heading>

      <div tw="grid gap-4 my-6 lg:grid-cols-2">
        <BeansBrewList beansId={beans.id ?? ""} />
        <BeansEspressoList beansId={beans.id ?? ""} />
      </div>

      <div tw="space-y-8">
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
          <>
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
          </>
        ) : null}
      </div>
    </>
  );
};

export default BeansDetails;
