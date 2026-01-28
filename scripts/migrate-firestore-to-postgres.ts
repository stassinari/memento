import "dotenv/config";

import { randomUUID } from "crypto";
import admin from "firebase-admin";
import fs from "fs/promises";
import postgres, { Sql } from "postgres";

type FirestoreTimestamp = admin.firestore.Timestamp;

const DRY_RUN = process.argv.includes("--dry-run");
const LOG_PATH =
  process.argv.find((arg) => arg.startsWith("--log="))?.split("=", 2)[1] ??
  "migration-log.json";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const loadServiceAccount = async () => {
  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonEnv) {
    return JSON.parse(jsonEnv);
  }

  const path =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!path) {
    return null;
  }

  const raw = await fs.readFile(path, "utf-8");
  return JSON.parse(raw);
};

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof admin.firestore.Timestamp) return value.toDate();
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

const toNumber = (value: unknown): number | null => {
  if (typeof value !== "number") return null;
  return Number.isFinite(value) ? value : null;
};

const toInt = (value: unknown): number | null => {
  const num = toNumber(value);
  if (num === null) return null;
  return Number.isInteger(num) ? num : null;
};

const splitMinutesSeconds = (
  minutesValue: unknown,
): { minutes: number | null; seconds: number | null; normalized: boolean } => {
  const num = toNumber(minutesValue);
  if (num === null) {
    return { minutes: null, seconds: null, normalized: false };
  }
  if (Number.isInteger(num)) {
    return { minutes: num, seconds: null, normalized: false };
  }

  const minutes = Math.floor(num);
  const fractional = num - minutes;
  let seconds = Math.round(fractional * 100);

  if (seconds >= 60) {
    const carry = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return { minutes: minutes + carry, seconds, normalized: true };
  }

  return { minutes, seconds, normalized: true };
};

const getDocIdFromRef = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === "string") {
    const parts = value.split("/");
    return parts[parts.length - 1] || null;
  }
  if (typeof value === "object" && "id" in (value as { id: unknown })) {
    const id = (value as { id: unknown }).id;
    return typeof id === "string" ? id : null;
  }
  return null;
};

const sanitizeForLog = (value: unknown): unknown => {
  if (value instanceof admin.firestore.Timestamp) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object" && value !== null) {
    if (
      "path" in (value as { path?: unknown }) &&
      "id" in (value as { id?: unknown })
    ) {
      const maybeRef = value as { path?: unknown; id?: unknown };
      if (
        typeof maybeRef.path === "string" &&
        typeof maybeRef.id === "string"
      ) {
        return { path: maybeRef.path, id: maybeRef.id };
      }
    }
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeForLog(item));
    }
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, val]) => [key, sanitizeForLog(val)],
    );
    return Object.fromEntries(entries);
  }
  return value;
};

const startPgClient = async () => {
  if (DRY_RUN) return null;
  const client = postgres(requireEnv("DATABASE_URL"), { max: 1 });
  return client;
};

const upsertUser = async (
  client: Sql | null,
  fbId: string,
  secretKey: string | null,
): Promise<string> => {
  const id = randomUUID();
  if (!client) return id;
  const rows = await client<{ id: string }[]>`
    insert into users (id, fb_id, secret_key)
    values (${id}, ${fbId}, ${secretKey})
    on conflict (fb_id) do update set secret_key = excluded.secret_key
    returning id
  `;
  return rows[0]?.id ?? id;
};

