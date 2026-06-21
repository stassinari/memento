import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useCallback, useState } from "react";
import { Button } from "~/components/Button";
import { Modal } from "~/components/Modal";
import { archiveBeans, deleteBeans, freezeBeans, thawBeans, unarchiveBeans } from "~/db/mutations";
import { toStorageDate } from "~/util";

/**
 * The bean lifecycle mutations (freeze · thaw · archive · unarchive · delete),
 * wired once with their query invalidation, the client-side calendar-day
 * computation the server expects, and the "can't delete beans with drinks"
 * error modal. Extracted from the profile route so any surface that lists beans
 * — the Open/Frozen rows, the History table — drives the same behaviour.
 *
 * Handlers take a `beansId` so a list can instantiate the hook *once* and reuse
 * it across every row. Render `deleteErrorModal` once at the page level.
 */
export interface UseBeanActions {
  freeze: (beansId: string) => Promise<void>;
  thaw: (beansId: string) => Promise<void>;
  archive: (beansId: string) => Promise<void>;
  unarchive: (beansId: string) => Promise<void>;
  /** Resolves `true` when the bean was deleted, `false` when it has linked drinks. */
  remove: (beansId: string) => Promise<boolean>;
  deleteErrorModal: ReactNode;
}

export function useBeanActions(): UseBeanActions {
  const queryClient = useQueryClient();
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);

  const invalidate = useCallback(
    (beansId: string) => {
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      queryClient.invalidateQueries({ queryKey: ["bean", beansId] });
    },
    [queryClient],
  );

  // The server stores UTC-midnight dates; compute "today" client-side so it
  // lands on the user's calendar day, not the server's.
  const today = () => toStorageDate(new Date())!;

  const freeze = useCallback(
    async (beansId: string) => {
      await freezeBeans({ data: { beansId, date: today() } });
      invalidate(beansId);
    },
    [invalidate],
  );

  const thaw = useCallback(
    async (beansId: string) => {
      await thawBeans({ data: { beansId, date: today() } });
      invalidate(beansId);
    },
    [invalidate],
  );

  const archive = useCallback(
    async (beansId: string) => {
      await archiveBeans({ data: { beansId, date: today() } });
      invalidate(beansId);
    },
    [invalidate],
  );

  const unarchive = useCallback(
    async (beansId: string) => {
      await unarchiveBeans({ data: { beansId } });
      invalidate(beansId);
    },
    [invalidate],
  );

  const remove = useCallback(
    async (beansId: string) => {
      const wasDeleted = await deleteBeans({ data: { beansId } });
      if (wasDeleted) invalidate(beansId);
      else setIsDeleteErrorOpen(true);
      return wasDeleted;
    },
    [invalidate],
  );

  const deleteErrorModal = (
    <Modal open={isDeleteErrorOpen} handleClose={() => setIsDeleteErrorOpen(false)}>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Cannot delete beans that have associated drinks. Please delete the drinks first.
      </p>
      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          variant="primary"
          colour="accent"
          onClick={() => setIsDeleteErrorOpen(false)}
        >
          Okay
        </Button>
      </div>
    </Modal>
  );

  return { freeze, thaw, archive, unarchive, remove, deleteErrorModal };
}
