import { createFileRoute } from "@tanstack/react-router";
import { randomBytes } from "crypto";
import { and, eq } from "drizzle-orm";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { db } from "~/db/db";
import { espresso, espressoDecentReadings, users } from "~/db/schema";
import {
  AlreadyExistsError,
  parseJsonShot,
  parseTclShot,
} from "~/lib/decent-parsers";

// Configure emulator hosts for local development
if (typeof window === "undefined") {
  // Server-side only
  const isLocal =
    process.env.NODE_ENV !== "production" ||
    process.env.VITE_FB_PROJECT_ID === "brewlog-dev";

  if (isLocal) {
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = "127.0.0.1:9199";
  }
}

// Initialize Firebase Admin SDK (only once)
if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Production: use service account credentials from env var (JSON string)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Local development: use emulators with brewlog-dev project ID
    initializeApp({
      projectId: "brewlog-dev",
    });
  }
}

/**
 * Generate a Firestore-compatible document ID (20 character alphanumeric)
 * Used for maintaining consistency between Firestore and PostgreSQL during migration
 */
function generateFirestoreId(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(20);
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

/**
 * API endpoint to receive Decent Espresso shot uploads
 * Writes to PostgreSQL only (Firestore writes handled by Firebase Function during migration)
 *
 * Security: Basic auth with email:secretKey
 * Expected header: Authorization: Basic <base64(email:secretKey)>
 */
export const Route = createFileRoute("/api/decent-shots")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Parse Basic auth
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Basic ")) {
          return new Response(
            JSON.stringify({ error: "Auth headers not sent" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const base64Credentials = authHeader.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString(
          "ascii",
        );
        const [email, reqSecretKey] = credentials.split(":");

        if (!email || !reqSecretKey) {
          return new Response(
            JSON.stringify({ error: "Invalid auth format" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        console.log("Call with user data", { email, reqSecretKey });

        // Step 1: Verify email exists via Firebase Admin
        let firebaseUid: string;
        try {
          const auth = getAuth();

          // console.log(auth);

          const userRecord = await auth.getUserByEmail(email);
          firebaseUid = userRecord.uid;
        } catch (error) {
          console.error("Firebase auth error:", error);
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        console.log("User found", firebaseUid);

        // Step 2: Find user in PostgreSQL and verify secretKey
        let userId: string;
        try {
          const [user] = await db
            .select({ id: users.id, secretKey: users.secretKey })
            .from(users)
            .where(eq(users.fbId, firebaseUid))
            .limit(1);

          if (!user) {
            return new Response(
              JSON.stringify({ error: "User not found in database" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          if (!user.secretKey || user.secretKey !== reqSecretKey) {
            return new Response(
              JSON.stringify({ error: "Invalid secret key" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          userId = user.id;
        } catch (error) {
          console.error("Database error during auth:", error);
          return new Response(
            JSON.stringify({ error: "Authentication failed" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        // Parse multipart/form-data
        try {
          const contentType = request.headers.get("content-type");
          if (!contentType?.includes("multipart/form-data")) {
            return new Response(
              JSON.stringify({ error: "Expected multipart/form-data" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const formData = await request.formData();
          const file = formData.get("file") as File;
          const providedFbId = formData.get("fbId") as string | null; // Optional fbId from Cloud Function

          if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Read file content
          const fileContent = await file.text();
          const filename = file.name;
          const mimeType = file.type;

          // Parse based on filename extension (more reliable than MIME type)
          const isJson =
            filename.toLowerCase().endsWith(".json") ||
            mimeType === "application/json";
          const isShot = filename.toLowerCase().endsWith(".shot");

          let parsed;
          if (isJson) {
            parsed = parseJsonShot(fileContent);
          } else if (isShot || mimeType === "application/octet-stream") {
            parsed = parseTclShot(fileContent);
          } else {
            return new Response(
              JSON.stringify({ error: "Unsupported file type" }),
              { status: 415, headers: { "Content-Type": "application/json" } },
            );
          }

          const { espresso: shotData, timeSeries } = parsed;

          // Check if shot already exists (by date and fromDecent flag)
          const [existingShot] = await db
            .select({ id: espresso.id })
            .from(espresso)
            .where(
              and(
                eq(espresso.userId, userId),
                eq(espresso.date, shotData.date),
                eq(espresso.fromDecent, true),
              ),
            )
            .limit(1);

          if (existingShot) {
            const error: AlreadyExistsError = {
              code: "ALREADY_EXISTS",
              message: "The uploaded shot already exists",
            };
            return new Response(JSON.stringify(error), {
              status: 409,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Use provided fbId from Cloud Function, or generate a new one
          const fbId = providedFbId || generateFirestoreId();

          // Insert espresso record
          const [insertedEspresso] = await db
            .insert(espresso)
            .values({
              fbId,
              userId,
              date: shotData.date,
              fromDecent: true,
              partial: shotData.partial,
              profileName: shotData.profileName,
              targetWeight: shotData.targetWeight,
              actualTime: shotData.actualTime,
              actualWeight: shotData.actualWeight,
              uploadedAt: shotData.uploadedAt,
              grindSetting: null,
              machine: null,
              grinder: null,
              grinderBurrs: null,
              portafilter: null,
              basket: null,
              beansWeight: null,
              waterTemperature: null,
              rating: null,
              notes: null,
              tds: null,
              aroma: null,
              acidity: null,
              sweetness: null,
              body: null,
              finish: null,
            })
            .returning({ id: espresso.id });

          // Insert time series data
          await db.insert(espressoDecentReadings).values({
            espressoId: insertedEspresso.id,
            time: timeSeries.time,
            pressure: timeSeries.pressure,
            weightTotal: timeSeries.weightTotal,
            flow: timeSeries.flow,
            weightFlow: timeSeries.weightFlow,
            temperatureBasket: timeSeries.temperatureBasket,
            temperatureMix: timeSeries.temperatureMix,
            pressureGoal: timeSeries.pressureGoal,
            temperatureGoal: timeSeries.temperatureGoal,
            flowGoal: timeSeries.flowGoal,
          });

          console.log(`Decent shot ${fbId} written to PostgreSQL`);

          return new Response(JSON.stringify({ id: fbId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error processing shot upload:", error);
          return new Response(JSON.stringify({ error: "Processing error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
