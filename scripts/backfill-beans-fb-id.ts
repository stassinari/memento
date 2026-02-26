import "dotenv/config";

import admin from "firebase-admin";
import fs from "fs/promises";
import postgres from "postgres";

type TastingBeanRef = {
  userId: string;
  userFbId: string;
  beanFbId: string;
};

type PgBean = {
  id: string;
  userId: string;
  fbId: string | null;
  name: string;
  roaster: string;
  roastDate: Date | null;
  origin: string;
  country: string | null;
  process: string | null;
  varietals: string[];
};

type FirestoreBean = {
  id: string;
  name: string;
  roaster: string;
  roastDate: Date | null;
  origin: string | null;
  country: string | null;
  process: string | null;
  varietals: string[];
};

type Candidate = {
  pgBeanId: string;
  score: number;
  reasons: string[];
};

type MatchStatus = "AUTO" | "REVIEW" | "UNMATCHED";

type MatchResult = {
  status: MatchStatus;
  userId: string;
  userFbId: string;
  beanFbId: string;
  firestoreBean: FirestoreBean | null;
  chosenPgBeanId: string | null;
  chosenScore: number | null;
  chosenReasons: string[];
  alternatives: Candidate[];
  reason: string;
};

const APPLY = process.argv.includes("--apply");
const ONLY_NULL = !process.argv.includes("--include-existing");
const LOG_PATH =
  process.argv.find((arg) => arg.startsWith("--log="))?.split("=", 2)[1] ??
  "beans-fb-id-backfill-log.json";
const SQL_PATH =
  process.argv.find((arg) => arg.startsWith("--sql="))?.split("=", 2)[1] ??
  "beans-fb-id-backfill-updates.sql";

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
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!path) {
    return null;
  }

  const raw = await fs.readFile(path, "utf-8");
  return JSON.parse(raw);
};

const normalize = (value: string | null | undefined): string =>
  (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const parseDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (value instanceof admin.firestore.Timestamp) return value.toDate();

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "object" && value !== null) {
    const record = value as { _seconds?: unknown; seconds?: unknown };
    const seconds =
      typeof record.seconds === "number"
        ? record.seconds
        : typeof record._seconds === "number"
          ? record._seconds
          : null;
    if (seconds !== null) {
      return new Date(seconds * 1000);
    }
  }

  return null;
};

