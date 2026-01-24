import { Tab } from "@headlessui/react";
import {
  createLazyFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import clsx from "clsx";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { BeansDetailsInfo } from "../../../../../components/beans/BeansDetailsInfo";
import { BeansDrinks } from "../../../../../components/beans/BeansDrinks";
import {
  areBeansFresh,
  areBeansFrozen,
} from "../../../../../components/beans/utils";
import { navLinks } from "../../../../../components/BottomNav";
import { BreadcrumbsWithHome } from "../../../../../components/Breadcrumbs";
import {
  ButtonWithDropdown,
  ButtonWithDropdownProps,
} from "../../../../../components/ButtonWithDropdown";
import { NotFound } from "../../../../../components/ErrorPage";
import { Heading } from "../../../../../components/Heading";
import { useDocRef } from "../../../../../hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "../../../../../hooks/firestore/useFirestoreDocRealtime";
import useScreenMediaQuery from "../../../../../hooks/useScreenMediaQuery";
import { Beans } from "../../../../../types/beans";
import { tabStyles } from "../index.lazy";

export const Route = createLazyFileRoute("/_auth/_layout/beans/$beansId/")({
  component: BeansDetails,
});

function BeansDetails() {
  const { beansId } = useParams({ strict: false });
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: beans, isLoading } = useFirestoreDocRealtime<Beans>(docRef);

  const handleArchive = useCallback(async () => {
    await updateDoc(docRef, {
      isFinished: true,
    });
    navigate({ to: "/beans" });
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
    navigate({ to: "/beans" });
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
    ],
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

      {isSm ? (
        <div className="grid grid-cols-[40%_60%] gap-4 my-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">
              Beans info
            </h2>

            <BeansDetailsInfo beans={beans} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-center text-gray-900">
              Drinks
            </h2>

            <BeansDrinks beans={beans} />
          </div>
        </div>
      ) : (
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex -mb-px">
            <Tab className={clsx([tabStyles(selectedIndex === 0), "w-1/2"])}>
              Info
            </Tab>
            <Tab className={clsx([tabStyles(selectedIndex === 1), "w-1/2"])}>
              Drinks
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <BeansDetailsInfo beans={beans} />
            </Tab.Panel>
            <Tab.Panel>
              <BeansDrinks beans={beans} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </>
  );
}

BeansDetails;
