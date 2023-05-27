import React from "react";
import "twin.macro";
import { Heading } from "../components/Heading";

export const Home: React.FC = () => (
  <>
    <Heading>Memento</Heading>

    <p tw="mt-4">Dis da homepage, brah.</p>
    <p>Nobody knows what's going to appear here.</p>
    <p>It's a secret 🤫</p>
  </>
);
