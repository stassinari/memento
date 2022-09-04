import { Tab } from "@headlessui/react";
import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/20/solid";
import {
  collection,
  CollectionReference,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import { userAtom } from "../App";
import { db } from "../firebaseConfig";
import { Beans } from "../types/beans";
import { getTimeAgo, isNotFrozenOrIsThawed } from "../util";

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
  const [user] = useAtom(userAtom);

  const [beansList, setBeansList] = useState<Beans[]>([]);

  useEffect(() => {
    const fetchBeans = async () => {
      const beansRef = collection(
        db,
        "users",
        user?.uid || "lol",
        "beans"
      ) as CollectionReference<Beans>;
      const beansQuery = query(beansRef, ...tabs[selectedIndex].filters);
      const querySnapshot = await getDocs(beansQuery);

      let beansArr: Beans[] = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        beansArr.push({ ...doc.data(), id: doc.id });
      });
      setBeansList(beansArr);
    };

    fetchBeans().catch(console.error);
  }, [selectedIndex]);

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
                    t.removeFrozen
                      ? beansList.filter(isNotFrozenOrIsThawed)
                      : beansList
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
    <div tw="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" tw="divide-y divide-gray-200">
        {beans.map((b) => (
          <li key={b.id}>
            <Link to={`/beans/${b.id}`} tw="block hover:bg-gray-50">
              <div tw="px-4 py-4 sm:px-6">
                <div tw="flex items-center justify-between">
                  <p tw="text-sm font-medium text-orange-600 truncate">
                    {b.name}
                  </p>
                  <div tw="flex flex-shrink-0 ml-2">
                    <p tw="inline-flex px-2 text-xs font-semibold leading-5 text-gray-500 bg-gray-100 rounded-full">
                      {b.process}
                    </p>
                  </div>
                </div>
                <div tw="mt-2 sm:flex sm:justify-between">
                  <div tw="sm:flex">
                    <p tw="flex items-center text-sm text-gray-500">
                      <UsersIcon
                        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {b.roaster}
                    </p>
                    {b.country && (
                      <p tw="flex items-center mt-2 text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <MapPinIcon
                          tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {b.country}
                      </p>
                    )}
                  </div>
                  {b.roastDate && (
                    <div tw="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon
                        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <p>
                        Roasted{" "}
                        <time
                          dateTime={b.roastDate.toDate().toLocaleDateString()}
                        >
                          {getTimeAgo(b.roastDate.toDate())}
                        </time>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
