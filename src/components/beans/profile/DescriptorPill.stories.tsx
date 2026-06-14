import type { Meta, StoryObj } from "@storybook/react-vite";
import { BeanOrigin } from "~/db/schema";
import { DescriptorPill } from "./DescriptorPill";
import { makeBean } from "./stories-fixtures";

const meta: Meta<typeof DescriptorPill> = {
  title: "Beans Profile/DescriptorPill",
  component: DescriptorPill,
};
export default meta;
type Story = StoryObj<typeof DescriptorPill>;

export const Degradation: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <DescriptorPill bean={makeBean({ process: "Washed", country: "Kenya" })} />
      <DescriptorPill bean={makeBean({ process: null, country: "Kenya" })} />
      <DescriptorPill bean={makeBean({ process: "Washed", country: null })} />
      <DescriptorPill bean={makeBean({ process: null, country: null })} />
      <DescriptorPill
        bean={makeBean({
          origin: BeanOrigin.Blend,
          country: null,
          blendParts: [{ name: null, country: null, process: null, varietals: [], percentage: 50 }],
        })}
      />
    </div>
  ),
};
