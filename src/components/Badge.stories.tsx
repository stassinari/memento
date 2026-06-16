import type { Meta, StoryObj } from "@storybook/react-vite";
import { Snowflake } from "lucide-react";
import { Badge, BadgeTimesIcon } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  args: { label: "Badge", colour: "grey", size: "small" },
  argTypes: {
    colour: { control: "select", options: ["grey", "orange", "blue", "green"] },
    size: { control: "radio", options: ["small", "large"] },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

export const Colours: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge colour="grey" label="Grey" />
      <Badge colour="orange" label="Orange" />
      <Badge colour="blue" label="Blue" />
      <Badge colour="green" label="Green" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="small" colour="orange" label="Small" />
      <Badge size="large" colour="orange" label="Large" />
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge colour="blue" label="Frozen" leadingIcon={<Snowflake className="h-3 w-3" />} />
      <Badge
        colour="green"
        label="Open"
        leadingIcon={<span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
      />
    </div>
  ),
};

export const Removable: Story = {
  render: () => (
    <Badge
      colour="orange"
      label="SL28"
      icon={{ Element: <BadgeTimesIcon />, position: "right", onClick: () => {} }}
    />
  ),
};
