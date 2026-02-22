import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";

import { BrewDetailsInfo } from "~/components/brews/BrewDetailsInfo";
import { BrewDetailsOutcome } from "~/components/brews/BrewDetailsOutcome";
import { ButtonWithDropdown } from "~/components/ButtonWithDropdown";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { deleteBrew } from "~/db/mutations";
import { getBrew } from "~/db/queries";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { tabStyles } from "../../../beans";

export type BrewWithBeans = NonNullable<Awaited<ReturnType<typeof getBrew>>>;

const brewQueryOptions = (brewId: string) =>
  queryOptions({
    queryKey: ["brews", brewId],
    queryFn: () =>
      getBrew({
        data: { brewId },
      }),
  });

export const Route = createFileRoute("/_auth/_layout/drinks/brews/$brewId/")({
  component: BrewDetails,
});

function BrewDetails() {
  console.log("BrewDetails");

  const { brewId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: brew, isLoading } = useSuspenseQuery(brewQueryOptions(brewId));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSm = useScreenMediaQuery("sm");

  const handleDelete = useCallback(async () => {
    await deleteBrew({
      data: { brewId },
    });

    // 3. Invalidate and navigate
    queryClient.invalidateQueries({ queryKey: ["brews"] });
    navigate({ to: "/drinks/brews" });
  }, [brewId, queryClient, navigate]);

  if (isLoading) return null;

  if (!brew) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.brews, { label: brew.method }]} />

      <Heading
        actionSlot={
          <ButtonWithDropdown
            mainButton={{
              type: "link",
              label: "Clone",
              linkProps: {
                to: "/drinks/brews/$brewId/clone",
                params: { brewId },
              },
            }}
            dropdownItems={[
              {
                type: "link",
                label: "Edit details",
                linkProps: {
                  to: "/drinks/brews/$brewId/edit",
                  params: { brewId },
                },
              },
              {
                type: "link",
                label: "Edit outcome",
                linkProps: {
                  to: "/drinks/brews/$brewId/outcome",
                  params: { brewId },
                },
              },
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
        {dayjs(brew.date).format("DD MMM YYYY @ H:m")}
      </div>

      {isSm ? (
        <div className="grid grid-cols-2 gap-4 my-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">Brew info</h2>

            <BrewDetailsInfo brew={brew} />
          </div>

          <div>
            <h2 className="mb-5 text-lg font-semibold text-center text-gray-900">Outcome</h2>

            <BrewDetailsOutcome brew={brew} />
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
              <BrewDetailsInfo brew={brew} />
            </TabPanel>
            <TabPanel>
              <BrewDetailsOutcome brew={brew} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}
    </>
  );
}
