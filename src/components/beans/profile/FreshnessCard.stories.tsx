import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  archivedBean,
  archivedHistoryBean,
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
// Roasted → frozen → thawed → archived: the bar keeps its phase history, faded.
export const ArchivedHistory: Story = { args: { bean: archivedHistoryBean, showActions: false } };
export const NoRoastDate: Story = { args: { bean: noRoastDateBean } };

// Desktop: actions live in the toolbar, so the card shows no in-card buttons.
export const DesktopNoActions: Story = {
  args: { bean: frozenBean, showActions: false },
};