const dateToYmd = (value: Date | null): string | null => {
  if (!value) return null;
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const overlapSize = (a: string[], b: string[]): number => {
  const setA = new Set(a.map((item) => normalize(item)).filter(Boolean));
  const setB = new Set(b.map((item) => normalize(item)).filter(Boolean));
  let count = 0;
  for (const item of setA) {
    if (setB.has(item)) count += 1;
  }
  return count;
};

const scoreCandidate = (pgBean: PgBean, fsBean: FirestoreBean): Candidate => {
  let score = 0;
  const reasons: string[] = [];

  const nameExact = normalize(pgBean.name) !== "" && normalize(pgBean.name) === normalize(fsBean.name);
  const roasterExact =
    normalize(pgBean.roaster) !== "" && normalize(pgBean.roaster) === normalize(fsBean.roaster);

  if (nameExact) {
    score += 100;
    reasons.push("name exact");
  }

  if (roasterExact) {
    score += 80;
    reasons.push("roaster exact");
  }

  if (nameExact && roasterExact) {
    score += 40;
    reasons.push("name+roaster pair");
  }

  const pgDate = dateToYmd(pgBean.roastDate);
  const fsDate = dateToYmd(fsBean.roastDate);
  if (pgDate && fsDate && pgDate === fsDate) {
    score += 40;
    reasons.push("roastDate exact day");
  }

  if (normalize(pgBean.country) && normalize(pgBean.country) === normalize(fsBean.country)) {
    score += 10;
    reasons.push("country exact");
  }

  if (normalize(pgBean.process) && normalize(pgBean.process) === normalize(fsBean.process)) {
    score += 10;
    reasons.push("process exact");
  }

  if (normalize(pgBean.origin) && normalize(pgBean.origin) === normalize(fsBean.origin)) {
    score += 5;
    reasons.push("origin exact");
  }

  const varietalOverlap = overlapSize(pgBean.varietals, fsBean.varietals);
  if (varietalOverlap > 0) {
    score += Math.min(varietalOverlap * 3, 12);
    reasons.push(`varietals overlap ${varietalOverlap}`);
  }

  return {
    pgBeanId: pgBean.id,
    score,
    reasons,
  };
};

const classifyMatch = (
  refs: TastingBeanRef,
  fsBean: FirestoreBean | null,
  candidates: Candidate[],
): MatchResult => {
  if (!fsBean) {
    return {
      status: "UNMATCHED",
      userId: refs.userId,
      userFbId: refs.userFbId,
      beanFbId: refs.beanFbId,
      firestoreBean: null,
      chosenPgBeanId: null,
      chosenScore: null,
      chosenReasons: [],
      alternatives: [],
      reason: "Firestore bean not found",
    };
  }

  const sorted = [...candidates].sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    return {
      status: "UNMATCHED",
      userId: refs.userId,
      userFbId: refs.userFbId,
      beanFbId: refs.beanFbId,
      firestoreBean: fsBean,
      chosenPgBeanId: null,
      chosenScore: null,
      chosenReasons: [],
      alternatives: [],
      reason: "No Postgres beans available for this user",
    };
  }

  const [best, second] = sorted;
  const margin = second ? best.score - second.score : 999;

  const hasNameRoaster =
    best.reasons.includes("name exact") && best.reasons.includes("roaster exact");

  if (best.score >= 180 && margin >= 35 && hasNameRoaster) {
    return {
      status: "AUTO",
      userId: refs.userId,
      userFbId: refs.userFbId,
      beanFbId: refs.beanFbId,
      firestoreBean: fsBean,
      chosenPgBeanId: best.pgBeanId,
      chosenScore: best.score,
      chosenReasons: best.reasons,
      alternatives: sorted.slice(1, 5),
      reason: "High-confidence unique match",
    };
  }

  return {
    status: "REVIEW",
    userId: refs.userId,
    userFbId: refs.userFbId,
    beanFbId: refs.beanFbId,
    firestoreBean: fsBean,
    chosenPgBeanId: best.pgBeanId,
    chosenScore: best.score,
    chosenReasons: best.reasons,
    alternatives: sorted.slice(1, 5),
    reason: "Ambiguous or below auto threshold",
  };
};

const buildUpdateSql = (rows: MatchResult[]): string => {
  const lines = [
    "-- Generated by backfill-beans-fb-id.ts",
    "-- Applies only high-confidence matches.",
    "begin;",
  ];

  for (const row of rows) {
    if (row.status !== "AUTO" || !row.chosenPgBeanId) continue;

    lines.push(
      `update beans set fb_id = '${row.beanFbId.replace(/'/g, "''")}' where id = '${row.chosenPgBeanId.replace(/'/g, "''")}' and user_id = '${row.userId.replace(/'/g, "''")}' and fb_id is null;`,
    );
  }

  lines.push("commit;");
  return lines.join("\n");
};

