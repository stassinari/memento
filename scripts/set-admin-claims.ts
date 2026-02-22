/**
 * set-admin-claims.js
 *
 * Sets the "admin" custom claim on a list of Firebase user IDs.
 * This is used to see "admin-only" pages in the app, e.g. the feature flags page.
 *
 * Setup:
 *   1. Go to Firebase Console → Project Settings → Service Accounts
 *   2. Click "Generate new private key" — this downloads a JSON file
 *   3. Place it in the same directory as this script (or anywhere you like)
 *   4. Create a .env file pointing to it:
 *        FIREBASE_SERVICE_ACCOUNT_PATH=./your-project-abc123-firebase-admin.json
 *
 * Usage:
 *   node set-admin-claims.js
 */

import { config } from "dotenv";
import admin from "firebase-admin";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(__dirname, ".env") });

// ---------------------------------------------------------------------------
// 👉 Add your admin user IDs here
// ---------------------------------------------------------------------------
const ADMIN_USER_IDS = [process.env.USER_ID];
// ---------------------------------------------------------------------------

// Initialise the Admin SDK using your service account key
admin.initializeApp({
  credential: admin.credential.cert(resolve(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_PATH)),
});

async function setAdminClaims() {
  console.log(`Setting admin claims for ${ADMIN_USER_IDS.length} user(s)...\n`);

  const results = await Promise.allSettled(
    ADMIN_USER_IDS.map(async (uid) => {
      await admin.auth().setCustomUserClaims(uid, { role: "admin" });
      return uid;
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log(`  ✓ ${result.value}`);
    } else {
      console.error(`  ✗ Failed — ${result.reason.message}`);
    }
  }

  // Verify by fetching one of the users back
  const firstUid = ADMIN_USER_IDS[0];
  const user = await admin.auth().getUser(firstUid);
  console.log(`\nVerification — claims for ${firstUid}:`);
  console.log(" ", JSON.stringify(user.customClaims));
}

setAdminClaims().catch(console.error);
