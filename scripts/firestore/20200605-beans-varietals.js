const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKeyDEV.json");
const serviceAccount = require("./serviceAccountKeyPROD.json");
//initialize admin SDK using serciceAcountKey
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const guessArray = (varietal) => {
  // try to split it in a couple of ways
  let split;
  // 1. separated by ","
  split = varietal.split(",").map((el) => el.trim());
  if (split.length > 1) {
    // we assume we split it in a sensible way
    return split;
  }
  // 2. separated by " and "
  split = varietal.split(" and ").map((el) => el.trim());
  if (split.length > 1) {
    // we assume we split it in a sensible way
    return split;
  }
  return [varietal];
};

// add varietals
db.collection("beans")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      const varietal = doc.data().varietal;
      if (varietal && Array.isArray(varietal)) {
        console.log(`Leaving ${varietal} alone`);
        db.collection("beans").doc(doc.id).update({ varietals: varietal });
      } else {
        const varietalArray = guessArray(varietal);
        console.log(`changing ${varietal} to ${varietalArray}`);
        db.collection("beans").doc(doc.id).update({ varietals: varietalArray });
      }
    });
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });

// remove varietal
let FieldValue = admin.firestore.FieldValue;
db.collection("beans")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      // Create a document reference
      let varRef = db.collection("beans").doc(doc.id);
      // Remove the 'varietal' field from the document
      let removeCapital = varRef.update({
        varietal: FieldValue.delete(),
      });
    });
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });
