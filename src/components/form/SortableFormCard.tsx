import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { type ReactNode } from "react";
import { Button } from "~/components/Button";
import { DragHandleDots2Icon } from "~/components/icons/DragHandleDots2Icon";

interface SortableFormCardProps {
  id: string;
  title: string;
  children: ReactNode;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  canRemove?: boolean;
  onRemove?: () => void;
  actionSlot?: ReactNode;
  showDragHandle?: boolean;
}

export const SortableFormCard = ({
  id,
  title,
  children,
  isCollapsed,
  onToggleCollapse,
  canRemove = false,
  onRemove,
  actionSlot,
  showDragHandle = true,
}: SortableFormCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900",
        isDragging && "z-50 shadow-xl ring-2 ring-orange-200 dark:ring-orange-500/20",
      )}
      style={{
        // Translate-only prevents card squashing when sorting mixed-height items.
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <div
        className={clsx(
          "flex items-center justify-between gap-2 bg-gray-50 px-3 py-2 dark:bg-white/5",
          !isCollapsed && "border-b border-gray-200 dark:border-white/10",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {showDragHandle && (
            <button
              ref={setActivatorNodeRef}
              type="button"
              className="inline-flex cursor-grab items-center rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
              aria-label={`Reorder ${title}`}
              {...attributes}
              {...listeners}
            >
              <DragHandleDots2Icon className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            className="group inline-flex min-w-0 items-center gap-1 rounded-sm text-left text-sm font-semibold text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
            onClick={onToggleCollapse}
            aria-expanded={!isCollapsed}
          >
            <span className="truncate">{title}</span>
            <ChevronDownIcon
              className={clsx(
                "h-4 w-4 text-gray-500 transition-transform dark:text-gray-400",
                isCollapsed ? "-rotate-90" : "rotate-0",
              )}
            />
          </button>
        </div>

        {actionSlot ??
          (onRemove ? (
            <Button
              type="button"
              variant="white"
              size="xs"
              disabled={!canRemove}
              onClick={onRemove}
            >
              <TrashIcon />
              <span className="sr-only">Remove</span>
              <span className="hidden md:inline">Remove</span>
            </Button>
          ) : null)}
      </div>

      {!isCollapsed && <div className="space-y-3 p-4">{children}</div>}
    </div>
  );
};
