const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKeyDEV.json");
const serviceAccount = require("./serviceAccountKeyPROD.json");
//initialize admin SDK using serciceAcountKey
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

let roastersList = new Set();

// use "single-origin" if it's empty
db.collection("beans")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      const beans = doc.data();
      const roastStyle = beans.roastStyle;
      if (roastStyle) {
        console.log(`${doc.id} - roast style already set (${roastStyle})`);
      } else {
        const roaster = beans.roaster;
        roastersList.add(roaster);

        let styleToFill;

        switch (roaster) {
          case "La Cabra":
          case "Gardelli":
            styleToFill = "omni-roast";
            break;
          case "Dark Arts":
          case "Colonna Rare":
          case "Colonna Discovery":
          case "Roastworks":
            styleToFill = "filter";
            break;

          default:
            break;
        }
        console.log(
          `${doc.id} - no roast style set. Roaster: ${roaster} will be backfilled with: ${styleToFill}`,
        );
        // db.collection("beans").doc(doc.id).update({ roastStyle: styleToFill });
      }
    });
    console.log(roastersList);
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });
