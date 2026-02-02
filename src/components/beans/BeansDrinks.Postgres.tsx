import { DrinksList } from "../drinks/DrinksList.Postgres";

interface BeansDrinksProps {
  drinks: any[]; // Will be properly typed later
}

export const BeansDrinks = ({ drinks }: BeansDrinksProps) => {
  console.log("BeansDrinks (Postgres)");

  return <DrinksList drinks={drinks} />;
};
