import { ScoreChip } from "~/components/ScoreChip";
import { roundToDecimal } from "~/utils";

/**
 * A bean's average score as a `ScoreChip` (1 decimal). Passing `null` lets
 * `ScoreChip` render its consistent muted "—" state. Shared by the quick list
 * and the History table.
 */
export const BeanScore = ({ score }: { score: number | null }) => (
  <ScoreChip>{score != null ? roundToDecimal(score, 1) : null}</ScoreChip>
);
