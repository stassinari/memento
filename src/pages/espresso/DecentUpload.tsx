import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { DocumentReference, doc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import tw from "twin.macro";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { db } from "../../firebaseConfig";
import { useFirestoreDocOneTime } from "../../hooks/firestore/useFirestoreDocOneTime";
import { useCurrentUser } from "../../hooks/useInitUser";
import { User } from "../../types/user";

export const DecentUpload = () => {
  const user = useCurrentUser();
  const userRef = useMemo(
    () => doc(db, "users", user?.uid || "") as DocumentReference<User>,
    [user?.uid]
  );

  const navigate = useNavigate();

  const { details: dbUser, isLoading } = useFirestoreDocOneTime<User>(userRef);
  const secretKey = dbUser?.secretKey ? dbUser.secretKey : "";

  const userEmail = user?.email ? user.email : "";

  const [isFileUploading, setIsFileUploading] = useState(true);

  const handleUpload = async (files: File[]) => {
    const url = import.meta.env.VITE_DECENT_UPLOAD_ENDPOINT;
    if (!url) {
      throw new Error("decent upload endpoint not set");
    }
    console.log({ secretKey, files });

    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append(`file${i}`, file);
    });

    console.log({ formData });

    axios
      .post(url, formData, {
        auth: {
          username: userEmail,
          password: secretKey,
        },
      })
      .then(() => navigate("drinks/espresso"))
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => setIsFileUploading(false));
  };

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    maxFiles: 20,
    disabled: true,
    // accept: { "application/json": [".json"], "": [".shot"] },
    validator: (file) => {
      const isJson = file.type === "application/json";
      const isShot = file.type === "";
      console.log({ file, isJson, isShot });
      if (!isJson && !isShot) {
        return {
          code: "file-invalid-type",
          message: "Only JSON and shot files are allowed",
        };
      }
      return null;
    },
    onDrop: async (acceptedFiles) => {
      // original onDrop
      //     setIsFileUploading(true);
      //     await handleUpload(acceptedFiles);
      setIsFileUploading(true);
      await handleUpload(acceptedFiles);
    },
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  if (isLoading) return null;

  return (
    <div>
      <div>
        {/* {isFileUploading && (
            <CircularProgress size={48} tw={classes.progressIndicator} />
          )} */}
        <div>
          <p>Manually upload your Decent Espresso shot files.</p>
          <p>
            If you'd like to enable automatic uploads,{" "}
            <Link
              target="_blank"
              rel="noreferrer noopener"
              // FIXME allow external links
              //   href="https://github.com/stassinari/memento#decent-espresso-integration"
              to="https://github.com/stassinari/memento#decent-espresso-integration"
            >
              follow the guide here
            </Link>
            .
          </p>
          {!secretKey && (
            <React.Fragment>
              <div>
                It looks like you haven't uploaded any shot files yet. For
                security reasons, we require you to generate a secret token (the
                same used used by auto-upload feature). Click the button below
                or head over to <Link to="/account">your Account page</Link> to
                create your token.
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  console.log("not yet, dawg");

                  //   generateSecretKey(firestore, userId);
                }}
              >
                Generate secret key (TBD)
              </Button>
            </React.Fragment>
          )}
          {!!secretKey && (
            <div tw="mt-8">
              <div tw="flex items-center justify-center w-full">
                <div
                  {...getRootProps({ tw: "dropzone" })}
                  className="group"
                  css={[
                    tw`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50`,
                    // tw`dark:(border-gray-600 bg-gray-700 hover:(bg-gray-800 border-gray-500))`,
                    isFileUploading
                      ? tw`cursor-not-allowed`
                      : tw`hover:bg-gray-100`,
                  ]}
                >
                  <div tw="flex flex-col items-center justify-center pt-5 pb-6">
                    <span tw="w-6 h-6 mb-4 text-gray-500">
                      <ArrowUpTrayIcon />
                    </span>
                    <p
                      css={[
                        tw`mb-2 text-sm text-gray-500`,
                        // tw`dark:text-gray-400`,
                      ]}
                    >
                      <span tw="font-semibold group-hover:underline">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p
                      css={[
                        tw`text-xs text-gray-500`,
                        // tw`dark:text-gray-400`
                      ]}
                    >
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input {...getInputProps()} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
