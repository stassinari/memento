import type { Meta, StoryObj } from "@storybook/react-vite";
import { archivedBean, frozenBean, openBean, thawedBean } from "~/data/fixtures/beans";
import { getFreshness } from "~/lib/beans";
import { FreshnessDurationBar } from "./FreshnessDurationBar";

const meta: Meta<typeof FreshnessDurationBar> = {
  title: "Beans Profile/FreshnessDurationBar",
  component: FreshnessDurationBar,
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};
export default meta;
type Story = StoryObj<typeof FreshnessDurationBar>;

export const Open: Story = { args: { freshness: getFreshness(openBean) } };
export const Frozen: Story = { args: { freshness: getFreshness(frozenBean) } };
export const Thawed: Story = { args: { freshness: getFreshness(thawedBean) } };
export const Archived: Story = { args: { freshness: getFreshness(archivedBean) } };
