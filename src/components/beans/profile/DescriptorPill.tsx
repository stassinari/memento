import clsx from "clsx";
import { Beans } from "~/db/types";
import { getBeanDescriptor } from "~/lib/beans";
import { CountryOptionFlag } from "../CountryOptionFlag";

/**
 * The "what is it" pill: a flag (when a single-origin country is known) plus the
 * degrading descriptor text ("Washed Kenya" / "Kenya" / "Washed" / "Single
 * origin" / "Blend · N parts"). Blends use the orange (brand) tint; single
 * origins a neutral gray.
 */

interface DescriptorPillProps {
  bean: Beans;
  className?: string;
}

export const DescriptorPill = ({ bean, className }: DescriptorPillProps) => {
  const isBlend = bean.origin === "blend";
  const showFlag = !isBlend && !!bean.country;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        isBlend
          ? "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/15 dark:text-orange-200 dark:ring-orange-400/20"
          : "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-white/10 dark:text-gray-200 dark:ring-white/15",
        className,
      )}
    >
      {showFlag && (
        <CountryOptionFlag
          country={bean.country!}
          className="h-3.5 w-3.5 shrink-0 rounded-[2px] object-cover"
        />
      )}
      {getBeanDescriptor(bean)}
    </span>
  );
};
