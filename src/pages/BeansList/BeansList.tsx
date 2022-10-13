import { Tab } from "@headlessui/react";
import { orderBy, where } from "firebase/firestore";
import { useState } from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { BeansTab, BeansTabProps } from "./BeansTab";

const tabs: BeansTabProps[] = [
  {
    name: "Open",
    filters: [where("isFinished", "==", false)],
    removeFrozen: true,
    EmptyState: (
      <EmptyState
        title="No open beans"
        description="Get started by adding some coffee beans"
        buttonLabel="Add beans"
      />
    ),
  },
  {
    name: "Frozen",
    filters: [
      orderBy("freezeDate", "desc"),
      where("isFinished", "==", false),
      where("freezeDate", "!=", null),
      where("thawDate", "==", null),
    ],
    EmptyState: (
      <EmptyState
        title="No frozen beans"
        description="Freeze beans for them to appear here."
      />
    ),
  },
  {
    name: "Archived",
    filters: [where("isFinished", "==", true)],
    EmptyState: (
      <EmptyState
        title="No archived beans"
        description="Beans you archive will appear here."
      />
    ),
  },
];

export const BeansList = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      <Button as={Link} to="add" variant="primary" colour="accent">
        Add beans
      </Button>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List tw="flex -mb-px">
          {tabs.map(({ name }, i) => (
            <Tab
              key={name}
              css={[
                tw`w-1/3 px-1 py-4 text-sm font-medium text-center border-b-2`,
                selectedIndex === i
                  ? tw`text-orange-600 border-orange-500`
                  : tw`text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300`,
              ]}
            >
              {name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels tw="mt-4">
          {tabs.map((t, i) => (
            <Tab.Panel key={t.name}>
              <BeansTab
                name={tabs[i].name}
                filters={tabs[i].filters}
                removeFrozen={tabs[i].removeFrozen}
                EmptyState={tabs[i].EmptyState}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default BeansList;
