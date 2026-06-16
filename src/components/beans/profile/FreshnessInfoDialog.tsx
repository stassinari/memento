import { Button } from "~/components/Button";
import { Modal } from "~/components/Modal";

interface FreshnessInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const LEGEND = [
  { swatch: "bg-orange-400", label: "Aging", note: "clock running" },
  { swatch: "bg-blue-300 dark:bg-blue-400/70", label: "Frozen", note: "on pause" },
];

/** Explains the freshness bar & effective-age concept. */
export const FreshnessInfoDialog = ({ open, onClose }: FreshnessInfoDialogProps) => (
  <Modal open={open} handleClose={onClose}>
    <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-gray-100">
      How freshness works
    </h2>
    <div className="mt-2 space-y-3 text-sm text-gray-600 dark:text-gray-300">
      <p>
        Coffee ages from the day it&apos;s roasted, but freezing{" "}
        <span className="font-medium text-blue-600 dark:text-blue-300">pauses</span> the clock.{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">Effective age</span> is the
        real aging time — calendar days minus the stretch spent frozen.
      </p>
      <p>
        Thaw and the clock restarts; archive and it stops for good. An archived bar fades to mark
        the end of the line.
      </p>
      <p>Here&apos;s the breakdown:</p>
      <ul className="space-y-2">
        {LEGEND.map(({ swatch, label, note }) => (
          <li key={label} className="flex items-center gap-2.5">
            <span className={`h-2.5 w-5 shrink-0 rounded-sm ${swatch}`} />
            <span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
              <span className="text-gray-500 dark:text-gray-400"> — {note}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-5 flex justify-end">
      <Button variant="primary" colour="accent" onClick={onClose}>
        Got it
      </Button>
    </div>
  </Modal>
);
