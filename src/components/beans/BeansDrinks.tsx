import { doc, orderBy, where } from "firebase/firestore";
import { useMemo } from "react";
import { db } from "../../firebaseConfig";
import { useCollectionQuery } from "../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../hooks/firestore/useFirestoreCollectionRealtime";
import { Beans } from "../../types/beans";
import { Brew } from "../../types/brew";
import { Espresso } from "../../types/espresso";
import { DrinksList, mergeBrewsAndEspressoByUniqueDate } from "../DrinksList";

interface BeansDrinksProps {
  beans: Beans;
}

export const BeansDrinks: React.FC<BeansDrinksProps> = ({ beans }) => {
  console.log("BeansDrinks");

  const filters = useMemo(
    () => [
      where("beans", "==", doc(db, "beans", beans.id ?? "")),
      orderBy("date", "desc"),
    ],
    [beans]
  );

  const brewQuery = useCollectionQuery<Brew>("brews", filters);
  const { list: brewsList, isLoading: brewsLoading } =
    useFirestoreCollectionRealtime<Brew>(brewQuery);

  const espressoQuery = useCollectionQuery<Espresso>("espresso", filters);
  const { list: espressoList, isLoading: espressoLoading } =
    useFirestoreCollectionRealtime<Espresso>(espressoQuery);

  const drinks = useMemo(
    () => mergeBrewsAndEspressoByUniqueDate(brewsList, espressoList),
    [brewsList, espressoList]
  );

  console.log(drinks);

  if (brewsLoading || espressoLoading) return null;

  return <DrinksList drinks={drinks} beansList={[beans]} />; // FIXME beans are stupid here, rethink card content
};
