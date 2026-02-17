import { createFileRoute } from "@tanstack/react-router";
import { and, eq } from "drizzle-orm";
import { db } from "~/db/db";
import { espresso, espressoDecentReadings, users } from "~/db/schema";
import {
  AlreadyExistsError,
  parseJsonShot,
  parseTclShot,
} from "~/lib/decent-parsers";

// No Firebase Admin initialization needed!
// The Cloud Function already authenticates users and passes the UID

/**
 * API endpoint to receive Decent Espresso shot uploads
 * Writes to PostgreSQL only (Firestore writes handled by Firebase Function during migration)
 *
 * Security: Basic auth with uid:secretKey (uid provided by Cloud Function after Firebase Auth)
 * Expected header: Authorization: Basic <base64(uid:secretKey)>
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
        const [firebaseUid, reqSecretKey] = credentials.split(":");

        if (!firebaseUid || !reqSecretKey) {
          return new Response(
            JSON.stringify({ error: "Invalid auth format" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        console.log("Call with Firebase UID:", firebaseUid);

        // Find user in PostgreSQL and verify secretKey
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

        console.log("User authenticated, PostgreSQL user ID:", userId);

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

          // Insert espresso record
          const [insertedEspresso] = await db
            .insert(espresso)
            .values({
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

          console.log(
            `Decent shot ${insertedEspresso.id} written to PostgreSQL`,
          );

          return new Response(JSON.stringify({ id: insertedEspresso.id }), {
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
