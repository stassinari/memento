import countries from "~/data/countries";

interface CountryOptionFlagProps {
  country: string;
  className?: string;
}

export const CountryOptionFlag = ({ country, className }: CountryOptionFlagProps) => {
  // Codes in the data are uppercase (e.g. "KE") but the flag files are lowercase
  // (ke.svg) — lowercase so the path resolves on case-sensitive hosts too.
  const countryCode = countries.find((c) => c.name === country)?.code?.toLowerCase();

  return <img src={`/images/flags/${countryCode}.svg`} alt={country} className={className} />;
};