const insertBeans = async (
  client: Sql | null,
  params: {
    id: string;
    fbId: string;
    userId: string;
    name: string;
    roaster: string;
    roastDate: Date | null;
    roastStyle: string | null;
    roastLevel: number | null;
    roastingNotes: string[];
    freezeDate: Date | null;
    thawDate: Date | null;
    isFinished: boolean;
    origin: string;
    country: string | null;
    region: string | null;
    varietals: string[];
    altitude: number | null;
    process: string | null;
    farmer: string | null;
    harvestDate: Date | null;
    blendParts: unknown | null;
  },
) => {
  if (!client) return;
  await client`
    insert into beans (
      id, fb_id, user_id,
      name, roaster, roast_date, roast_style, roast_level, roasting_notes,
      freeze_date, thaw_date, is_finished,
      origin, country, region, varietals, altitude, process, farmer, harvest_date,
      blend_parts
    )
    values (
      ${params.id}, ${params.fbId}, ${params.userId},
      ${params.name}, ${params.roaster}, ${params.roastDate},
      ${params.roastStyle}, ${params.roastLevel}, ${params.roastingNotes},
      ${params.freezeDate}, ${params.thawDate}, ${params.isFinished},
      ${params.origin}, ${params.country}, ${params.region}, ${params.varietals},
      ${params.altitude}, ${params.process}, ${params.farmer}, ${params.harvestDate},
      ${params.blendParts ? client.json(params.blendParts) : null}
    )
  `;
};

const insertBrew = async (
  client: Sql | null,
  params: {
    id: string;
    fbId: string;
    userId: string;
    beansId: string;
    date: Date;
    method: string;
    grinder: string | null;
    grinderBurrs: string | null;
    waterType: string | null;
    filterType: string | null;
    waterWeight: number;
    beansWeight: number;
    waterTemperature: number | null;
    grindSetting: string | null;
    timeMinutes: number | null;
    timeSeconds: number | null;
    rating: number | null;
    notes: string | null;
    tds: number | null;
    finalBrewWeight: number | null;
    extractionType: string | null;
    aroma: number | null;
    acidity: number | null;
    sweetness: number | null;
    body: number | null;
    finish: number | null;
  },
) => {
  if (!client) return;
  await client`
    insert into brews (
      id, fb_id, user_id, beans_id,
      date, method,
      grinder, grinder_burrs, water_type, filter_type,
      water_weight, beans_weight, water_temperature, grind_setting,
      time_minutes, time_seconds,
      rating, notes, tds, final_brew_weight, extraction_type,
      aroma, acidity, sweetness, body, finish
    )
    values (
      ${params.id}, ${params.fbId}, ${params.userId}, ${params.beansId},
      ${params.date}, ${params.method},
      ${params.grinder}, ${params.grinderBurrs}, ${params.waterType}, ${params.filterType},
      ${params.waterWeight}, ${params.beansWeight}, ${params.waterTemperature}, ${params.grindSetting},
      ${params.timeMinutes}, ${params.timeSeconds},
      ${params.rating}, ${params.notes}, ${params.tds}, ${params.finalBrewWeight}, ${params.extractionType},
      ${params.aroma}, ${params.acidity}, ${params.sweetness}, ${params.body}, ${params.finish}
    )
  `;
};

const insertEspresso = async (
  client: Sql | null,
  params: {
    id: string;
    fbId: string;
    userId: string;
    beansId: string | null;
    date: Date;
    grindSetting: string | null;
    machine: string | null;
    grinder: string | null;
    grinderBurrs: string | null;
    portafilter: string | null;
    basket: string | null;
    actualTime: number;
    targetWeight: number | null;
    beansWeight: number | null;
    waterTemperature: number | null;
    actualWeight: number | null;
    fromDecent: boolean;
    partial: boolean | null;
    profileName: string | null;
    uploadedAt: Date | null;
    rating: number | null;
    notes: string | null;
    tds: number | null;
    aroma: number | null;
    acidity: number | null;
    sweetness: number | null;
    body: number | null;
    finish: number | null;
  },
) => {
  if (!client) return;
  await client`
    insert into espresso (
      id, fb_id, user_id, beans_id,
      date,
      grind_setting, machine, grinder, grinder_burrs, portafilter, basket,
      actual_time,
      target_weight, beans_weight, water_temperature,
      actual_weight,
      from_decent, partial, profile_name, uploaded_at,
      rating, notes, tds,
      aroma, acidity, sweetness, body, finish
    )
    values (
      ${params.id}, ${params.fbId}, ${params.userId}, ${params.beansId},
      ${params.date},
      ${params.grindSetting}, ${params.machine}, ${params.grinder},
      ${params.grinderBurrs}, ${params.portafilter}, ${params.basket},
      ${params.actualTime},
      ${params.targetWeight}, ${params.beansWeight}, ${params.waterTemperature},
      ${params.actualWeight},
      ${params.fromDecent}, ${params.partial}, ${params.profileName}, ${params.uploadedAt},
      ${params.rating}, ${params.notes}, ${params.tds},
      ${params.aroma}, ${params.acidity}, ${params.sweetness}, ${params.body}, ${params.finish}
    )
  `;
};

