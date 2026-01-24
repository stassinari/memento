import { navLinks } from "@/components/BottomNav";
import { BreadcrumbsWithHome } from "@/components/Breadcrumbs";
import { BrewDetailsInfo } from "@/components/brews/BrewDetailsInfo";
import { BrewDetailsOutcome } from "@/components/brews/BrewDetailsOutcome";
import { ButtonWithDropdown } from "@/components/ButtonWithDropdown";
import { NotFound } from "@/components/ErrorPage";
import { Heading } from "@/components/Heading";
import { useDocRef } from "@/hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "@/hooks/firestore/useFirestoreDocRealtime";
import useScreenMediaQuery from "@/hooks/useScreenMediaQuery";
import { Brew } from "@/types/brew";
import { Tab } from "@headlessui/react";
import {
  createLazyFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
import { useState } from "react";
import { tabStyles } from "../../../beans/index.lazy";

export const Route = createLazyFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/",
)({
  component: BrewDetails,
});

function BrewDetails() {
  console.log("BrewDetails");

  const { brewId } = useParams({ strict: false });
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const docRef = useDocRef<Brew>("brews", brewId);
  const { details: brew, isLoading } = useFirestoreDocRealtime<Brew>(docRef);

  const handleDelete = async () => {
    await deleteDoc(docRef);
    navigate({ to: "/drinks/brews" });
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

      <div className="mb-2 text-sm text-gray-500">
        {dayjs(brew.date.toDate()).format("DD MMM YYYY @ H:m")}
      </div>

      {isSm ? (
        <div className="grid grid-cols-2 gap-4 my-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Brew info
            </h2>

            <BrewDetailsInfo brew={brew} />
          </div>

          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Outcome
            </h2>

            <BrewDetailsOutcome brew={brew} />
          </div>
        </div>
      ) : (
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex -mb-px">
            <Tab className={clsx([tabStyles(selectedIndex === 0), "w-1/2"])}>
              Info
            </Tab>
            <Tab className={clsx([tabStyles(selectedIndex === 1), "w-1/2"])}>
              Outcome
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <BrewDetailsInfo brew={brew} />
            </Tab.Panel>
            <Tab.Panel>
              <BrewDetailsOutcome brew={brew} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </>
  );
}

BrewDetails;
