import type { Meta, StoryObj } from "@storybook/react-vite";
import { ROAST_LEVELS } from "~/lib/beans";
import { RoastLevelMeter } from "./RoastLevelMeter";

const meta: Meta<typeof RoastLevelMeter> = {
  title: "Beans Profile/RoastLevelMeter",
  component: RoastLevelMeter,
  argTypes: { level: { control: { type: "range", min: 0, max: 4, step: 1 } } },
};
export default meta;
type Story = StoryObj<typeof RoastLevelMeter>;

export const Playground: Story = { args: { level: 2 } };

export const AllLevels: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      {ROAST_LEVELS.map((label, i) => (
        <div key={label}>
          <p className="mb-1 text-xs text-gray-500">
            {i} · {label}
          </p>
          <RoastLevelMeter level={i} />
        </div>
      ))}
    </div>
  ),
};
