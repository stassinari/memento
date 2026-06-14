import type { Meta, StoryObj } from "@storybook/react-vite";
import { FreshnessInfoDialog } from "./FreshnessInfoDialog";

const meta: Meta<typeof FreshnessInfoDialog> = {
  title: "Beans Profile/FreshnessInfoDialog",
  component: FreshnessInfoDialog,
  args: { open: true, onClose: () => {} },
};
export default meta;
type Story = StoryObj<typeof FreshnessInfoDialog>;

export const Open: Story = {};