const insertDecentReadings = async (
  client: Sql | null,
  params: {
    espressoId: string;
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
  },
) => {
  if (!client) return;
  await client`
    insert into espresso_decent_readings (
      espresso_id,
      time,
      pressure,
      weight_total,
      flow,
      weight_flow,
      temperature_basket,
      temperature_mix,
      pressure_goal,
      temperature_goal,
      flow_goal
    )
    values (
      ${params.espressoId},
      ${client.json(params.time)},
      ${client.json(params.pressure)},
      ${client.json(params.weightTotal)},
      ${client.json(params.flow)},
      ${client.json(params.weightFlow)},
      ${client.json(params.temperatureBasket)},
      ${client.json(params.temperatureMix)},
      ${client.json(params.pressureGoal)},
      ${client.json(params.temperatureGoal)},
      ${client.json(params.flowGoal)}
    )
  `;
};

const insertTasting = async (
  client: Sql | null,
  params: {
    id: string;
    fbId: string;
    userId: string;
    beansId: string | null;
    createdAt: Date | null;
    data: unknown;
  },
) => {
  if (!client) return;
  await client`
    insert into tastings (
      id, fb_id, user_id, beans_id, created_at, data
    ) values (
      ${params.id}, ${params.fbId}, ${params.userId},
      ${params.beansId}, ${params.createdAt},
      ${params.data ? client.json(params.data) : null}
    )
  `;
};

