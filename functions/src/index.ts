import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as Busboy from "busboy";
import { Stream } from "stream";

import {
  extractProfileName,
  extractDate,
  extractTimeSeries,
  extractTotalTime,
  parseShotFile,
  extractTotalWeight,
  extractTargetWeight,
  DecentReadings,
} from "./parse";

admin.initializeApp();

interface DbUser {
  secretKey?: string;
}

interface Espresso {
  machine: string;
  partial: boolean;
  fromDecent: boolean;
  profileName: string;
  date: Date;
  targetWeight: number;
  actualTime: number;
  actualWeight: number;
  uploadedAt: Date;
}

export const decentUpload = functions
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
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
      "ascii"
    );
    const [email, reqSecretKey] = credentials.split(":");

    let uid: string;
    try {
      const user = await admin.auth().getUserByEmail(email);
      uid = user.uid;
    } catch (error) {
      res.status(401).json({ error: "User not found - code: ADMIN" });
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

    // handle data from POST
    try {
      const busboy = new Busboy({ headers: req.headers });

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        file.on("data", async (data: Stream) => {
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
            .then((espressoList) => espressoList.size > 0);
          if (alreadyExists) {
            return;
          }
          // extract all the things
          const profileName = extractProfileName(lines);
          const targetWeight = extractTargetWeight(lines);
          const timeSeries: DecentReadings = extractTimeSeries(lines);
          const actualTime = extractTotalTime(timeSeries);
          const actualWeight = extractTotalWeight(lines);

          const espresso: Espresso = {
            machine: "Decent",
            partial: true,
            fromDecent: true,
            profileName,
            date,
            targetWeight,
            actualTime,
            actualWeight,
            uploadedAt: new Date(),
          };

          const docRef = await admin
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("espresso")
            .add(espresso);
          await docRef
            .collection("decentReadings")
            .doc("decentReadings")
            .set(timeSeries);
        });
        file.on("end", () => {
          // finished succesfully
        });
      });

      // Triggered once all uploaded files are processed by Busboy.
      busboy.on("finish", async () => {
        res.status(200).json({ id: "not-used" });
      });

      busboy.end(req.rawBody);
    } catch (error) {
      res.status(500).json({ error: "Parsing error" });
      return;
    }
  });
