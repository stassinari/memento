import { Stream } from "stream";
import { DecentReadings } from ".";

export const extractJsonShot = async (
  data: Stream,
  admin: any,
  uid: string
) => {
  const jsonShot = JSON.parse(data.toString());

  const date = new Date(parseInt(`${jsonShot.timestamp}000`));

  console.log("[JSON] shot parsed, checking if it already exists");
  console.log({ date });

  // check if shot was uploaded before by matching dates
  // TODO refactor this to own func
  const alreadyExists = await admin
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("espresso")
    .where("date", "==", date)
    .where("fromDecent", "==", true)
    .get()
    .then((espressoList: any) => espressoList.size > 0);
  if (alreadyExists) {
    throw {
      code: "ALREADY_EXISTS",
      message: "the uploaded shot already exists",
    };
  }

  console.log("[JSON] shot is new, parsing all the things");

  const profileName = jsonShot.profile.title;
  const targetWeight = parseFloat(jsonShot.profile["target_weight"]);
  const actualTime = parseFloat(jsonShot.meta.time);
  const actualWeight = parseFloat(jsonShot.meta.out);

  const espresso = {
    partial: true,
    fromDecent: true,
    profileName,
    date,
    targetWeight,
    actualTime,
    actualWeight,
    uploadedAt: new Date(),
  };

  const flow = jsonShot.flow.flow.map(parseFloatArray);
  const flowGoal = jsonShot.flow.goal.map(parseFloatArray);
  const weightFlow = jsonShot.flow["by_weight"].map(parseFloatArray);

  const pressure = jsonShot.pressure.pressure.map(parseFloatArray);
  const pressureGoal = jsonShot.pressure.goal.map(parseFloatArray);

  const temperatureBasket = jsonShot.temperature.basket.map(parseFloatArray);
  const temperatureGoal = jsonShot.temperature.goal.map(parseFloatArray);
  const temperatureMix = jsonShot.temperature.mix.map(parseFloatArray);

  const weightTotal = jsonShot.totals.weight.map(parseFloatArray);

  const time = jsonShot.elapsed.map(parseFloatArray);

  const timeSeries: DecentReadings = {
    time,
    pressure,
    weightTotal,
    flow,
    weightFlow,
    temperatureBasket,
    temperatureMix,
    pressureGoal,
    temperatureGoal,
    flowGoal,
  };

  console.log("[JSON] parsed all the things, skipping timeSeries log");

  return { espresso, timeSeries };
};

const parseFloatArray = (v: string) => parseFloat(v);
