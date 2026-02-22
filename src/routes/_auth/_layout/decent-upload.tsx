import { ArrowUpTrayIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import clsx from "clsx";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { Heading } from "~/components/Heading";
import { Link } from "~/components/Link";
import { notification } from "~/components/Notification";
import { Spinner } from "~/components/Spinner";
import { getUser } from "~/db/queries";

export const Route = createFileRoute("/_auth/_layout/decent-upload")({
  component: DecentUpload,
});

function DecentUpload() {
  const navigate = useNavigate();

  const { data: dbUser } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const secretKey = dbUser?.secretKey;

  const [isFileUploading, setIsFileUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    // Use relative URL - works in both local dev and production
    const url = "/api/decent-shots";

    if (!secretKey) {
      throw new Error("secret key not set");
    }

    try {
      // Upload files sequentially since API processes one file at a time
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file); // API expects key "file", not "file0", "file1", etc.

        await axios.post(url, formData, {
          auth: {
            username: dbUser.fbId ?? "", // API expects Firebase UID, not email
            password: secretKey,
          },
        });
      }

      navigate({ to: "/drinks/espresso" });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsFileUploading(false);
    }
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
            It looks like you haven't uploaded any shot files yet. For security reasons, we require
            you to generate a secret token (the same used used by auto-upload feature). Click the
            button below or head over to{" "}
            <Link asChild>
              <RouterLink to="/settings">your Account page</RouterLink>
            </Link>{" "}
            to create your token.
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              console.log("not yet, dawg");
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
                isFileUploading && "after:content after:absolute after:inset-0 after:bg-gray-50/50",
              ])}
              {...getRootProps()}
            >
              <div className="text-center">
                <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-300" aria-hidden="true" />
                <div className="flex justify-center mt-4 text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className={clsx([
                      "relative font-semibold text-orange-600 rounded-md cursor-pointer focus-within:outline-hidden focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2",
                      !isFileUploading && "group-hover:text-orange-500 group-hover:underline",
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
