import type { Meta, StoryObj } from "@storybook/react-vite";
import { getActivitySummary, getFreshness } from "~/lib/beans";
import { BeanStatsGrid } from "./BeanStatsGrid";
import { frozenBean, makeBeanWithDrinks, noRoastDateBean, openBean } from "./stories-fixtures";

const meta: Meta<typeof BeanStatsGrid> = {
  title: "Beans Profile/BeanStatsGrid",
  component: BeanStatsGrid,
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};
export default meta;
type Story = StoryObj<typeof BeanStatsGrid>;

const withDrinks = makeBeanWithDrinks();
const noDrinks = makeBeanWithDrinks({}, { brews: [], espressos: [], sampledInTastings: [] });
const unrated = makeBeanWithDrinks(
  {},
  { brews: [{ rating: null } as never], espressos: [], sampledInTastings: [] },
);

export const Full: Story = {
  args: { freshness: getFreshness(openBean), activity: getActivitySummary(withDrinks) },
};
export const FrozenPaused: Story = {
  args: { freshness: getFreshness(frozenBean), activity: getActivitySummary(withDrinks) },
};
export const NoRoastNoDrinks: Story = {
  args: { freshness: getFreshness(noRoastDateBean), activity: getActivitySummary(noDrinks) },
};
export const Unrated: Story = {
  args: { freshness: getFreshness(openBean), activity: getActivitySummary(unrated) },
};
