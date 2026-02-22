/**
 * Decent Espresso shot parsers
 * Copied from Firebase Functions to support TanStack Start migration
 */

export interface DecentEspresso {
  partial: boolean;
  fromDecent: boolean;
  profileName: string;
  date: Date;
  targetWeight: number;
  actualTime: number;
  actualWeight: number;
  uploadedAt: Date;
}

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

export interface ParsedShot {
  espresso: DecentEspresso;
  timeSeries: DecentReadings;
}

export interface AlreadyExistsError {
  code: "ALREADY_EXISTS";
  message: string;
}

/**
 * Parse JSON shot file from Decent Espresso machine
 */
export const parseJsonShot = (data: string): ParsedShot => {
  const jsonShot = JSON.parse(data);

  const date = new Date(parseInt(`${jsonShot.timestamp}000`));

  console.log("[JSON] shot parsed, date:", date);

  const profileName = jsonShot.profile.title;
  const targetWeight = parseFloat(jsonShot.profile["target_weight"]);
  const actualTime = parseFloat(jsonShot.meta.time);
  const actualWeight = parseFloat(jsonShot.meta.out);

  const espresso: DecentEspresso = {
    partial: true,
    fromDecent: true,
    profileName,
    date,
    targetWeight,
    actualTime,
    actualWeight,
    uploadedAt: new Date(),
  };

  const flow = jsonShot.flow.flow.map(parseFloat);
  const flowGoal = jsonShot.flow.goal.map(parseFloat);
  const weightFlow = jsonShot.flow["by_weight"].map(parseFloat);

  const pressure = jsonShot.pressure.pressure.map(parseFloat);
  const pressureGoal = jsonShot.pressure.goal.map(parseFloat);

  const temperatureBasket = jsonShot.temperature.basket.map(parseFloat);
  const temperatureGoal = jsonShot.temperature.goal.map(parseFloat);
  const temperatureMix = jsonShot.temperature.mix.map(parseFloat);

  const weightTotal = jsonShot.totals.weight.map(parseFloat);

  const time = jsonShot.elapsed.map(parseFloat);

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

  console.log("[JSON] parsed shot successfully");

  return { espresso, timeSeries };
};

/**
 * Parse .shot (TCL) file from Decent Espresso machine
 */

interface TclJsConversion {
  tcl: string;
  js: keyof DecentReadings | "";
}

const properties: TclJsConversion[] = [
  { tcl: "clock", js: "" },
  { tcl: `"title":`, js: "" },
  { tcl: `"target_weight":`, js: "" },
  { tcl: "final_espresso_weight", js: "" },
  { tcl: "espresso_elapsed", js: "time" },
  { tcl: "espresso_flow", js: "flow" },
  { tcl: "espresso_flow_goal", js: "flowGoal" },
  { tcl: "espresso_flow_weight", js: "weightFlow" },
  { tcl: "espresso_pressure", js: "pressure" },
  { tcl: "espresso_pressure_goal", js: "pressureGoal" },
  { tcl: "espresso_temperature_basket", js: "temperatureBasket" },
  { tcl: "espresso_temperature_goal", js: "temperatureGoal" },
  { tcl: "espresso_temperature_mix", js: "temperatureMix" },
  { tcl: "espresso_weight", js: "weightTotal" },
];

const bracesRegex = /\{(.*?)\}/g;

const parseShotFile = (data: string): string[] =>
  data.split("\n").filter((line) => {
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

const extractProfileName = (lines: string[]): string => {
  const raw = lines.find((line) => line.includes("title"))?.slice(0, -1);
  try {
    const json = JSON.parse("{" + raw! + "}");
    return json.title;
  } catch (error) {
    throw new Error("parsing error - title: " + error);
  }
};

const extractTargetWeight = (lines: string[]): number => {
  const raw = lines
    .find((line) => line.includes("target_weight"))
    ?.slice(0, -1);
  try {
    const json = JSON.parse("{" + raw! + "}");
    return parseFloat(json["target_weight"]);
  } catch (error) {
    throw new Error("parsing error - target_weight: " + error);
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

export const parseTclShot = (data: string): ParsedShot => {
  const lines = parseShotFile(data);
  const date = extractDate(lines);

  console.log("[TCL] shot parsed, date:", date);

  // extract all the things
  const profileName = extractProfileName(lines);
  const targetWeight = extractTargetWeight(lines);
  const timeSeries: DecentReadings = extractTimeSeries(lines);
  const actualTime = extractTotalTime(timeSeries);
  const actualWeight = extractTotalWeight(lines);

  const espresso: DecentEspresso = {
    partial: true,
    fromDecent: true,
    profileName,
    date,
    targetWeight,
    actualTime,
    actualWeight,
    uploadedAt: new Date(),
  };

  console.log("[TCL] parsed shot successfully");

  return { espresso, timeSeries };
};