const main = async () => {
  const serviceAccount = await loadServiceAccount();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } else {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  const firestore = admin.firestore();
  firestore.settings({ ignoreUndefinedProperties: true });

  const sql = postgres(requireEnv("DATABASE_URL"), { max: 1 });

  const tastingRefs = await sql<TastingBeanRef[]>`
    select distinct
      t.user_id as "userId",
      u.fb_id as "userFbId",
      s.value #>> '{variableValue,_path,segments,3}' as "beanFbId"
    from tastings t
    join users u on u.id = t.user_id
    cross join lateral jsonb_array_elements(t.data->'samples') s
    where t.data->>'variable' = 'beans'
      and u.fb_id is not null
      and (s.value #>> '{variableValue,_path,segments,3}') is not null
  `;

  const pgBeansRows = await sql<PgBean[]>`
    select
      b.id,
      b.user_id as "userId",
      b.fb_id as "fbId",
      b.name,
      b.roaster,
      b.roast_date as "roastDate",
      b.origin,
      b.country,
      b.process,
      b.varietals
    from beans b
    ${ONLY_NULL ? sql`where b.fb_id is null` : sql``}
  `;

  const pgBeansByUser = new Map<string, PgBean[]>();
  for (const bean of pgBeansRows) {
    const current = pgBeansByUser.get(bean.userId) ?? [];
    current.push(bean);
    pgBeansByUser.set(bean.userId, current);
  }

  const fsBeanCache = new Map<string, FirestoreBean | null>();

  const results: MatchResult[] = [];

  for (const ref of tastingRefs) {
    const cacheKey = `${ref.userFbId}:${ref.beanFbId}`;

    let fsBean = fsBeanCache.get(cacheKey) ?? null;

    if (!fsBeanCache.has(cacheKey)) {
      const doc = await firestore
        .collection("users")
        .doc(ref.userFbId)
        .collection("beans")
        .doc(ref.beanFbId)
        .get();

      if (doc.exists) {
        const data = doc.data() ?? {};
        fsBean = {
          id: doc.id,
          name: typeof data.name === "string" ? data.name : "",
          roaster: typeof data.roaster === "string" ? data.roaster : "",
          roastDate: parseDate(data.roastDate),
          origin: typeof data.origin === "string" ? data.origin : null,
          country: typeof data.country === "string" ? data.country : null,
          process: typeof data.process === "string" ? data.process : null,
          varietals: Array.isArray(data.varietals)
            ? data.varietals.filter((v): v is string => typeof v === "string")
            : [],
        };
      }

      fsBeanCache.set(cacheKey, fsBean);
    }

    const pgBeansForUser = pgBeansByUser.get(ref.userId) ?? [];
    const candidates = fsBean
      ? pgBeansForUser.map((bean) => scoreCandidate(bean, fsBean)).sort((a, b) => b.score - a.score)
      : [];

    results.push(classifyMatch(ref, fsBean, candidates));
  }

  const claimedPgBeans = new Map<string, MatchResult>();
  for (const result of results) {
    if (result.status !== "AUTO" || !result.chosenPgBeanId) continue;

    const existing = claimedPgBeans.get(result.chosenPgBeanId);
    if (!existing) {
      claimedPgBeans.set(result.chosenPgBeanId, result);
      continue;
    }

    const existingScore = existing.chosenScore ?? 0;
    const currentScore = result.chosenScore ?? 0;

    if (currentScore > existingScore) {
      existing.status = "REVIEW";
      existing.reason = `Conflicts with ${result.beanFbId} for same Postgres bean`;
      claimedPgBeans.set(result.chosenPgBeanId, result);
    } else {
      result.status = "REVIEW";
      result.reason = `Conflicts with ${existing.beanFbId} for same Postgres bean`;
    }
  }

  const autoRows = results.filter((row) => row.status === "AUTO" && row.chosenPgBeanId);
  const reviewRows = results.filter((row) => row.status === "REVIEW");
  const unmatchedRows = results.filter((row) => row.status === "UNMATCHED");

  const updateSql = buildUpdateSql(results);
  await fs.writeFile(SQL_PATH, updateSql, "utf-8");

  if (APPLY && autoRows.length > 0) {
    await sql.begin(async (tx) => {
      for (const row of autoRows) {
        await tx`
          update beans
          set fb_id = ${row.beanFbId}
          where id = ${row.chosenPgBeanId!}
            and user_id = ${row.userId}
            and fb_id is null
        `;
      }
    });
  }

  const log = {
    generatedAt: new Date().toISOString(),
    apply: APPLY,
    onlyNull: ONLY_NULL,
    counts: {
      tastingRefs: tastingRefs.length,
      auto: autoRows.length,
      review: reviewRows.length,
      unmatched: unmatchedRows.length,
    },
    files: {
      sql: SQL_PATH,
    },
    results,
  };

  await fs.writeFile(LOG_PATH, JSON.stringify(log, null, 2), "utf-8");

  console.log(`Tasting refs: ${tastingRefs.length}`);
  console.log(`AUTO: ${autoRows.length}`);
  console.log(`REVIEW: ${reviewRows.length}`);
  console.log(`UNMATCHED: ${unmatchedRows.length}`);
  console.log(`SQL: ${SQL_PATH}`);
  console.log(`Log: ${LOG_PATH}`);

  await sql.end({ timeout: 5 });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
