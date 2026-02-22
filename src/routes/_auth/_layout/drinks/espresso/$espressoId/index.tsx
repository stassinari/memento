import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { PuzzlePieceIcon } from "@heroicons/react/20/solid";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { ButtonWithDropdown, ButtonWithDropdownProps } from "~/components/ButtonWithDropdown";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { EspressoDetailsInfo } from "~/components/espresso/EspressoDetailsInfo";
import { EspressoDetailsOutcome } from "~/components/espresso/EspressoDetailsOutcome";
import { DecentCharts } from "~/components/espresso/charts/DecentCharts";
import { deleteEspresso } from "~/db/mutations";
import { getEspresso } from "~/db/queries";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { tabStyles } from "../../../beans";

export type EspressoWithBeans = NonNullable<Awaited<ReturnType<typeof getEspresso>>>;

const espressoQueryOptions = (espressoId: string) =>
  queryOptions({
    queryKey: ["espresso", espressoId],
    queryFn: () =>
      getEspresso({
        data: { espressoId },
      }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/espresso/$espressoId/")({
  component: EspressoDetails,
});

function EspressoDetails() {
  console.log("EspressoDetails");

  const { espressoId } = Route.useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: espresso, isLoading } = useSuspenseQuery(espressoQueryOptions(espressoId));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const handleDelete = useCallback(async () => {
    await deleteEspresso({
      data: { espressoId },
    });

    queryClient.invalidateQueries({ queryKey: ["espresso"] });
    navigate({ to: "/drinks/espresso" });
  }, [espressoId, queryClient, navigate]);

  const decentEspressoButtons: ButtonWithDropdownProps = {
    mainButton: {
      type: "link",
      label: "Edit outcome",
      linkProps: {
        to: "/drinks/espresso/$espressoId/outcome",
        params: { espressoId },
      },
    },
    dropdownItems: [
      {
        type: "link",
        label: "Edit details",
        linkProps: {
          to: "/drinks/espresso/$espressoId/decent/edit",
          params: { espressoId },
        },
      },
      { type: "button", label: "Delete", onClick: handleDelete },
    ],
  };

  const normalEspressoButtons: ButtonWithDropdownProps = {
    mainButton: {
      type: "link",
      label: "Clone",
      linkProps: {
        to: "/drinks/espresso/$espressoId/clone",
        params: { espressoId },
      },
    },
    dropdownItems: [
      {
        type: "link",
        label: "Edit details",
        linkProps: {
          to: "/drinks/espresso/$espressoId/edit",
          params: { espressoId },
        },
      },
      {
        type: "link",
        label: "Edit outcome",
        linkProps: {
          to: "/drinks/espresso/$espressoId/outcome",
          params: { espressoId },
        },
      },
      { type: "button", label: "Delete", onClick: handleDelete },
    ],
  };

  if (isLoading) return null;

  if (!espresso) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.espresso, { label: "Detail" }]} />

      <Heading
        actionSlot={
          <ButtonWithDropdown
            {...(espresso.fromDecent ? decentEspressoButtons : normalEspressoButtons)}
          />
        }
      >
        Espresso detail
      </Heading>

      <div className="mb-2 text-sm text-gray-500">
        {dayjs(espresso.date).format("DD MMM YYYY @ H:m")}
      </div>

      {espresso.fromDecent && espresso.partial && (
        <div className="inline-flex items-center gap-4">
          <Button variant="secondary" size="sm" className="shrink-0" asChild>
            <Link
              to="/drinks/espresso/$espressoId/decent/add"
              params={{ espressoId: espressoId || "" }}
            >
              <PuzzlePieceIcon /> Add shot info
            </Link>
          </Button>
          <span>This shot is missing some information!</span>
        </div>
      )}

      {espresso.fromDecent && <DecentCharts espressoId={espressoId} />}

      {isSm ? (
        <div className="grid grid-cols-2 gap-4 my-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">Espresso info</h2>

            <EspressoDetailsInfo espresso={espresso} />
          </div>

          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">Outcome</h2>

            <EspressoDetailsOutcome espresso={espresso} />
          </div>
        </div>
      ) : (
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="flex -mb-px">
            <Tab className={clsx([tabStyles(selectedIndex === 0), "w-1/2"])}>Info</Tab>
            <Tab className={clsx([tabStyles(selectedIndex === 1), "w-1/2"])}>Outcome</Tab>
          </TabList>
          <TabPanels className="mt-4">
            <TabPanel>
              <EspressoDetailsInfo espresso={espresso} />
            </TabPanel>
            <TabPanel>
              <EspressoDetailsOutcome espresso={espresso} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}
    </>
  );
}
