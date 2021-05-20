import React from "react";
import Layout from "../components/layout";
import { DropzoneArea } from "material-ui-dropzone";
import { makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";

const useStyles = makeStyles((theme) => ({
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
}));

const EspressoDecentUpload = () => {
  const classes = useStyles();

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

          fetch(url, {
            method: "POST",
            body: formData,
          })
            .then((lol) => console.log(lol))
            .catch((error) => console.log(error));
          console.log(formData);
        }}
      >
        {(formik) => (
          <>
            <Form>
              <DropzoneArea
                onDrop={(acceptedFiles) => {
                  console.log(acceptedFiles);
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
      Upload shots here:
    </Layout>
  );
};

export default EspressoDecentUpload;
