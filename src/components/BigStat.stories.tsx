import type { Meta, StoryObj } from "@storybook/react-vite";
import { BigStat } from "./BigStat";

const meta: Meta<typeof BigStat> = {
  title: "Primitives/BigStat",
  component: BigStat,
  args: { value: "7", subtitle: "effective days old" },
};
export default meta;
type Story = StoryObj<typeof BigStat>;

export const Default: Story = {};

export const Score: Story = {
  args: {
    value: "8.4",
    subtitle: "avg · 12 drinks",
    valueClassName: "text-orange-600 dark:text-orange-300",
  },
};

export const Muted: Story = {
  args: {
    value: "/",
    subtitle: "no drinks yet",
    valueClassName: "text-gray-300 dark:text-gray-600",
  },
};
