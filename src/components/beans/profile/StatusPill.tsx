import { Archive, Flame, Snowflake, WavesVertical } from "lucide-react";
import { Badge } from "~/components/Badge";
import { BeanStatus } from "~/lib/beans";

/**
 * Lifecycle status pill for a bean: open / frozen / thawed / archived.
 * A thin wrapper over `Badge` — green = open, blue = frozen (cold), gray =
 * thawed / archived (inert).
 */

type BadgeColour = "grey" | "orange" | "blue" | "green";

const STATUS_CONFIG: Record<
  BeanStatus,
  { colour: BadgeColour; label: string; leadingIcon?: React.ReactNode }
> = {
  open: {
    colour: "orange",
    label: "Open",
    leadingIcon: <Flame className="size-3" />,
  },
  frozen: { colour: "blue", label: "Frozen", leadingIcon: <Snowflake className="size-3" /> },
  thawed: { colour: "orange", label: "Thawed", leadingIcon: <WavesVertical className="size-3" /> },
  archived: { colour: "grey", label: "Archived", leadingIcon: <Archive className="size-3" /> },
};

interface StatusPillProps {
  status: BeanStatus;
  size?: "small" | "large";
}

export const StatusPill = ({ status, size = "small" }: StatusPillProps) => {
  const { colour, label, leadingIcon } = STATUS_CONFIG[status];
  return <Badge colour={colour} size={size} label={label} leadingIcon={leadingIcon} />;
};
