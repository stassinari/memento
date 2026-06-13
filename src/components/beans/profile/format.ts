import dayjs from "dayjs";
import { fromStorageDate } from "~/util";

/** Format a storage-space (UTC-midnight) date for display in the user's locale. */
export const fmtStorageDate = (date: Date | null, format = "D MMM YYYY"): string | null =>
  date ? dayjs(fromStorageDate(date)).format(format) : null;

/** "32d ago" / "today" from a whole-day count. */
export const fmtDaysAgo = (days: number): string => (days <= 0 ? "today" : `${days}d ago`);
