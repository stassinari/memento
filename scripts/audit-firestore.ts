import "dotenv/config";

import admin from "firebase-admin";
import fs from "fs/promises";

const LOG_PATH =
  process.argv.find((arg) => arg.startsWith("--log="))?.split("=", 2)[1] ?? "firestore-audit.json";

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

const main = async () => {
  const serviceAccount = await loadServiceAccount();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    console.log(
      `Service account: ${serviceAccount.client_email ?? "unknown"} (${serviceAccount.project_id ?? "unknown"})`,
    );
  } else {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    if (process.env.FIREBASE_PROJECT_ID) {
      console.log(`Service account: (default) (${process.env.FIREBASE_PROJECT_ID})`);
    } else {
      console.log("Service account: (default) (unknown project)");
    }
  }

  const firestore = admin.firestore();
  const databaseId = process.env.FIRESTORE_DATABASE_ID;
  const settings: admin.firestore.Settings = {
    ignoreUndefinedProperties: true,
  };
  if (databaseId) {
    // Firestore multi-db support (Admin SDK >=10).
    // @ts-expect-error databaseId is not yet typed in this version.
    settings.databaseId = databaseId;
  }
  firestore.settings(settings);

  console.log(`Project ID: ${admin.app().options.projectId ?? "unknown"}`);
  console.log(
    `Database ID: ${databaseId ?? "(default)"}; Emulator: ${process.env.FIRESTORE_EMULATOR_HOST ?? "no"}`,
  );

  const usersCollection = firestore.collection("users");
  const userDocRefs = await usersCollection.listDocuments();
  const collections = await firestore.listCollections();
  console.log(`Collections: ${collections.map((col) => col.id).join(", ") || "(none)"}`);
  const users: {
    id: string;
    beans: number;
    brews: number;
    espresso: number;
    tastings: number;
  }[] = [];

  for (const userRef of userDocRefs) {
    const [beansSnap, brewsSnap, espressoSnap, tastingsSnap] = await Promise.all([
      userRef.collection("beans").get(),
      userRef.collection("brews").get(),
      userRef.collection("espresso").get(),
      userRef.collection("tastings").get(),
    ]);

    users.push({
      id: userRef.id,
      beans: beansSnap.size,
      brews: brewsSnap.size,
      espresso: espressoSnap.size,
      tastings: tastingsSnap.size,
    });
  }

  const summary = {
    totalUsers: users.length,
    totalUsersByList: userDocRefs.length,
    totals: users.reduce(
      (acc, user) => ({
        beans: acc.beans + user.beans,
        brews: acc.brews + user.brews,
        espresso: acc.espresso + user.espresso,
        tastings: acc.tastings + user.tastings,
      }),
      { beans: 0, brews: 0, espresso: 0, tastings: 0 },
    ),
  };

  await fs.writeFile(LOG_PATH, JSON.stringify({ summary, users }, null, 2), "utf-8");

  console.log(`Users (query): ${summary.totalUsers}`);
  console.log(`Users (listDocuments): ${summary.totalUsersByList}`);
  console.log(
    `First 50 IDs (listDocuments): ${
      userDocRefs
        .slice(0, 50)
        .map((ref) => ref.id)
        .join(", ") || "(none)"
    }`,
  );
  for (const user of users) {
    console.log(
      `${user.id} -> beans:${user.beans} brews:${user.brews} espresso:${user.espresso} tastings:${user.tastings}`,
    );
  }
  console.log(
    `Totals -> beans:${summary.totals.beans} brews:${summary.totals.brews} espresso:${summary.totals.espresso} tastings:${summary.totals.tastings}`,
  );
  console.log(`Log: ${LOG_PATH}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
