import countries from "@/data/countries";

interface CountryOptionFlagProps {
  country: string;
}

export const CountryOptionFlag = ({ country }: CountryOptionFlagProps) => {
  const countryCode = countries.find((c) => c.name === country)?.code;

  return <img src={`/images/flags/${countryCode}.svg`} />;
};
