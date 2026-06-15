import type { Meta, StoryObj } from "@storybook/react-vite";
import { makeBean } from "~/data/fixtures/beans";
import { RoastStyle } from "~/db/schema";
import { RoastCharacterCard } from "./RoastCharacterCard";

const meta: Meta<typeof RoastCharacterCard> = {
  title: "Beans Profile/RoastCharacterCard",
  component: RoastCharacterCard,
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
};
export default meta;
type Story = StoryObj<typeof RoastCharacterCard>;

export const Full: Story = { args: { bean: makeBean() } };

export const StyleOnly: Story = {
  args: {
    bean: makeBean({ roastStyle: RoastStyle.Espresso, roastLevel: null, roastingNotes: [] }),
  },
};

export const NoNotes: Story = {
  args: { bean: makeBean({ roastingNotes: [] }) },
};

// All three empty → the component renders nothing.
export const Omitted: Story = {
  args: { bean: makeBean({ roastStyle: null, roastLevel: null, roastingNotes: [] }) },
};
