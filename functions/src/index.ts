import axios from "axios";
import Busboy from "busboy";
import cors from "cors";
import express from "express";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import FormData from "form-data";
import { extractJsonShot } from "./parseJson";
import { extractTclShot } from "./parseTcl";

admin.initializeApp();

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Use raw body parser to prevent automatic JSON parsing
// This is needed because we handle multipart/form-data manually with Busboy
app.use(express.raw({ type: "*/*", limit: "50mb" }));

interface DbUser {
  secretKey?: string;
}

export interface AlreadyExistsError {
  code: "ALREADY_EXISTS";
  message: string;
}

export interface Espresso {
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

interface FeatureFlags {
  write_to_postgres: boolean;
  write_to_firestore: boolean;
  read_from_postgres: boolean;
}

/**
 * Fetch feature flags from the main app
 */
async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const apiKey = process.env.FEATURE_FLAGS_API_KEY;
    if (!apiKey) {
      console.warn("FEATURE_FLAGS_API_KEY not set, using defaults");
      return {
        write_to_postgres: false,
        write_to_firestore: true,
        read_from_postgres: false,
      };
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.MAIN_APP_URL
        : "http://localhost:3000";

    const response = await axios.get(`${baseUrl}/api/feature-flags`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch feature flags:", error);
    // Default to Firestore-only mode on error
    return {
      write_to_postgres: false,
      write_to_firestore: true,
      read_from_postgres: false,
    };
  }
}

/**
 * Forward shot data to the TanStack Start endpoint
 */
async function forwardToPostgres(
  fileContent: string,
  filename: string,
  uid: string, // Firebase UID (already authenticated by Cloud Function)
  secretKey: string,
  fbId: string, // The Firestore ID to use for consistency
): Promise<void> {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.MAIN_APP_URL
        : "http://localhost:3000";

    // Determine MIME type from filename
    const mimeType = filename.toLowerCase().endsWith(".json")
      ? "application/json"
      : "application/octet-stream";

    // Create FormData with file (Node.js version)
    const formData = new FormData();
    const buffer = Buffer.from(fileContent, "utf-8");
    formData.append("file", buffer, {
      filename,
      contentType: mimeType,
    });
    formData.append("fbId", fbId); // Include the pre-generated Firestore ID

    // Send to TanStack Start endpoint with Basic auth (uid:secretKey instead of email:secretKey)
    const auth = Buffer.from(`${uid}:${secretKey}`).toString("base64");

    await axios.post(`${baseUrl}/api/decent-shots`, formData, {
      headers: {
        ...formData.getHeaders(), // Include multipart/form-data headers
        Authorization: `Basic ${auth}`,
      },
      timeout: 10000,
    });

    console.log("Shot forwarded to PostgreSQL endpoint successfully");
  } catch (error) {
    console.error("Failed to forward to PostgreSQL:", error);
    // Log but don't throw - allow Firestore write to proceed
  }
}

