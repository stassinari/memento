import { Badge } from "~/components/Badge";
import { Beans } from "~/db/types";
import { getBeanDescriptor } from "~/lib/beans";
import { CountryOptionFlag } from "../CountryOptionFlag";

/**
 * The "what is it" pill: a flag (when a single-origin country is known) plus the
 * degrading descriptor text ("Kenya · Washed" / "Kenya" / "Washed" / "Single
 * origin" / "Blend · N parts"). Always a neutral gray. Thin wrapper over `Badge`.
 */

interface DescriptorPillProps {
  bean: Beans;
  size?: "small" | "large";
}

export const DescriptorPill = ({ bean, size = "small" }: DescriptorPillProps) => {
  const showFlag = bean.origin !== "blend" && !!bean.country;

  return (
    <Badge
      colour="grey"
      size={size}
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
