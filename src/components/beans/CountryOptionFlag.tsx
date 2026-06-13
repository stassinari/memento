import countries from "~/data/countries";

interface CountryOptionFlagProps {
  country: string;
  className?: string;
}

export const CountryOptionFlag = ({ country, className }: CountryOptionFlagProps) => {
  const countryCode = countries.find((c) => c.name === country)?.code;

  return <img src={`/images/flags/${countryCode}.svg`} alt={country} className={className} />;
};
