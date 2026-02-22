const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKeyDEV.json");
// const serviceAccount = require("./serviceAccountKeyPROD.json");
//initialize admin SDK using serciceAcountKey
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const createUsersCollection = (collection) => {
  db.collection(collection)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        const uid = data.uid;
        delete data.uid;

        db.collection("users").doc(uid).collection(collection).doc(doc.id).set(data);
      });
    })
    .then(() => console.log(`Finished moving ${collection}`))
    .catch((err) => {
      console.log(`Error moving ${collection}`, err);
    });
};

createUsersCollection("brews");
createUsersCollection("beans");

const backUpExistingCollection = (collection) => {
  db.collection(collection)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();

        db.collection(`${collection}-backup`).doc(doc.id).set(data);
      });
    })
    .then(() => console.log(`Finished backing up ${collection}`))
    .catch((err) => {
      console.log(`Error backing up ${collection}`, err);
    });
};

backUpExistingCollection("brews");
backUpExistingCollection("beans");
