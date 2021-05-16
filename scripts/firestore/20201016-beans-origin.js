const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKeyDEV.json");
const serviceAccount = require("./serviceAccountKeyPROD.json");
//initialize admin SDK using serciceAcountKey
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// use "single-origin" if it's empty
db.collection("beans")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      const origin = doc.data().origin;
      if (origin) {
        console.log(`${doc.id} - leaving to ${origin}`);
      } else {
        console.log(`${doc.id} - setting origin to 'single-origin'`);
        // db.collection("beans").doc(doc.id).update({ origin: "single-origin" });
      }
    });
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });

