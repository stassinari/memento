import { Search } from "lucide-react";
import { ReactNode, useState } from "react";
import { Badge } from "~/components/Badge";
import { CountryOptionFlag } from "~/components/beans/CountryOptionFlag";
import { COFFEE_REGION_ORDER, getCoffeeRegion } from "~/data/countries";
import { getRoastLevelLabel } from "~/lib/beans";
import { BeansFilters, FacetOption, StatusKey, deriveFacetOptions } from "./filters";

interface BeansHistoryFiltersProps {
  filters: BeansFilters;
  setFilters: (next: BeansFilters) => void;
  statusCounts: { archived: number; open: number; frozen: number };
  options: ReturnType<typeof deriveFacetOptions>;
}

const toggle = <T,>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const STATUS_LABELS: { key: StatusKey; label: string }[] = [
  { key: "archived", label: "Archived" },
  { key: "open", label: "Open" },
  { key: "frozen", label: "Frozen" },
];

export const BeansHistoryFilters = ({
  filters,
  setFilters,
  statusCounts,
  options,
}: BeansHistoryFiltersProps) => (
  <div className="space-y-5">
    <FacetSection title="Status">
      <div className="space-y-0.5">
        {STATUS_LABELS.map(({ key, label }) => (
          <CheckboxRow
            key={key}
            label={label}
            count={statusCounts[key]}
            checked={filters.statuses.includes(key)}
            onChange={() => setFilters({ ...filters, statuses: toggle(filters.statuses, key) })}
          />
        ))}
      </div>
    </FacetSection>

    <FacetSection title="Roaster">
      <SearchableCheckboxFacet
        options={options.roasters}
        selected={filters.roasters}
        onToggle={(value) => setFilters({ ...filters, roasters: toggle(filters.roasters, value) })}
        searchPlaceholder="Find a roaster…"
        noun="roasters"
      />
    </FacetSection>

    {options.countries.length > 0 && (
      <FacetSection title="Country">
        <div className="space-y-2.5">
          {[...COFFEE_REGION_ORDER, "Other" as const].map((region) => {
            const inRegion = options.countries
              .filter((o) => getCoffeeRegion(o.value) === region)
              .sort((a, b) => a.value.localeCompare(b.value));
            if (inRegion.length === 0) return null;
            return (
              <div key={region}>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {region}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {inRegion.map((o) => (
                    <Badge
                      key={o.value}
                      label={o.value}
                      colour="blue"
                      outline={!filters.countries.includes(o.value)}
                      leadingIcon={
                        <CountryOptionFlag country={o.value} className="h-3 w-auto rounded-sm" />
                      }
                      onClick={() =>
                        setFilters({ ...filters, countries: toggle(filters.countries, o.value) })
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </FacetSection>
    )}

    {options.processes.length > 0 && (
      <FacetSection title="Process">
        <SearchableCheckboxFacet
          options={options.processes}
          selected={filters.processes}
          onToggle={(value) => setFilters({ ...filters, processes: toggle(filters.processes, value) })}
          searchPlaceholder="Find a process…"
          noun="processes"
        />
      </FacetSection>
    )}

    {options.roastLevels.length > 0 && (
      <FacetSection title="Roast level">
        <div className="flex flex-wrap gap-1.5">
          {options.roastLevels.map((o) => {
            const level = Number(o.value);
            return (
              <Badge
                key={o.value}
                label={getRoastLevelLabel(level) ?? o.value}
                colour="blue"
                outline={!filters.roastLevels.includes(level)}
                onClick={() => setFilters({ ...filters, roastLevels: toggle(filters.roastLevels, level) })}
              />
            );
          })}
        </div>
      </FacetSection>
    )}

    <FacetSection title="Score">
      <div className="flex items-center gap-2 text-sm">
        <ScoreInput
          value={filters.scoreMin}
          placeholder="0"
          onChange={(v) => setFilters({ ...filters, scoreMin: v })}
        />
        <span className="text-gray-400">to</span>
        <ScoreInput
          value={filters.scoreMax}
          placeholder="10"
          onChange={(v) => setFilters({ ...filters, scoreMax: v })}
        />
      </div>
    </FacetSection>

    {options.years.length > 0 && (
      <FacetSection title="Year archived">
        <div className="flex flex-wrap gap-1.5">
          {options.years.map((o) => {
            const year = Number(o.value);
            return (
              <Badge
                key={o.value}
                label={o.value}
                colour="blue"
                outline={!filters.years.includes(year)}
                onClick={() => setFilters({ ...filters, years: toggle(filters.years, year) })}
              />
            );
          })}
        </div>
      </FacetSection>
    )}

    {options.roastYears.length > 0 && (
      <FacetSection title="Year roasted">
        <div className="flex flex-wrap gap-1.5">
          {options.roastYears.map((o) => {
            const year = Number(o.value);
            return (
              <Badge
                key={o.value}
                label={o.value}
                colour="blue"
                outline={!filters.roastYears.includes(year)}
                onClick={() => setFilters({ ...filters, roastYears: toggle(filters.roastYears, year) })}
              />
            );
          })}
        </div>
      </FacetSection>
    )}
  </div>
);

const FacetSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
      {title}
    </p>
    <div className="mt-2">{children}</div>
  </div>
);

const CheckboxRow = ({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-center gap-2.5 py-0.5 text-sm text-gray-700 dark:text-gray-300">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded-sm border-gray-300 text-orange-600 focus:ring-orange-500 dark:border-white/20 dark:bg-gray-900 dark:text-orange-400"
    />
    <span className="flex-1 truncate">{label}</span>
    {count != null && <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>}
  </label>
);

const ScoreInput = ({
  value,
  placeholder,
  onChange,
}: {
  value: number | null;
  placeholder: string;
  onChange: (v: number | null) => void;
}) => (
  <input
    type="number"
    min={0}
    max={10}
    step={0.1}
    value={value ?? ""}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
    className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-center dark:border-white/15 dark:bg-gray-900"
  />
);

const FACET_PREVIEW = 6;

/** Searchable, counted checkbox list for high-cardinality facets (roaster,
 *  process): a search box, a previewed list with "+N more", and counts. */
const SearchableCheckboxFacet = ({
  options,
  selected,
  onToggle,
  searchPlaceholder,
  noun,
}: {
  options: FacetOption[];
  selected: string[];
  onToggle: (value: string) => void;
  searchPlaceholder: string;
  noun: string;
}) => {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = query
    ? options.filter((o) => o.value.toLowerCase().includes(query.toLowerCase()))
    : options;
  const visible = showAll || query ? filtered : filtered.slice(0, FACET_PREVIEW);
  const hiddenCount = filtered.length - visible.length;

  return (
    <div>
      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-xs placeholder-gray-400 focus:outline-hidden dark:border-white/10 dark:bg-gray-900"
        />
      </div>
      <div className="mt-2 space-y-0.5">
        {visible.map((o) => (
          <CheckboxRow
            key={o.value}
            label={o.value}
            count={o.count}
            checked={selected.includes(o.value)}
            onChange={() => onToggle(o.value)}
          />
        ))}
        {visible.length === 0 && <p className="py-1 text-xs text-gray-400">No {noun} match.</p>}
      </div>
      {!query && (hiddenCount > 0 || showAll) && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400"
        >
          {showAll ? "Show fewer" : `+ ${hiddenCount} more ${noun}`}
        </button>
      )}
    </div>
  );
};
