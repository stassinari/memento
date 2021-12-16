import { Stream } from "stream";
import { Espresso } from ".";

export interface DecentReadings {
  time: number[];
  pressure: number[];
  weightTotal: number[];
  flow: number[];
  weightFlow: number[];
  temperatureBasket: number[];
  temperatureMix: number[];
  pressureGoal: number[];
  temperatureGoal: number[];
  flowGoal: number[];
}

interface TclJsConversion {
  tcl: string;
  js: keyof DecentReadings | "";
}

const properties: TclJsConversion[] = [
  { tcl: "clock", js: "" },
  { tcl: "espresso_elapsed", js: "time" },
  { tcl: "espresso_pressure", js: "pressure" },
  { tcl: "espresso_weight", js: "weightTotal" },
  { tcl: "espresso_flow", js: "flow" },
  { tcl: "espresso_flow_weight", js: "weightFlow" },
  { tcl: "espresso_temperature_basket", js: "temperatureBasket" },
  { tcl: "espresso_temperature_mix", js: "temperatureMix" },
  { tcl: "espresso_pressure_goal", js: "pressureGoal" },
  { tcl: "espresso_temperature_goal", js: "temperatureGoal" },
  { tcl: "espresso_flow_goal", js: "flowGoal" },
  { tcl: `"title":`, js: "" },
  { tcl: `"target_weight":`, js: "" },
  { tcl: "final_espresso_weight", js: "" },
];

const bracesRegex = /\{(.*?)\}/g;

const parseShotFile = (data: Stream): string[] =>
  data
    .toString()
    .split("\n")
    .filter((line) => {
      return properties.map((p) => p.tcl).includes(line.trim().split(" ")[0]);
    });

const extractDate = (lines: string[]): Date => {
  const stringTs =
    lines.find((line) => line.startsWith("clock"))?.split(" ")[1] + "000";
  if (!stringTs) {
    throw new Error("parsing error - date");
  }
  return new Date(parseInt(stringTs));
};

export const extractProfileName = (lines: string[]): string => {
  const raw = lines.find((line) => line.includes("title"))?.slice(0, -1);
  try {
    const json = JSON.parse("{" + raw! + "}");
    return json.title;
  } catch (error) {
    throw new Error("parsing error - title");
  }
};

const extractTargetWeight = (lines: string[]): number => {
  const raw = lines
    .find((line) => line.includes("target_weight"))
    ?.slice(0, -1);
  try {
    const json = JSON.parse("{" + raw! + "}");
    return json["target_weight"];
  } catch (error) {
    throw new Error("parsing error - target_weight");
  }
};

const extractTotalWeight = (lines: string[]): number => {
  const stringTs = lines
    .find((line) => line.trim().startsWith("final_espresso_weight"))
    ?.trim()
    .split(" ")[1];
  if (!stringTs) {
    throw new Error("parsing error - final_espresso_weight");
  }
  return parseFloat(stringTs);
};

const extractTimeSeries = (lines: string[]): DecentReadings =>
  properties.reduce((obj, prop) => {
    const nums = lines.find((s) => s.startsWith(prop.tcl))?.match(bracesRegex);
    const arr =
      nums &&
      nums[0]
        .slice(1, -1)
        .split(" ")
        .map((n) => parseFloat(n));
    return arr ? { ...obj, [prop.js]: arr } : obj;
  }, {} as DecentReadings);

const extractTotalTime = (readings: DecentReadings): number =>
  Math.round(readings["time"][readings["time"].length - 1] * 10) / 10;

export const extractEspresso = async (
  data: Stream,
  admin: any,
  uid: string
) => {
  const lines = parseShotFile(data);
  const date = extractDate(lines);
  // check if shot was uploaded before by matching dates
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
  // extract all the things
  const profileName = extractProfileName(lines);
  const targetWeight = extractTargetWeight(lines);
  const timeSeries: DecentReadings = extractTimeSeries(lines);
  const actualTime = extractTotalTime(timeSeries);
  const actualWeight = extractTotalWeight(lines);

  const espresso: Espresso = {
    partial: true,
    fromDecent: true,
    profileName,
    date,
    targetWeight,
    actualTime,
    actualWeight,
    uploadedAt: new Date(),
  };

  return { espresso, timeSeries };
};
