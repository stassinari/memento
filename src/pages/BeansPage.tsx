import { Tab } from "@headlessui/react";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import tw from "twin.macro";
import { Beans } from "../types/beans";

const tabs = [
  {
    name: "Open",
    filters: [orderBy("roastDate", "desc"), where("isFinished", "==", false)],
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
  return (
    <div>
      {/* <BeansTab filters={[]} /> */}
      <div>
        <Tab.Group>
          <Tab.List tw="flex -mb-px">
            {tabs.map(({ name }) => (
              <Tab key={name} as={Fragment}>
                {({ selected }) => (
                  <button
                    css={[
                      tw`w-1/3 px-1 py-4 text-sm font-medium text-center border-b-2`,
                      selected
                        ? tw`text-orange-600 border-orange-500`
                        : tw`text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300`,
                    ]}
                  >
                    {name}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {tabs.map((t, i) => (
              <Tab.Panel>
                Tab {i + 1}
                {/* <BeansTab filters={t.filters} /> */}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

interface BeansTabProps {
  filters: QueryConstraint[];
}

const BeansTab: React.FC<BeansTabProps> = ({ filters }) => {
  const { data: user } = useUser();
  const firestore = useFirestore();
  const beansRef = collection(
    firestore,
    "users",
    user?.uid || "",
    "beans"
  ) as CollectionReference<Beans>;
  const beansQuery = query(beansRef, ...filters);

  console.log("orderBy");
  const { data: beans } = useFirestoreCollectionData(beansQuery, {
    idField: "id",
  });
  console.log("useFirestoreCollectionData");

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
