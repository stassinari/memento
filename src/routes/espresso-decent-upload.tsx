import React from "react";
import Layout from "../components/layout";
import { DropzoneArea } from "material-ui-dropzone";
import {
  Button,
  Link,
  makeStyles,
  Paper,
  Typography,
  Link as MuiLink,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import axios from "axios";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import { Alert } from "@material-ui/lab";
import { generateSecretKey } from "../database/queries";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  dropzone: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
  button: {
    display: "block",
    marginTop: theme.spacing(2),
    marginLeft: "auto",
    marginRight: "auto",
  },
  alert: {
    marginTop: theme.spacing(2),
  },
}));

interface UploadForm {
  files: File[];
}

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

  const handleUpload = async (values: UploadForm) => {
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
  };

  return (
    <Layout title="Upload Decent shots">
      <Paper className={classes.paper}>
        <Typography variant="body2" gutterBottom>
          Manually upload your Decent Espresso .shot files.
        </Typography>
        <Typography variant="body2" gutterBottom>
          If you'd like to enable automatic uploads,{" "}
          <Link
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/stassinari/memento#decent-espresso-integration"
          >
            follow the guide here
          </Link>
          .
        </Typography>

        {isUserAnonymous && (
          <Alert severity="warning" className={classes.alert}>
            Uploading shot files is only available for registered users. Head
            over to{" "}
            <MuiLink to="/account" component={RouterLink}>
              the Account page
            </MuiLink>{" "}
            to complete your registration.
          </Alert>
        )}

        {!secretKey && (
          <>
            <Alert severity="warning" className={classes.alert}>
              It looks like you haven't uploaded any shot files yet. For
              security reasons, we require you to generate a secret token (the
              same used used by auto-upload feature). Click the button below or
              head over to{" "}
              <MuiLink to="/account" component={RouterLink}>
                your Account page
              </MuiLink>{" "}
              to create your token.
            </Alert>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={() => generateSecretKey(firestore, userId)}
            >
              Generate secret key
            </Button>
          </>
        )}

        {!isUserAnonymous && !!secretKey && (
          <Formik initialValues={{ files: [] }} onSubmit={handleUpload}>
            {(formik) => (
              <>
                <Form>
                  <DropzoneArea
                    onDrop={(acceptedFiles) => {
                      formik.setFieldValue("files", acceptedFiles);
                    }}
                    dropzoneText="Drag and drop your shot files"
                    dropzoneClass={classes.dropzone}
                    filesLimit={20}
                    showAlerts={["error"]}
                    showPreviews={true}
                    showPreviewsInDropzone={false}
                    useChipsForPreview
                    previewGridProps={{
                      container: {
                        spacing: 1,
                        direction: "row",
                        justify: "center",
                      },
                    }}
                    previewChipProps={{
                      classes: { root: classes.previewChip },
                    }}
                    previewText=""
                  />
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Upload
                  </Button>
                </Form>
              </>
            )}
          </Formik>
        )}
      </Paper>
    </Layout>
  );
};

export default EspressoDecentUpload;
