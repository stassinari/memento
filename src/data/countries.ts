// Coffee-origin regions for grouping the country facet (African and South
// American coffees taste worlds apart). Each country carries its region, so
// grouping is a simple lookup rather than a separate mapping.
export type CoffeeRegion =
  | "Africa & Arabia"
  | "South America"
  | "Central America & Caribbean"
  | "Asia & Pacific";

// Display order for grouped country lists.
export const COFFEE_REGION_ORDER: CoffeeRegion[] = [
  "Africa & Arabia",
  "South America",
  "Central America & Caribbean",
  "Asia & Pacific",
];

export interface Country {
  name: string;
  code: string;
  region: CoffeeRegion;
}

const countries: Country[] = [
  { name: "Angola", code: "AO", region: "Africa & Arabia" },
  { name: "Bolivia", code: "BO", region: "South America" },
  { name: "Brazil", code: "BR", region: "South America" },
  { name: "Burundi", code: "BI", region: "Africa & Arabia" },
  { name: "Cameroon", code: "CM", region: "Africa & Arabia" },
  { name: "Central African Republic", code: "CF", region: "Africa & Arabia" },
  { name: "China", code: "CN", region: "Asia & Pacific" },
  { name: "Colombia", code: "CO", region: "South America" },
  { name: "Costa Rica", code: "CR", region: "Central America & Caribbean" },
  { name: "Cuba", code: "CU", region: "Central America & Caribbean" },
  { name: "Côte d'Ivoire", code: "CI", region: "Africa & Arabia" },
  { name: "Democratic Republic of the Congo", code: "CD", region: "Africa & Arabia" },
  { name: "Dominican Republic", code: "DO", region: "Central America & Caribbean" },
  { name: "Ecuador", code: "EC", region: "South America" },
  { name: "El Salvador", code: "SV", region: "Central America & Caribbean" },
  { name: "Ethiopia", code: "ET", region: "Africa & Arabia" },
  { name: "Gabon", code: "GA", region: "Africa & Arabia" },
  { name: "Ghana", code: "GH", region: "Africa & Arabia" },
  { name: "Guatemala", code: "GT", region: "Central America & Caribbean" },
  { name: "Guinea", code: "GN", region: "Africa & Arabia" },
  { name: "Haiti", code: "HT", region: "Central America & Caribbean" },
  { name: "Honduras", code: "HN", region: "Central America & Caribbean" },
  { name: "India", code: "IN", region: "Asia & Pacific" },
  { name: "Indonesia", code: "ID", region: "Asia & Pacific" },
  { name: "Jamaica", code: "JM", region: "Central America & Caribbean" },
  { name: "Kenya", code: "KE", region: "Africa & Arabia" },
  { name: "Laos", code: "LA", region: "Asia & Pacific" },
  { name: "Liberia", code: "LR", region: "Africa & Arabia" },
  { name: "Madagascar", code: "MG", region: "Africa & Arabia" },
  { name: "Malawi", code: "MW", region: "Africa & Arabia" },
  { name: "Mexico", code: "MX", region: "Central America & Caribbean" },
  { name: "Myanmar", code: "MM", region: "Asia & Pacific" },
  { name: "Nicaragua", code: "NI", region: "Central America & Caribbean" },
  { name: "Nigeria", code: "NG", region: "Africa & Arabia" },
  { name: "Panama", code: "PA", region: "Central America & Caribbean" },
  { name: "Papua New Guinea", code: "PG", region: "Asia & Pacific" },
  { name: "Paraguay", code: "PY", region: "South America" },
  { name: "Peru", code: "PE", region: "South America" },
  { name: "Philippines", code: "PH", region: "Asia & Pacific" },
  { name: "Rwanda", code: "RW", region: "Africa & Arabia" },
  { name: "Sierra Leone", code: "SL", region: "Africa & Arabia" },
  { name: "Thailand", code: "TH", region: "Asia & Pacific" },
  { name: "Timor-Leste", code: "TL", region: "Asia & Pacific" },
  { name: "Togo", code: "TG", region: "Africa & Arabia" },
  { name: "Trinidad and Tobago", code: "TT", region: "Central America & Caribbean" },
  { name: "Uganda", code: "UG", region: "Africa & Arabia" },
  { name: "United Republic of Tanzania", code: "TZ", region: "Africa & Arabia" },
  { name: "Venezuela", code: "VE", region: "South America" },
  { name: "Vietnam", code: "VN", region: "Asia & Pacific" },
  { name: "Yemen", code: "YE", region: "Africa & Arabia" },
  { name: "Zambia", code: "ZM", region: "Africa & Arabia" },
  { name: "Zimbabwe", code: "ZW", region: "Africa & Arabia" },
];

/** Coffee region for a country name; unknown names fall into "Other". */
export const getCoffeeRegion = (name: string): CoffeeRegion | "Other" =>
  countries.find((c) => c.name === name)?.region ?? "Other";

export default countries;
