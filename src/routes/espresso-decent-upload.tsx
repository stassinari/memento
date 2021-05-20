import React from "react";
import Layout from "../components/layout";
import { DropzoneArea } from "material-ui-dropzone";
import { makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";

const useStyles = makeStyles((theme) => ({
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
}));

const EspressoDecentUpload = () => {
  const { data: userData } = useUser();
  const isUserAnonymous = userData && userData.isAnonymous;
  const userId = userData?.uid;
  const userEmail = userData?.email ? userData.email : "";

  const firestore = useFirestore();
  const userRef = firestore.collection("users").doc(userId);
  const { data: dbUser, status } = useFirestoreDocData<User>(userRef);
  const secretKey = dbUser?.secretKey ? dbUser.secretKey : "";

  const history = useHistory();
  const classes = useStyles();

  if (status === "loading") {
    return null;
  }

  return (
    <Layout title="Upload Decent shots">
      <Formik
        initialValues={{ files: [] }}
        onSubmit={async (values) => {
          const url =
            "https://europe-west2-brewlog-dev.cloudfunctions.net/decentUpload";
          let formData = new FormData();
          values.files.forEach((file, i) => {
            formData.append(`file${i}`, file);
          });

          axios
            .post(url, formData, {
              auth: {
                username: userEmail,
                password: secretKey,
              },
            })
            .then(() => history.push("/espresso"))
            .catch((error) => console.log(error));
        }}
      >
        {(formik) => (
          <>
            <Form>
              <DropzoneArea
                onDrop={(acceptedFiles) => {
                  formik.setFieldValue("files", acceptedFiles);
                }}
                dropzoneText="Drag and drop your shot files"
                filesLimit={20}
                showAlerts={["error"]}
                showPreviews={true}
                showPreviewsInDropzone={false}
                useChipsForPreview
                previewGridProps={{
                  container: { spacing: 1, direction: "row" },
                }}
                previewChipProps={{ classes: { root: classes.previewChip } }}
                previewText="Selected files"
              />
              <button type="submit">Submit</button>
            </Form>
          </>
        )}
      </Formik>
    </Layout>
  );
};

export default EspressoDecentUpload;
