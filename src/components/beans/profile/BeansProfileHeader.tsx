import { ButtonWithDropdown } from "~/components/ButtonWithDropdown";
import { Beans } from "~/db/types";
import { BeanStatus, getBeanActions } from "~/lib/beans";
import { BeanActionToolbar } from "./BeanActionToolbar";
import { DescriptorPill } from "./DescriptorPill";
import { StatusPill } from "./StatusPill";

interface BeansProfileHeaderProps {
  bean: Beans;
  status: BeanStatus;
  beansId: string;
  isDesktop: boolean;
  onFreeze: () => void;
  onThaw: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
}

export const BeansProfileHeader = ({
  bean,
  status,
  beansId,
  isDesktop,
  onFreeze,
  onThaw,
  onArchive,
  onUnarchive,
  onDelete,
}: BeansProfileHeaderProps) => {
  if (isDesktop) {
    return (
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
            {bean.name}
          </h1>
          <p className="mt-1.5 text-lg font-medium text-gray-500 dark:text-gray-400">
            {bean.roaster}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DescriptorPill bean={bean} size="large" />
            <StatusPill status={status} size="large" />
          </div>
        </div>
        <BeanActionToolbar
          actions={getBeanActions(bean)}
          beansId={beansId}
          onFreeze={onFreeze}
          onThaw={onThaw}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onDelete={onDelete}
        />
      </div>
    );
  }

  // Mobile: Freeze/Thaw live in the Freshness card, Archive in its own zone —
  // so the top action is just Clone + an Edit/Delete overflow.
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
            {bean.name}
          </h1>
          <p className="mt-0.5 text-base font-medium text-gray-500 dark:text-gray-400">
            {bean.roaster}
          </p>
        </div>
        <ButtonWithDropdown
          mainButton={{
            type: "link",
            label: "Clone",
            linkProps: { to: "/beans/$beansId/clone", params: { beansId } },
          }}
          dropdownItems={[
            {
              type: "link",
              label: "Edit details",
              linkProps: { to: "/beans/$beansId/edit", params: { beansId } },
            },
            { type: "button", label: "Delete", onClick: onDelete },
          ]}
        />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <DescriptorPill bean={bean} />
        <StatusPill status={status} />
      </div>
    </div>
  );
};
