import type { Meta, StoryObj } from "@storybook/react-vite";
import { CompositionCard } from "./CompositionCard";
import { OriginCard } from "./OriginCard";
import { blendBean, makeBean } from "./stories-fixtures";

const meta: Meta = {
  title: "Beans Profile/Origin & Composition",
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
};
export default meta;
type Story = StoryObj;

export const OriginFull: Story = { render: () => <OriginCard bean={makeBean()} /> };

export const OriginSparse: Story = {
  render: () => (
    <OriginCard
      bean={makeBean({
        country: "Colombia",
        region: null,
        varietals: [],
        altitude: null,
        process: "Honey",
        farmer: null,
        harvestDate: null,
      })}
    />
  ),
};

export const Composition: Story = { render: () => <CompositionCard bean={blendBean} /> };
