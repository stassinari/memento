import { Tab } from "@headlessui/react";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import tw from "twin.macro";
import { Beans } from "../types/beans";
import { isNotFrozenOrIsThawed } from "../util";

const tabs: {
  name: string;
  filters: QueryConstraint[];
  removeFrozen?: boolean;
}[] = [
  {
    name: "Open",
    filters: [orderBy("roastDate", "desc"), where("isFinished", "==", false)],
    removeFrozen: true,
  },
  {
    name: "Frozen",
    filters: [
      orderBy("freezeDate", "desc"),
      where("isFinished", "==", false),
      where("freezeDate", "!=", null),
      where("thawDate", "==", null),
    ],
  },
  {
    name: "Archived",
    filters: [orderBy("roastDate", "desc"), where("isFinished", "==", true)],
  },
];

export const BeansPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: user } = useUser();
  const firestore = useFirestore();
  const beansRef = collection(
    firestore,
    "users",
    user?.uid || "",
    "beans"
  ) as CollectionReference<Beans>;
  const beansQuery = query(beansRef, ...tabs[selectedIndex].filters);
  const { data: beans } = useFirestoreCollectionData(beansQuery, {
    idField: "id",
  });

  return (
    <div>
      <div>
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
                  beans={
                    t.removeFrozen ? beans.filter(isNotFrozenOrIsThawed) : beans
                  }
                />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

interface BeansTabProps {
  beans: Beans[];
}

const BeansTab: React.FC<BeansTabProps> = ({ beans }) => {
  return (
    <Fragment>
      {beans.map((b) => (
        <div key={b.id}>
          <Link to={`/beans/${b.id}`}>
            {b.name} - {b.roaster}
          </Link>
        </div>
      ))}
    </Fragment>
  );
};
