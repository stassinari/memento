import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link as RouterLink, createFileRoute } from "@tanstack/react-router";
import { Auth } from "firebase/auth";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Button } from "~/components/Button";
import { FormSection } from "~/components/Form";
import { Heading } from "~/components/Heading";
import { Link } from "~/components/Link";
import { Toggle } from "~/components/Toggle";
import { deleteSecretKey, generateSecretKey } from "~/db/mutations";
import { getUser } from "~/db/queries";
import { auth } from "~/firebaseConfig";
import { useCurrentUser, userAtom } from "~/hooks/useInitUser";
import { generateRandomString } from "~/utils";
import { useSetAtom } from "jotai";

export const Route = createFileRoute("/_auth/_layout/settings")({
  component: Settings,
});

const signOut = async (auth: Auth) => {
  await auth.signOut();
  console.log("signed out");
};

function Settings() {
  const user = useCurrentUser();

  const setUser = useSetAtom(userAtom);
  const queryClient = useQueryClient();
  const { data: dbUser } = useSuspenseQuery({
    queryKey: ["user", user?.uid],
    queryFn: () => getUser({ data: user?.uid ?? "" }),
  });

  const secretKey = dbUser?.secretKey;

  // Mutation for generating secret key
  const generateMutation = useMutation({
    mutationFn: async () => {
      const newSecretKey = generateRandomString();

      try {
        await generateSecretKey({
          data: { userId: user.dbId ?? "", secretKey: newSecretKey },
        });
        console.log("Secret key written to PostgreSQL");
      } catch (error) {
        console.error("Failed to write secret key to PostgreSQL:", error);
      }

      return newSecretKey;
    },
    onSuccess: (newSecretKey) => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
      setUser((prev) => (prev ? { ...prev, secretKey: newSecretKey } : prev));
    },
  });

  // Mutation for deleting secret key
  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        await deleteSecretKey({
          data: { userId: user.dbId ?? "" },
        });
        console.log("Secret key deleted from PostgreSQL");
      } catch (error) {
        console.error("Failed to delete secret key from PostgreSQL:", error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
      setUser((prev) => (prev ? { ...prev, secretKey: null } : prev));
    },
  });

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
                  User ID:{" "}
                  <strong className="font-mono font-semibold">
                    {user.uid}
                  </strong>
                </p>
                <Button
                  variant="white"
                  size="xs"
                  onClick={async () =>
                    await navigator.clipboard.writeText(user.uid)
                  }
                >
                  Copy
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  Secret key:{" "}
                  <strong className="font-mono font-semibold">
                    {secretKey}
                  </strong>
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
                to enable automatic uploads from your machine.{" "}
                <strong>
                  Use your User ID (not email) when configuring your Decent
                  machine.
                </strong>
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
