import type { Meta, StoryObj } from "@storybook/react-vite";
import { getBeanStatus } from "~/lib/beans";
import { BeansProfileHeader } from "./BeansProfileHeader";
import { archivedBean, blendBean, frozenBean, openBean } from "./stories-fixtures";
import { withRouter } from "./stories-decorators";

const meta: Meta<typeof BeansProfileHeader> = {
  title: "Beans Profile/BeansProfileHeader",
  component: BeansProfileHeader,
  decorators: [withRouter],
  args: {
    beansId: "bean-1",
    onFreeze: () => {},
    onThaw: () => {},
    onArchive: () => {},
    onUnarchive: () => {},
    onDelete: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof BeansProfileHeader>;

export const MobileOpen: Story = {
  args: { bean: openBean, status: getBeanStatus(openBean), isDesktop: false },
};
export const MobileBlend: Story = {
  args: { bean: blendBean, status: getBeanStatus(blendBean), isDesktop: false },
};
export const DesktopFrozen: Story = {
  args: { bean: frozenBean, status: getBeanStatus(frozenBean), isDesktop: true },
};
export const DesktopArchived: Story = {
  args: { bean: archivedBean, status: getBeanStatus(archivedBean), isDesktop: true },
};