app.post("/", async (req, res) => {
  // only allow POST
  if (req.method !== "POST") {
    res
      .status(405)
      .json({ error: "HTTP Method " + req.method + " not allowed" });
    return;
  }

  // check user auth info
  const base64Credentials = req.headers.authorization?.split(" ")[1];
  if (!base64Credentials) {
    res.status(401).json({ error: "Auth headers not sent" });
    return;
  }
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii",
  );
  const [email, reqSecretKey] = credentials.split(":");

  let uid: string;
  try {
    const user = await admin.auth().getUserByEmail(email);
    uid = user.uid;
  } catch (error) {
    res
      .status(401)
      .json({ error: "User not found - code: ADMIN", details: error });
    return;
  }

  // check auth provided match secretKey in Firestore
  const dbUser = await admin.firestore().collection("users").doc(uid).get();
  if (!dbUser.exists) {
    res.status(401).json({ error: "User not found - code: DB" });
    return;
  }

  const dbUserData = dbUser.data() as DbUser;
  const dbSecretKey = dbUserData.secretKey;
  if (!dbSecretKey) {
    res.status(401).json({ error: "Error authenticating" });
    return;
  }

  if (reqSecretKey !== dbSecretKey) {
    res.status(401).json({ error: "Error authenticating" });
    return;
  }

  // Fetch feature flags
  const flags = await getFeatureFlags();
  console.log("Feature flags:", flags);

  // handle data from POST
  try {
    const busboy = Busboy({ headers: req.headers });

    busboy.on("file", (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;

      const chunks: Buffer[] = [];

      file.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on("end", async () => {
        const data = Buffer.concat(chunks);
        console.log({ fieldname, filename, encoding, mimeType });

        try {
          let espresso: Espresso;
          let timeSeries: DecentReadings;
          let fileContent: string;

          // Detect format based on filename extension (more reliable than MIME type)
          const isJson =
            filename.toLowerCase().endsWith(".json") ||
            mimeType === "application/json";
          const isShot =
            filename.toLowerCase().endsWith(".shot") ||
            mimeType === "application/octet-stream";

          fileContent = data.toString();

          if (isJson) {
            // -------- JSON shot file
            const shot = await extractJsonShot(fileContent, admin, uid);
            espresso = shot.espresso;
            timeSeries = shot.timeSeries;
          } else if (isShot) {
            // -------- TCL shot file
            const shot = await extractTclShot(fileContent, admin, uid);
            espresso = shot.espresso;
            timeSeries = shot.timeSeries;
          } else {
            res.status(415).json({ error: "unsupported file type" });
            return;
          }

          // Generate a single Firestore-compatible ID to use for both databases
          const fbId = admin.firestore().collection("temp").doc().id;

          // CONDITIONAL WRITE TO POSTGRES
          if (flags.write_to_postgres) {
            try {
              console.log("Forwarding to PostgreSQL endpoint...");
              await forwardToPostgres(
                fileContent,
                filename,
                uid, // Pass Firebase UID instead of email
                reqSecretKey,
                fbId, // Pass the generated ID
              );
            } catch (error) {
              console.error("PostgreSQL write failed:", error);
              // Continue to Firestore write
            }
          }

          // CONDITIONAL WRITE TO FIRESTORE
          if (flags.write_to_firestore) {
            try {
              console.log("Writing to Firestore...");

              // Convert Date objects to Firestore Timestamps
              const firestoreEspresso = {
                ...espresso,
                date: Timestamp.fromDate(espresso.date),
                uploadedAt: Timestamp.fromDate(espresso.uploadedAt),
              };

              // Use the pre-generated ID instead of auto-generating
              const docRef = admin
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("espresso")
                .doc(fbId);

              await docRef.set(firestoreEspresso);
              await docRef
                .collection("decentReadings")
                .doc("decentReadings")
                .set(timeSeries);
              console.log("Firestore write complete");
            } catch (error) {
              console.error("Firestore write failed:", error);
              // Continue anyway - data may be in PostgreSQL
            }
          }

          // Log if both flags are disabled
          if (!flags.write_to_postgres && !flags.write_to_firestore) {
            console.warn("Both write flags disabled - no data written");
          }
        } catch (error) {
          console.log(error);
          return;
        }
      });
      file.on("end", () => {
        // finished successfully
      });
      file.on("error", (err) => {
        console.log(err);
      });
    });

    // Triggered once all uploaded files are processed by Busboy.
    busboy.on("finish", async () => {
      res.status(200).json({ id: "not-used" });
    });

    busboy.end(req.body);
  } catch (error) {
    res.status(500).json({ error: "Parsing error" });
    console.log(error);
    return;
  }
});

// v2 function export with configuration
exports.decentUpload = onRequest(
  {
    region: "europe-west2",
    timeoutSeconds: 60,
    memory: "256MiB",
    invoker: "public",
  },
  app,
);
