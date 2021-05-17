const admin = require("firebase-admin");
// const serviceAccount = require("../serviceAccountKeyDEV.json");
const serviceAccount = require("../serviceAccountKeyPROD.json");
//initialize admin SDK using serciceAcountKey
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const myUserId = "Bv15yRHyPXZf5FOWiinQaGRFIvU2"; // DEV
// const myUserId = "mTWDvviAHnUgSFH7TQIdGRqOlYn1"; // PRD

const changeMachineName = (doc) => {
  const machine = doc.data().machine;
  console.log(machine);
  if (machine === "Decent") {
    console.log("Changing!");
    db.collection("users")
      .doc(myUserId)
      .collection("espresso")
      .doc(doc.id)
      .update({ machine: "Decent DE1+ 1.3" });
  }
};

db.collection("users")
  .doc(myUserId)
  .collection("espresso")
  .get()
  .then((snapshot) => {
    console.log(snapshot.size);
    snapshot.forEach(changeMachineName);
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });
