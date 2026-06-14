import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  archivedBean,
  frozenBean,
  noRoastDateBean,
  openBean,
  thawedBean,
} from "./stories-fixtures";
import { FreshnessCard } from "./FreshnessCard";
import { withRouter } from "./stories-decorators";

const meta: Meta<typeof FreshnessCard> = {
  title: "Beans Profile/FreshnessCard",
  component: FreshnessCard,
  decorators: [withRouter, (Story) => <div className="max-w-sm">{Story()}</div>],
  args: {
    beansId: "bean-1",
    showActions: true,
    timelineExpanded: false,
    onFreeze: () => {},
    onThaw: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof FreshnessCard>;

export const Open: Story = { args: { bean: openBean } };
export const Frozen: Story = { args: { bean: frozenBean } };
export const Thawed: Story = { args: { bean: thawedBean } };
export const Archived: Story = { args: { bean: archivedBean } };
export const NoRoastDate: Story = { args: { bean: noRoastDateBean } };

export const DesktopExpanded: Story = {
  args: { bean: frozenBean, showActions: false, timelineExpanded: true },
};
