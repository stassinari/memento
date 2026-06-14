import { Badge } from "~/components/Badge";
import { Beans } from "~/db/types";
import { getBeanDescriptor } from "~/lib/beans";
import { CountryOptionFlag } from "../CountryOptionFlag";

/**
 * The "what is it" pill: a flag (when a single-origin country is known) plus the
 * degrading descriptor text ("Washed Kenya" / "Kenya" / "Washed" / "Single
 * origin" / "Blend · N parts"). Blends use the orange (brand) tint; single
 * origins a neutral gray. Thin wrapper over `Badge`.
 */

interface DescriptorPillProps {
  bean: Beans;
}

export const DescriptorPill = ({ bean }: DescriptorPillProps) => {
  const isBlend = bean.origin === "blend";
  const showFlag = !isBlend && !!bean.country;

  return (
    <Badge
      colour={isBlend ? "orange" : "grey"}
      label={getBeanDescriptor(bean)}
      leadingIcon={
        showFlag && (
          <CountryOptionFlag
            country={bean.country!}
            className="h-3.5 w-3.5 rounded-xs object-cover"
          />
        )
      }
    />
  );
};
