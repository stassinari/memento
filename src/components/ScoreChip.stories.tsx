import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScoreChip } from "./ScoreChip";

const meta: Meta<typeof ScoreChip> = {
  title: "Primitives/ScoreChip",
  component: ScoreChip,
  args: { children: "8.5" },
};
export default meta;
type Story = StoryObj<typeof ScoreChip>;

export const Default: Story = {};

export const Range: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ScoreChip>6</ScoreChip>
      <ScoreChip>7.5</ScoreChip>
      <ScoreChip>8.5</ScoreChip>
      <ScoreChip>10</ScoreChip>
    </div>
  ),
};
