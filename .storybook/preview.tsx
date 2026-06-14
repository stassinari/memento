import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
// Load the variable fonts the theme names (the app does this in __root.tsx);
// without them config.css's --font-* vars fall back to system fonts.
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/montserrat/index.css";
import "../src/styles/config.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: { disable: true }, // page bg comes from the theme decorator below
  },
  decorators: [
    // Toggle the `.dark` class (matches the app's `@custom-variant dark`).
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    // Give every story the app's page background + comfortable padding.
    (Story) => (
      <div className="min-h-24 bg-gray-50 p-6 dark:bg-gray-950">
        <Story />
      </div>
    ),
  ],
};

export default preview;
