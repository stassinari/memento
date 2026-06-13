import clsx from "clsx";
import { SnowflakeIcon } from "~/components/icons/SnowflakeIcon";
import { BeanStatus } from "~/lib/beans";

/**
 * Lifecycle status pill for a bean: open / frozen / thawed / archived.
 *
 * Colour is semantic (house rules §3): green = open, blue = frozen (cold),
 * gray = thawed / archived (inert). The mock's `sky`/`emerald` don't exist in
 * this theme — they're remapped to `blue`/`green`.
 */

const STATUS_STYLES: Record<BeanStatus, string> = {
  open: "bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/15 dark:text-green-200 dark:ring-green-400/20",
  frozen:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/20",
  thawed:
    "bg-gray-100 text-gray-600 ring-gray-300 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15",
  archived:
    "bg-gray-200/70 text-gray-500 ring-gray-300 dark:bg-white/10 dark:text-gray-400 dark:ring-white/15",
};

const STATUS_LABELS: Record<BeanStatus, string> = {
  open: "Open",
  frozen: "Frozen",
  thawed: "Thawed",
  archived: "Archived",
};

interface StatusPillProps {
  status: BeanStatus;
  className?: string;
}

export const StatusPill = ({ status, className }: StatusPillProps) => (
  <span
    className={clsx(
      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
      STATUS_STYLES[status],
      className,
    )}
  >
    {status === "open" && (
      <span className="h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />
    )}
    {status === "frozen" && <SnowflakeIcon className="h-3 w-3" />}
    {STATUS_LABELS[status]}
  </span>
);
