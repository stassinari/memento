import React from "react";

interface EquipmentTableProps {
  rows: EquipmentRowProps[];
  onClick: () => void;
}

export const EquipmentTable = ({ rows, onClick }: EquipmentTableProps) => {
  return (
    <>
      <dl className="-my-3 divide-y divide-gray-200 dark:divide-white/10">
        {rows.map(({ label, value }) => (
          <EquipmentRow key={label} label={label} value={value} />
        ))}
      </dl>

      <button
        type="button"
        className="text-sm font-medium text-orange-500 hover:underline dark:text-orange-300"
        onClick={onClick}
      >
        Change...
      </button>
    </>
  );
};

// TODO extract and reuse from brew
interface EquipmentRowProps {
  label: string;
  value: string | null;
}

const EquipmentRow = ({ label, value }: EquipmentRowProps) => (
  <div className="flex justify-between py-3 text-sm font-medium">
    <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
    {value ? (
      <dd className="whitespace-nowrap text-gray-900 dark:text-gray-100">{value}</dd>
    ) : (
      <dd className="whitespace-nowrap italic text-gray-300 dark:text-gray-600">Not set</dd>
    )}
  </div>
);
