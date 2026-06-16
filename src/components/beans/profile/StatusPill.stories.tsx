import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusPill } from "./StatusPill";

const meta: Meta<typeof StatusPill> = {
  title: "Beans Profile/StatusPill",
  component: StatusPill,
};
export default meta;
type Story = StoryObj<typeof StatusPill>;

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusPill status="open" />
      <StatusPill status="frozen" />
      <StatusPill status="thawed" />
      <StatusPill status="archived" />
    </div>
  ),
};

export const Open: Story = { args: { status: "open" } };
export const Frozen: Story = { args: { status: "frozen" } };
export const Thawed: Story = { args: { status: "thawed" } };
export const Archived: Story = { args: { status: "archived" } };
