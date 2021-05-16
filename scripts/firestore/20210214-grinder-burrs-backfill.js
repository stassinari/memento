const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKeyDEV.json");
// const serviceAccount = require("./serviceAccountKeyPROD.json");
//initialize admin SDK using serciceAcountKey
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const myUserId = "G18pGClOnHR1HUe3pEXCgrHrdVv2"; // DEV
// const myUserId = "G18pGClOnHR1HUe3pEXCgrHrdVv2" // PRD

const backfillBurrs = (collection) => (doc) => {
  const grinder = doc.data().grinder;
  switch (grinder) {
    case "Mahlkönig Vario":
      db.collection("users")
        .doc(myUserId)
        .collection(collection)
        .doc(doc.id)
        .update({ grinderBurrs: "Stock 54mm flat ceramic" });
      break;
    case "Niche Zero":
      db.collection("users")
        .doc(myUserId)
        .collection(collection)
        .doc(doc.id)
        .update({ grinderBurrs: "Stock 63mm conical steel" });
      break;

    default:
      break;
  }
};

db.collection("users")
  .doc(myUserId)
  .collection("brews")
  .get()
  .then((snapshot) => {
    console.log(snapshot.size);
    snapshot.forEach(backfillBurrs("brews"));
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });

db.collection("users")
  .doc(myUserId)
  .collection("espresso")
  .get()
  .then((snapshot) => {
    console.log(snapshot.size);
    snapshot.forEach(backfillBurrs("espresso"));
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });
