import { Snowflake } from "lucide-react";
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
    colour: "green",
    label: "Open",
    leadingIcon: <span className="h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />,
  },
  frozen: { colour: "blue", label: "Frozen", leadingIcon: <Snowflake className="h-3 w-3" /> },
  thawed: { colour: "grey", label: "Thawed" },
  archived: { colour: "grey", label: "Archived" },
};

interface StatusPillProps {
  status: BeanStatus;
}

export const StatusPill = ({ status }: StatusPillProps) => {
  const { colour, label, leadingIcon } = STATUS_CONFIG[status];
  return <Badge colour={colour} label={label} leadingIcon={leadingIcon} />;
};
