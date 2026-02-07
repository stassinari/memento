import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { Auth } from "firebase/auth";
import {
  DocumentReference,
  deleteField,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useMemo } from "react";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { FormSection } from "~/components/Form";
import { Heading } from "~/components/Heading";
import { Link } from "~/components/Link";
import { Toggle } from "~/components/Toggle";
import { deleteSecretKey, generateSecretKey } from "~/db/mutations";
import { auth, db } from "~/firebaseConfig";
import { useFirestoreDocRealtime } from "~/hooks/firestore/useFirestoreDocRealtime";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { useCurrentUser } from "~/hooks/useInitUser";
import { User } from "~/types/user";
import { generateRandomString } from "~/utils";

export const Route = createFileRoute("/_auth/_layout/settings")({
  component: Settings,
});

const signOut = async (auth: Auth) => {
  await auth.signOut();
  console.log("signed out");
};

function Settings() {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const writeToPostgres = useFeatureFlag("write_to_postgres");
  const writeToFirestore = useFeatureFlag("write_to_firestore");

  const userRef = useMemo(
    () => doc(db, "users", user.uid) as DocumentReference<User>,
    [user?.uid],
  );

  const { details: dbUser, isLoading } = useFirestoreDocRealtime<User>(userRef);
  const secretKey = dbUser?.secretKey ? dbUser.secretKey : null;

  // Mutation for generating secret key
  const generateMutation = useMutation({
    mutationFn: async () => {
      const newSecretKey = generateRandomString();

      // Conditionally write to PostgreSQL
      if (writeToPostgres) {
        try {
          await generateSecretKey({
            data: { firebaseUid: user.uid, secretKey: newSecretKey },
          });
          console.log("Secret key written to PostgreSQL");
        } catch (error) {
          console.error("Failed to write secret key to PostgreSQL:", error);
        }
      }

      // Conditionally write to Firestore
      if (writeToFirestore) {
        try {
          await setDoc(userRef, { secretKey: newSecretKey });
          console.log("Secret key written to Firestore");
        } catch (error) {
          console.error("Failed to write secret key to Firestore:", error);
        }
      }

      return newSecretKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Mutation for deleting secret key
  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Conditionally delete from PostgreSQL
      if (writeToPostgres) {
        try {
          await deleteSecretKey({
            data: { firebaseUid: user.uid },
          });
          console.log("Secret key deleted from PostgreSQL");
        } catch (error) {
          console.error("Failed to delete secret key from PostgreSQL:", error);
        }
      }

      // Conditionally delete from Firestore
      if (writeToFirestore) {
        try {
          await updateDoc(userRef, { secretKey: deleteField() });
          console.log("Secret key deleted from Firestore");
        } catch (error) {
          console.error("Failed to delete secret key from Firestore:", error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  if (isLoading) return null;
  console.log({ user, dbUser, isLoading, secretKey });

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.settings]} />

      <Heading>Settings</Heading>

      <div className="mt-4 space-y-6">
        <FormSection title="Decent setup">
          <div className="flex items-center justify-between">
            <span className="font-medium">Enable Decent integration</span>
            <Toggle
              checked={!!secretKey}
              disabled={generateMutation.isPending || deleteMutation.isPending}
              onChange={() =>
                secretKey ? deleteMutation.mutate() : generateMutation.mutate()
              }
            />
          </div>
          {secretKey ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  Secret key:{" "}
                  <strong className="font-semibold">{secretKey}</strong>
                </p>
                <Button
                  variant="white"
                  size="xs"
                  onClick={async () =>
                    await navigator.clipboard.writeText(secretKey)
                  }
                >
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                You can{" "}
                <Link asChild>
                  <RouterLink to="/decent-upload">
                    upload shots from here
                  </RouterLink>
                </Link>
                , or follow{" "}
                <Link
                  href="https://github.com/stassinari/memento#decent-espresso-integration"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  this guide
                </Link>{" "}
                to enable automatic uploads from you machine
              </p>
            </>
          ) : (
            <p className="mt-2 mb-4 text-sm text-gray-600">
              If you have a Decent Espresso machine, and would like to enable
              uploading shots from it, start by enabling the integration here.
            </p>
          )}
        </FormSection>
        <FormSection title="Account">
          <p className="text-sm">
            Email: <strong className="font-semibold">{user.email}</strong>
          </p>
          <Button variant="white" onClick={async () => await signOut(auth)}>
            Sign out
          </Button>
        </FormSection>
        <Button variant="white" className="sm:hidden" asChild>
          <RouterLink to="/design-library">Design Library</RouterLink>
        </Button>
      </div>
    </>
  );
}
