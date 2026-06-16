import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArchiveZone } from "./ArchiveZone";

const meta: Meta<typeof ArchiveZone> = {
  title: "Beans Profile/ArchiveZone",
  component: ArchiveZone,
  args: { onArchive: () => {}, onUnarchive: () => {} },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
};
export default meta;
type Story = StoryObj<typeof ArchiveZone>;

export const NotArchived: Story = { args: { isArchived: false } };
export const Archived: Story = { args: { isArchived: true } };
