import { Auth } from "firebase/auth";
import {
  DocumentReference,
  deleteField,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import "twin.macro";
import { navLinks } from "../components/BottomNav";
import { BreadcrumbsWithHome } from "../components/Breadcrumbs";
import { Button } from "../components/Button";
import { FormSection } from "../components/Form";
import { Heading } from "../components/Heading";
import { Link } from "../components/Link";
import { Toggle } from "../components/Toggle";
import { auth, db } from "../firebaseConfig";
import { useFirestoreDocRealtime } from "../hooks/firestore/useFirestoreDocRealtime";
import { useCurrentUser } from "../hooks/useInitUser";
import { User } from "../types/user";
import { generateRandomString } from "../utils";

const signOut = async (auth: Auth) => {
  await auth.signOut();
  console.log("signed out");
};

export const Settings: React.FC = () => {
  const user = useCurrentUser();
  const userRef = useMemo(
    () => doc(db, "users", user.uid) as DocumentReference<User>,
    [user?.uid]
  );

  const { details: dbUser, isLoading } = useFirestoreDocRealtime<User>(userRef);
  const secretKey = dbUser?.secretKey ? dbUser.secretKey : null;

  if (isLoading) return null;
  console.log({ user, dbUser, isLoading, secretKey });

  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.settings]} />

      <Heading>Settings</Heading>

      <div tw="mt-4 space-y-6">
        <FormSection title="Decent setup">
          <div tw="flex items-center justify-between">
            <span tw="font-medium">Enable Decent integration</span>
            <Toggle
              checked={!!secretKey}
              onChange={async () =>
                secretKey
                  ? await updateDoc(userRef, { secretKey: deleteField() })
                  : await setDoc(userRef, { secretKey: generateRandomString() })
              }
            />
          </div>
          {secretKey ? (
            <>
              <div tw="flex items-center justify-between">
                <p tw="text-sm">
                  Secret key: <strong tw="font-semibold">{secretKey}</strong>
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
              <p tw="text-sm text-gray-600">
                You can{" "}
                <Link as={RouterLink} to="/decent-upload">
                  upload shots from here
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
            <p tw="mt-2 mb-4 text-sm text-gray-600">
              If you have a Decent Espresso machine, and would like to enable
              uploading shots from it, start by enabling the integration here.
            </p>
          )}
        </FormSection>
        <FormSection title="Account">
          <p tw="text-sm">
            Email: <strong tw="font-semibold">{user.email}</strong>
          </p>
          <Button variant="white" onClick={async () => await signOut(auth)}>
            Sign out
          </Button>
        </FormSection>
        <Button
          variant="white"
          as={RouterLink}
          to="/design-library"
          tw="sm:hidden"
        >
          Design Library
        </Button>
      </div>
    </>
  );
};