const main = async () => {
  const serviceAccount = await loadServiceAccount();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp();
  }

  const firestore = admin.firestore();
  firestore.settings({ ignoreUndefinedProperties: true });

  const client = await startPgClient();

  const beansIdMap = new Map<string, string>();
  const espressoIdMap = new Map<string, string>();

  let usersCount = 0;
  let beansCount = 0;
  let brewsCount = 0;
  let espressoCount = 0;
  let decentCount = 0;
  let tastingsCount = 0;
  const log = {
    startedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    warnings: [] as string[],
    skipped: {
      brews: [] as { id: string; reason: string; data: unknown }[],
      espresso: [] as { id: string; reason: string; data: unknown }[],
      tastings: [] as { id: string; reason: string; data: unknown }[],
      beans: [] as { id: string; reason: string; data: unknown }[],
    },
    normalized: {
      espressoFromDecent: [] as { id: string; reason: string; data: unknown }[],
      beansBlendParts: [] as { id: string; reason: string; data: unknown }[],
      brewTimeFields: [] as {
        id: string;
        reason: string;
        data: unknown;
      }[],
    },
    inserted: {
      users: [] as string[],
      beans: [] as string[],
      brews: [] as string[],
      espresso: [] as string[],
      decentReadings: [] as string[],
      tastings: [] as string[],
    },
  };

  const migrate = async (sql: Sql | null) => {
    const usersCollection = firestore.collection("users");
    const userDocRefs = await usersCollection.listDocuments();
    for (const userRef of userDocRefs) {
      const userDoc = await userRef.get();
      const fbUserId = userRef.id;
      const userData = userDoc.exists ? userDoc.data() : {};

      const userId = await upsertUser(
        sql,
        fbUserId,
        typeof userData?.secretKey === "string" ? userData.secretKey : null,
      );
      usersCount += 1;
      log.inserted.users.push(fbUserId);

      const beansSnap = await userRef.collection("beans").get();
      for (const beanDoc of beansSnap.docs) {
        const data = beanDoc.data();
        const id = randomUUID();
        beansIdMap.set(`${fbUserId}:${beanDoc.id}`, id);

        const origin =
          typeof data.origin === "string" ? data.origin : "single-origin";
        const blendParts =
          origin === "single-origin"
            ? null
            : Array.isArray(data.blend)
              ? data.blend
              : (data.blend ?? null);

        await insertBeans(sql, {
          id,
          fbId: beanDoc.id,
          userId,
          name: typeof data.name === "string" ? data.name : "Untitled",
          roaster: typeof data.roaster === "string" ? data.roaster : "Unknown",
          roastDate: toDate(data.roastDate),
          roastStyle:
            typeof data.roastStyle === "string" ? data.roastStyle : null,
          roastLevel: toNumber(data.roastLevel),
          roastingNotes: toStringArray(data.roastingNotes),
          freezeDate: toDate(data.freezeDate),
          thawDate: toDate(data.thawDate),
          isFinished:
            typeof data.isFinished === "boolean" ? data.isFinished : false,
          origin,
          country: typeof data.country === "string" ? data.country : null,
          region: typeof data.region === "string" ? data.region : null,
          varietals: toStringArray(data.varietals),
          altitude: toNumber(data.altitude),
          process: typeof data.process === "string" ? data.process : null,
          farmer: typeof data.farmer === "string" ? data.farmer : null,
          harvestDate: toDate(data.harvestDate),
          blendParts,
        });
        beansCount += 1;
        log.inserted.beans.push(beanDoc.id);
      }

      const brewsSnap = await userRef.collection("brews").get();
      for (const brewDoc of brewsSnap.docs) {
        const data = brewDoc.data();
        const date = toDate(data.date);
        if (!date) {
          const message = `Skipping brew ${brewDoc.id}: missing date`;
          console.warn(message);
          log.skipped.brews.push({
            id: brewDoc.id,
            reason: "missing date",
            data: sanitizeForLog(data),
          });
          continue;
        }
        const beansFbId = getDocIdFromRef(data.beans);
        if (!beansFbId) {
          const message = `Skipping brew ${brewDoc.id}: missing beans ref`;
          console.warn(message);
          log.skipped.brews.push({
            id: brewDoc.id,
            reason: "missing beans ref",
            data: sanitizeForLog(data),
          });
          continue;
        }
        const beansId = beansIdMap.get(`${fbUserId}:${beansFbId}`);
        if (!beansId) {
          const message = `Skipping brew ${brewDoc.id}: beans not found`;
          console.warn(message);
          log.skipped.brews.push({
            id: brewDoc.id,
            reason: "beans not found",
            data: sanitizeForLog(data),
          });
          continue;
        }

        const tastingScores = data.tastingScores ?? {};

        const minuteSplit = splitMinutesSeconds(data.timeMinutes);
        const timeMinutes =
          minuteSplit.normalized && minuteSplit.minutes !== null
            ? minuteSplit.minutes
            : toInt(data.timeMinutes);
        const timeSeconds = minuteSplit.normalized
          ? minuteSplit.seconds
          : toInt(data.timeSeconds);
        if (
          (data.timeMinutes !== null &&
            data.timeMinutes !== undefined &&
            timeMinutes === null) ||
          (data.timeSeconds !== null &&
            data.timeSeconds !== undefined &&
            timeSeconds === null)
        ) {
          log.normalized.brewTimeFields.push({
            id: brewDoc.id,
            reason: "time_minutes/time_seconds not integer; set to null",
            data: sanitizeForLog({
              ...data,
              _normalized: { timeMinutes, timeSeconds },
            }),
          });
        } else if (minuteSplit.normalized) {
          log.normalized.brewTimeFields.push({
            id: brewDoc.id,
            reason: "time_minutes decimal split into minutes/seconds",
            data: sanitizeForLog({
              ...data,
              _normalized: { timeMinutes, timeSeconds },
            }),
          });
        }

        await insertBrew(sql, {
          id: randomUUID(),
          fbId: brewDoc.id,
          userId,
          beansId,
          date,
          method: typeof data.method === "string" ? data.method : "Unknown",
          grinder: typeof data.grinder === "string" ? data.grinder : null,
          grinderBurrs:
            typeof data.grinderBurrs === "string" ? data.grinderBurrs : null,
          waterType: typeof data.waterType === "string" ? data.waterType : null,
          filterType:
            typeof data.filterType === "string" ? data.filterType : null,
          waterWeight: toNumber(data.waterWeight) ?? 0,
          beansWeight: toNumber(data.beansWeight) ?? 0,
          waterTemperature: toNumber(data.waterTemperature),
          grindSetting:
            typeof data.grindSetting === "string" ? data.grindSetting : null,
          timeMinutes,
          timeSeconds,
          rating: toNumber(data.rating),
          notes: typeof data.notes === "string" ? data.notes : null,
          tds: toNumber(data.tds),
          finalBrewWeight: toNumber(data.finalBrewWeight),
          extractionType:
            typeof data.extractionType === "string"
              ? data.extractionType
              : null,
          aroma: toNumber(tastingScores.aroma),
          acidity: toNumber(tastingScores.acidity),
          sweetness: toNumber(tastingScores.sweetness),
          body: toNumber(tastingScores.body),
          finish: toNumber(tastingScores.finish),
        });
        brewsCount += 1;
        log.inserted.brews.push(brewDoc.id);
      }

      const espressoSnap = await userRef.collection("espresso").get();
      for (const espressoDoc of espressoSnap.docs) {
        const data = espressoDoc.data();
        const date = toDate(data.date);
        if (!date) {
          const message = `Skipping espresso ${espressoDoc.id}: missing date`;
          console.warn(message);
          log.skipped.espresso.push({
            id: espressoDoc.id,
            reason: "missing date",
            data: sanitizeForLog(data),
          });
          continue;
        }

        const beansFbId = getDocIdFromRef(data.beans);
        const beansId = beansFbId
          ? (beansIdMap.get(`${fbUserId}:${beansFbId}`) ?? null)
          : null;

        const tastingScores = data.tastingScores ?? {};
        const id = randomUUID();
        espressoIdMap.set(`${fbUserId}:${espressoDoc.id}`, id);

        const profileName =
          typeof data.profileName === "string" ? data.profileName : null;
        const uploadedAt = toDate(data.uploadedAt);
        const actualWeight = toNumber(data.actualWeight);
        const fromDecentRaw =
          typeof data.fromDecent === "boolean" ? data.fromDecent : false;
        const fromDecent =
          fromDecentRaw &&
          !!profileName &&
          !!uploadedAt &&
          actualWeight !== null;

        if (fromDecentRaw && !fromDecent) {
          const message = `Normalizing espresso ${espressoDoc.id}: fromDecent true but missing required fields`;
          console.warn(message);
          log.normalized.espressoFromDecent.push({
            id: espressoDoc.id,
            reason:
              "fromDecent true but missing profile_name, uploaded_at, or actual_weight",
            data: sanitizeForLog(data),
          });
        }

        await insertEspresso(sql, {
          id,
          fbId: espressoDoc.id,
          userId,
          beansId,
          date,
          grindSetting:
            typeof data.grindSetting === "string" ? data.grindSetting : null,
          machine: typeof data.machine === "string" ? data.machine : null,
          grinder: typeof data.grinder === "string" ? data.grinder : null,
          grinderBurrs:
            typeof data.grinderBurrs === "string" ? data.grinderBurrs : null,
          portafilter:
            typeof data.portafilter === "string" ? data.portafilter : null,
          basket: typeof data.basket === "string" ? data.basket : null,
          actualTime: toNumber(data.actualTime) ?? 0,
          targetWeight: toNumber(data.targetWeight),
          beansWeight: toNumber(data.beansWeight),
          waterTemperature: toNumber(data.waterTemperature),
          actualWeight,
          fromDecent,
          partial: typeof data.partial === "boolean" ? data.partial : null,
          profileName,
          uploadedAt,
          rating: toNumber(data.rating),
          notes: typeof data.notes === "string" ? data.notes : null,
          tds: toNumber(data.tds),
          aroma: toNumber(tastingScores.aroma),
          acidity: toNumber(tastingScores.acidity),
          sweetness: toNumber(tastingScores.sweetness),
          body: toNumber(tastingScores.body),
          finish: toNumber(tastingScores.finish),
        });
        espressoCount += 1;
        log.inserted.espresso.push(espressoDoc.id);

        const readingsDoc = await espressoDoc.ref
          .collection("decentReadings")
          .doc("decentReadings")
          .get();
        if (readingsDoc.exists) {
          const readings = readingsDoc.data() ?? {};
          await insertDecentReadings(sql, {
            espressoId: id,
            time: Array.isArray(readings.time) ? readings.time : [],
            pressure: Array.isArray(readings.pressure) ? readings.pressure : [],
            weightTotal: Array.isArray(readings.weightTotal)
              ? readings.weightTotal
              : [],
            flow: Array.isArray(readings.flow) ? readings.flow : [],
            weightFlow: Array.isArray(readings.weightFlow)
              ? readings.weightFlow
              : [],
            temperatureBasket: Array.isArray(readings.temperatureBasket)
              ? readings.temperatureBasket
              : [],
            temperatureMix: Array.isArray(readings.temperatureMix)
              ? readings.temperatureMix
              : [],
            pressureGoal: Array.isArray(readings.pressureGoal)
              ? readings.pressureGoal
              : [],
            temperatureGoal: Array.isArray(readings.temperatureGoal)
              ? readings.temperatureGoal
              : [],
            flowGoal: Array.isArray(readings.flowGoal) ? readings.flowGoal : [],
          });
          decentCount += 1;
          log.inserted.decentReadings.push(espressoDoc.id);
        }
      }

      const tastingsSnap = await userRef.collection("tastings").get();
      for (const tastingDoc of tastingsSnap.docs) {
        const data = tastingDoc.data();
        const beansFbId = getDocIdFromRef(data.beans);
        const beansId = beansFbId
          ? (beansIdMap.get(`${fbUserId}:${beansFbId}`) ?? null)
          : null;
        await insertTasting(sql, {
          id: randomUUID(),
          fbId: tastingDoc.id,
          userId,
          beansId,
          createdAt: toDate(data.createdAt) ?? toDate(data.date),
          data,
        });
        tastingsCount += 1;
        log.inserted.tastings.push(tastingDoc.id);
      }
    }
  };

  try {
    if (client) {
      await client.begin(async (sql) => {
        await migrate(sql);
      });
    } else {
      await migrate(null);
    }
  } catch (error) {
    log.warnings.push(`Error: ${(error as Error).message}`);
    throw error;
  } finally {
    const summary = [
      `Dry run: ${DRY_RUN}`,
      `Users: ${usersCount}`,
      `Beans: ${beansCount}`,
      `Brews: ${brewsCount}`,
      `Espresso: ${espressoCount}`,
      `Decent readings: ${decentCount}`,
      `Tastings: ${tastingsCount}`,
    ];
    log.warnings.push(...summary);

    await fs.writeFile(
      LOG_PATH,
      JSON.stringify(
        {
          ...log,
          finishedAt: new Date().toISOString(),
          counts: {
            users: usersCount,
            beans: beansCount,
            brews: brewsCount,
            espresso: espressoCount,
            decentReadings: decentCount,
            tastings: tastingsCount,
          },
        },
        null,
        2,
      ),
      "utf-8",
    );

    console.log([...summary, `Log: ${LOG_PATH}`].join("\n"));

    if (client) {
      await client.end({ timeout: 5 });
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
