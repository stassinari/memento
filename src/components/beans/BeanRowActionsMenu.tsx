import { Archive, ArchiveRestore, Copy, MoreVertical, Pencil, Snowflake, Trash2 } from "lucide-react";
import { DropdownItem, DropdownMenu } from "~/components/DropdownMenu";
import { Beans } from "~/db/types";
import { getBeanActions } from "~/lib/beans";
import { UseBeanActions } from "~/hooks/useBeanActions";

const iconStyles = "h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500";

interface BeanRowActionsMenuProps {
  bean: Beans;
  actions: UseBeanActions;
}

/**
 * The per-row ⋯ menu for a bean: contextual Freeze/Thaw · Clone · Archive ·
 * Edit · Delete (kept apart, in red). Lifecycle behaviour is delegated to the
 * shared `useBeanActions` hook so list rows and the History table stay in sync;
 * the menu chrome comes from the shared `DropdownMenu` (anchored + portalled, so
 * a rounded card can't clip it).
 */
export const BeanRowActionsMenu = ({ bean, actions }: BeanRowActionsMenuProps) => {
  const can = getBeanActions(bean);

  const items: DropdownItem[] = [];
  if (can.canFreeze) {
    items.push({
      type: "button",
      label: "Freeze beans",
      onClick: () => actions.freeze(bean.id),
      icon: <Snowflake className="h-4 w-4 shrink-0 text-blue-500" />,
    });
  }
  if (can.canThaw) {
    items.push({
      type: "button",
      label: "Thaw beans",
      onClick: () => actions.thaw(bean.id),
      icon: <Snowflake className="h-4 w-4 shrink-0 text-blue-500" />,
    });
  }
  items.push({
    type: "link",
    label: "Clone",
    linkProps: { to: "/beans/$beansId/clone", params: { beansId: bean.id } },
    icon: <Copy className={iconStyles} />,
  });
  items.push({ type: "divider" });
  items.push(
    can.canUnarchive
      ? {
          type: "button",
          label: "Unarchive",
          onClick: () => actions.unarchive(bean.id),
          icon: <ArchiveRestore className={iconStyles} />,
        }
      : {
          type: "button",
          label: "Archive",
          onClick: () => actions.archive(bean.id),
          icon: <Archive className={iconStyles} />,
        },
  );
  items.push({ type: "divider" });
  items.push({
    type: "link",
    label: "Edit details",
    linkProps: { to: "/beans/$beansId/edit", params: { beansId: bean.id } },
    icon: <Pencil className={iconStyles} />,
  });
  items.push({
    type: "button",
    label: "Delete",
    onClick: () => actions.remove(bean.id),
    danger: true,
    icon: <Trash2 className="h-4 w-4 shrink-0" />,
  });

  return (
    <DropdownMenu
      srLabel="Bean actions"
      trigger={<MoreVertical className="h-4 w-4" aria-hidden="true" />}
      triggerClassName="grid h-7 w-7 place-items-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
      items={items}
      panelClassName="w-48"
    />
  );
};
