import {
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { DocumentReference, doc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import tw from "twin.macro";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { notification } from "../../components/Notification";
import { Spinner } from "../../components/Spinner";
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

  const [isFileUploading, setIsFileUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    const url = import.meta.env.VITE_DECENT_UPLOAD_ENDPOINT;
    if (!url) {
      throw new Error("decent upload endpoint not set");
    }

    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append(`file${i}`, file);
    });

    axios
      .post(url, formData, {
        auth: {
          username: userEmail,
          password: secretKey,
        },
      })
      .then(() => navigate("/drinks/espresso"))
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => setIsFileUploading(false));
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 20,
    disabled: isFileUploading,
    validator: (file) => {
      const isJson = file.type === "application/json";
      const isShot = file.type === "" && file.name.endsWith(".shot");
      if (!isJson && !isShot) {
        return {
          code: "file-invalid-type",
          message: "Only JSON and shot files are allowed",
        };
      }
      return null;
    },
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        notification({
          title: "Upload error",
          subtitle: "One or more files are invalid",
          Icon: <ExclamationCircleIcon tw="text-red-400" />,
        });
        return;
      }

      setIsFileUploading(true);
      await handleUpload(acceptedFiles);
    },
  });

  if (isLoading) return null;

  return (
    <div>
      <p>Manually upload your Decent Espresso shot files.</p>
      <p>
        If you'd like to enable automatic uploads,{" "}
        <Link
          target="_blank"
          rel="noreferrer noopener"
          // FIXME allow external links
          //   href="https://github.com/stassinari/memento#decent-espresso-integration"
          href="https://github.com/stassinari/memento#decent-espresso-integration"
        >
          follow the guide here
        </Link>
        .
      </p>
      {!secretKey && (
        <React.Fragment>
          <div>
            It looks like you haven't uploaded any shot files yet. For security
            reasons, we require you to generate a secret token (the same used
            used by auto-upload feature). Click the button below or head over to{" "}
            <Link as={RouterLink} to="/account">
              your Account page
            </Link>{" "}
            to create your token.
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

      {secretKey && (
        <div tw="mt-8">
          <div tw="relative">
            <div
              css={[
                tw`flex justify-center px-6 py-10 mt-2 border border-dashed rounded-lg border-gray-900/25 focus-visible:(ring-2 ring-offset-2 ring-orange-600/75 outline-none)`,
                isFileUploading &&
                  tw`after:(content absolute inset-0 bg-gray-50/50)`,
              ]}
              className="group"
              {...getRootProps()}
            >
              <div tw="text-center">
                <ArrowUpTrayIcon
                  tw="w-12 h-12 mx-auto text-gray-300"
                  aria-hidden="true"
                />
                <div tw="flex justify-center mt-4 text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    css={[
                      tw`relative font-semibold text-orange-600 rounded-md cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2`,
                      !isFileUploading &&
                        tw`group-hover:(text-orange-500 underline)`,
                    ]}
                  >
                    <span>Upload a file</span>
                    <input {...getInputProps()} tw="sr-only" />
                  </label>
                  <p tw="pl-1">or drag and drop</p>
                </div>
                <p tw="text-xs leading-5 text-gray-600">
                  SHOT or JSON files, maximum of 20 files
                </p>
              </div>
            </div>
            {isFileUploading && (
              <div tw="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
