import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // The Vite builder loads the app's vite.config.mts, which returns a minimal
  // Storybook-only config (Tailwind v4 + `~` alias) when process.env.STORYBOOK
  // is set — so no extra viteFinal wiring is needed here.
};

export default config;
