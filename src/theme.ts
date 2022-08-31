import preval from "babel-plugin-preval/macro";
import { Config } from "tailwindcss/types/config";

export const tailwindConfig = preval`
  const resolveConfig = require('tailwindcss/resolveConfig');
  const tailwindConfig = require('../tailwind.config');
  module.exports = resolveConfig(tailwindConfig);
` as Config;
