import preval from "babel-plugin-preval/macro";
import { Config } from "tailwindcss/types/config";

type CustomConfig = Config & {
  theme: {
    // WIP
    colors: { orange: Record<number, string>; gray: Record<number, string> };
  };
};

export const tailwindConfig = preval`
  const resolveConfig = require('tailwindcss/resolveConfig');
  const tailwindConfig = require('../tailwind.config');
  module.exports = resolveConfig(tailwindConfig);
` as CustomConfig;
