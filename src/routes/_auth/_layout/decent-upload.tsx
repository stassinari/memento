import { navLinks } from "@/components/BottomNav";
import { BreadcrumbsWithHome } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Link } from "@/components/Link";
import { notification } from "@/components/Notification";
import { Spinner } from "@/components/Spinner";
import { db } from "@/firebaseConfig";
import { useFirestoreDocRealtime } from "@/hooks/firestore/useFirestoreDocRealtime";
import { useCurrentUser } from "@/hooks/useInitUser";
import { User } from "@/types/user";
import {
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Link as RouterLink,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import axios from "axios";
import clsx from "clsx";
import { DocumentReference, doc } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

export const Route = createFileRoute("/_auth/_layout/decent-upload")({
  component: DecentUpload,
});

function DecentUpload() {
  const user = useCurrentUser();
  const userRef = useMemo(
    () => doc(db, "users", user?.uid || "") as DocumentReference<User>,
    [user?.uid],
  );

  const navigate = useNavigate();

  const { details: dbUser, isLoading } = useFirestoreDocRealtime<User>(userRef);
  const secretKey = dbUser?.secretKey ? dbUser.secretKey : null;

  const userEmail = user?.email ? user.email : "";

  const [isFileUploading, setIsFileUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    const url =
      location.hostname === "localhost"
        ? "http://127.0.0.1:5001/brewlog-dev/europe-west2/decentUpload"
        : import.meta.env.VITE_DECENT_UPLOAD_ENDPOINT;
    if (!url) {
      throw new Error("decent upload endpoint not set");
    }
    if (!secretKey) {
      throw new Error("secret key not set");
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
      .then(() => navigate({ to: "/drinks/espresso" }))
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
          Icon: <ExclamationCircleIcon className="text-red-400" />,
        });
        return;
      }

      setIsFileUploading(true);
      await handleUpload(acceptedFiles);
    },
  });

  if (isLoading) return null;

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.decentUpload]} />

      <Heading>Decent Upload</Heading>

      <p className="mt-4">Manually upload your Decent Espresso shot files.</p>
      <p>
        If you'd like to enable automatic uploads,{" "}
        <Link
          target="_blank"
          rel="noreferrer noopener"
          href="https://github.com/stassinari/memento#decent-espresso-integration"
        >
          follow the guide here
        </Link>
        .
      </p>
      {!secretKey && (
        <>
          <div>
            It looks like you haven't uploaded any shot files yet. For security
            reasons, we require you to generate a secret token (the same used
            used by auto-upload feature). Click the button below or head over to{" "}
            <Link asChild>
              <RouterLink to="/settings">your Account page</RouterLink>
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
        </>
      )}

      {secretKey && (
        <div className="mt-8">
          <div className="relative">
            <div
              className={clsx([
                "group flex justify-center px-6 py-10 mt-2 border border-dashed rounded-lg bg-white border-gray-900/25 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600/75 focus-visible:outline-hidden",
                isFileUploading &&
                  "after:content after:absolute after:inset-0 after:bg-gray-50/50",
              ])}
              {...getRootProps()}
            >
              <div className="text-center">
                <ArrowUpTrayIcon
                  className="w-12 h-12 mx-auto text-gray-300"
                  aria-hidden="true"
                />
                <div className="flex justify-center mt-4 text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className={clsx([
                      "relative font-semibold text-orange-600 rounded-md cursor-pointer focus-within:outline-hidden focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2",
                      !isFileUploading &&
                        "group-hover:text-orange-500 group-hover:underline",
                    ])}
                  >
                    <span>Upload a file</span>
                    <input {...getInputProps()} className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  SHOT or JSON files, maximum of 20 files
                </p>
              </div>
            </div>
            {isFileUploading && (
              <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
