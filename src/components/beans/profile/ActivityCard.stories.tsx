import type { Meta, StoryObj } from "@storybook/react-vite";
import { makeBeanWithDrinks, makeBrew } from "~/data/fixtures/beans";
import { withRouter } from "~/stories/decorators";
import { ActivityCard } from "./ActivityCard";

const meta: Meta<typeof ActivityCard> = {
  title: "Beans Profile/ActivityCard",
  component: ActivityCard,
  decorators: [withRouter, (Story) => <div className="max-w-md">{Story()}</div>],
};
export default meta;
type Story = StoryObj<typeof ActivityCard>;

export const Full: Story = { args: { bean: makeBeanWithDrinks() } };

export const ManyDrinksExpandable: Story = {
  args: {
    bean: makeBeanWithDrinks(
      {},
      {
        brews: Array.from({ length: 8 }, (_, i) =>
          makeBrew({ id: `brew-${i}`, method: `Brew method ${i + 1}`, rating: 8 + (i % 2) }),
        ),
        espressos: [],
      },
    ),
  },
};

export const NoneRated: Story = {
  args: {
    bean: makeBeanWithDrinks(
      {},
      {
        brews: [makeBrew({ id: "b1", rating: null }), makeBrew({ id: "b2", rating: null })],
        espressos: [],
        sampledInTastings: [],
      },
    ),
  },
};

export const Empty: Story = {
  args: {
    bean: makeBeanWithDrinks({}, { brews: [], espressos: [], sampledInTastings: [] }),
  },
};
