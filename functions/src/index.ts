import * as Busboy from "busboy";
import * as cors from "cors";
import * as express from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { Stream } from "stream";
import { extractEspresso } from "./parse";

admin.initializeApp();

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

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
    //@ts-ignore
    const busboy = new Busboy({ headers: req.headers });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      file.on("data", async (data: Stream) => {
        console.log({ fieldname, filename, encoding, mimetype });

        try {
          if (mimetype === "application/octet-stream") {
            // old Tcl shot file
            // parse body, return espresso obj
            const { espresso, timeSeries } = await extractEspresso(
              data,
              admin,
              uid
            );

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
          } else if (mimetype === "application/json") {
            // new Json shot file
            const jsonShot = JSON.parse(data.toString());
          } else {
            res.status(415).json({ error: "unsupported file" });
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

exports.decentUpload = functions.region("europe-west2").https.onRequest(app);
