import { User } from "@sentry/react";
import firebase from "firebase/app";
import { generateRandomString } from "../utils/string";
import { Beans } from "./types/beans";
import { Brew, BrewPrep } from "./types/brew";
import { Espresso, EspressoPrep } from "./types/espresso";
import { Tasting, TastingSample } from "./types/tasting";

const MAX_LIMIT = 10000;

export const getBrews = async (
  db: firebase.firestore.Firestore,
  userId: string,
  limit: number = 0
) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("brews")
    .orderBy("date", "desc")
    .limit(limit ? limit : MAX_LIMIT)
    .get()
    .then(buildArrayFromQuerySnapshot);
};

export const getBrewById = async (
  db: firebase.firestore.Firestore,
  userId: string,
  brewId: string
) => db.collection("users").doc(userId).collection("brews").doc(brewId).get();

export const canRemoveBeans = async (
  db: firebase.firestore.Firestore,
  userId: string,
  beansRef: firebase.firestore.DocumentReference
) => {
  let result = false;
  await Promise.all([
    db
      .collection("users")
      .doc(userId)
      .collection("brews")
      .where("beans", "==", beansRef)
      .get(),
    db
      .collection("users")
      .doc(userId)
      .collection("espresso")
      .where("beans", "==", beansRef)
      .get(),
  ]).then(([brews, espresso]) => {
    if (brews.empty && espresso.empty) {
      result = true;
    }
  });
  return result;
};

export const addBrew = async (
  db: firebase.firestore.Firestore,
  userId: string,
  brew: BrewPrep
) => db.collection("users").doc(userId).collection("brews").add(brew);

export const updateBrew = async (
  db: firebase.firestore.Firestore,
  userId: string,
  brew: Partial<Brew>,
  brewId: string
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("brews")
    .doc(brewId)
    .update(brew);

export const deleteBrew = async (
  db: firebase.firestore.Firestore,
  userId: string,
  brewId: string
) =>
  db.collection("users").doc(userId).collection("brews").doc(brewId).delete();

export const getEspressoList = async (
  db: firebase.firestore.Firestore,
  userId: string,
  limit: number = 0
) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .orderBy("date", "desc")
    .limit(limit ? limit : MAX_LIMIT)
    .get()
    .then(buildArrayFromQuerySnapshot);
};

export const getEspressoById = async (
  db: firebase.firestore.Firestore,
  userId: string,
  espressoId: string
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .doc(espressoId)
    .get();

export const getEspressoDecentReadings = async (
  db: firebase.firestore.Firestore,
  userId: string,
  espressoId: string
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .doc(espressoId)
    .collection("decentReadings")
    .doc("decentReadings")
    .get();

export const addEspresso = async (
  db: firebase.firestore.Firestore,
  userId: string,
  espresso: EspressoPrep
) => db.collection("users").doc(userId).collection("espresso").add(espresso);

export const updateEspresso = async (
  db: firebase.firestore.Firestore,
  userId: string,
  espresso: Partial<Espresso>,
  espressoId: string
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .doc(espressoId)
    .update(espresso);

export const completeDecentEspresso = async (
  db: firebase.firestore.Firestore,
  userId: string,
  espresso: Partial<Espresso>,
  espressoId: string
) => updateEspresso(db, userId, { ...espresso, partial: false }, espressoId);

export const deleteEspresso = async (
  db: firebase.firestore.Firestore,
  userId: string,
  espressoId: string
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .doc(espressoId)
    .delete();

export const getTastings = async (
  db: firebase.firestore.Firestore,
  userId: string,
  limit: number = 0
) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("tastings")
    .orderBy("date", "desc")
    .limit(limit ? limit : MAX_LIMIT)
    .get()
    .then(buildArrayFromQuerySnapshot);
};

export const addTasting = async (
  db: firebase.firestore.Firestore,
  userId: string,
  tasting: Tasting
) => db.collection("users").doc(userId).collection("tastings").add(tasting);

export const updateTastingSamples = async (
  db: firebase.firestore.Firestore,
  userId: string,
  tastingId: string,
  samples: TastingSample[]
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("tastings")
    .doc(tastingId)
    .update({ samples, prepDone: true });

export const getTastingById = async (
  db: firebase.firestore.Firestore,
  userId: string,
  tastingId: string
) => {
  if (!tastingId) throw new Error();

  return db
    .collection("users")
    .doc(userId)
    .collection("tastings")
    .doc(tastingId)
    .get();
};

export const getBeans = (
  db: firebase.firestore.Firestore,
  userId: string,
  { openedOnly = false, limit = 0 } = {}
) => {
  if (openedOnly) {
    return db
      .collection("users")
      .doc(userId)
      .collection("beans")
      .orderBy("roastDate", "desc")
      .where("isFinished", "==", false)
      .limit(limit ? limit : MAX_LIMIT)
      .get()
      .then(buildArrayFromQuerySnapshot);
  } else {
    return db
      .collection("users")
      .doc(userId)
      .collection("beans")
      .orderBy("roastDate", "desc")
      .limit(limit ? limit : MAX_LIMIT)
      .get()
      .then(buildArrayFromQuerySnapshot);
  }
};

export const getBeansById = async (
  db: firebase.firestore.Firestore,
  userId: string,
  beansId: string
) => {
  if (!beansId) throw new Error();

  return db
    .collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId)
    .get();
};

export const addBeans = async (
  db: firebase.firestore.Firestore,
  userId: string,
  beans: Beans
) => {
  Object.keys(beans).forEach(
    (key) =>
      beans[key as keyof Beans] === undefined &&
      delete beans[key as keyof Beans]
  );
  return db.collection("users").doc(userId).collection("beans").add(beans);
};

export const updateBeans = async (
  db: firebase.firestore.Firestore,
  userId: string,
  beans: Partial<Beans>,
  beansId: string
) => {
  Object.keys(beans).forEach(
    (key) =>
      beans[key as keyof Beans] === undefined &&
      delete beans[key as keyof Beans]
  );
  db.collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId)
    .update(beans);
};

export const deleteBeans = async (
  db: firebase.firestore.Firestore,
  userId: string,
  beansId: string
) =>
  db.collection("users").doc(userId).collection("beans").doc(beansId).delete();

export const beansSetFinished = async (
  db: firebase.firestore.Firestore,
  userId: string,
  beansId: string,
  finished: boolean
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId)
    .update({ isFinished: finished });

export const beansFreezeToday = async (
  db: firebase.firestore.Firestore,
  userId: string,
  beansId: string
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId)
    .update({ freezeDate: new Date() });

export const beansThawToday = async (
  db: firebase.firestore.Firestore,
  userId: string,
  beansId: string
) =>
  db
    .collection("users")
    .doc(userId)
    .collection("beans")
    .doc(beansId)
    .update({ thawDate: new Date() });

export const generateSecretKey = async (
  db: firebase.firestore.Firestore,
  userId: string
) => {
  const key = generateRandomString();
  return db.collection("users").doc(userId).set({ secretKey: key });
};

export const getUserSecretKey = async (
  db: firebase.firestore.Firestore,
  userId: string
): Promise<string> => {
  const user = await db.collection("users").doc(userId).get();
  if (!user.exists) {
    return "";
  }
  const key = (user.data() as User).secretKey;
  return key ? key : "";
};

const buildArrayFromQuerySnapshot = (
  querySnapshot: firebase.firestore.QuerySnapshot
) => {
  let arr: firebase.firestore.DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    const id = doc.id;
    const docWithId = { id, ...doc.data() };
    arr.push(docWithId);
  });
  return arr;
};
