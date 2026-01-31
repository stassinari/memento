import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "~/components/Heading";

export const Route = createFileRoute("/_auth/_layout/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Heading>Memento</Heading>

      <p className="mt-4">Dis da homepage, brah.</p>
      <p>Nobody knows what's going to appear here.</p>
      <p>It's a secret 🤫</p>
    </>
  );
}
