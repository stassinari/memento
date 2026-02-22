import React from "react";

interface EquipmentTableProps {
  rows: EquipmentRowProps[];
  onClick: () => void;
}

export const EquipmentTable = ({ rows, onClick }: EquipmentTableProps) => {
  return (
    <>
      <dl className="-my-3 divide-y divide-gray-200">
        {rows.map(({ label, value }) => (
          <EquipmentRow key={label} label={label} value={value} />
        ))}
      </dl>

      <button
        type="button"
        className="text-sm font-medium text-orange-500 hover:underline"
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
    <dt className="text-gray-500">{label}</dt>
    {value ? (
      <dd className="text-gray-900 whitespace-nowrap">{value}</dd>
    ) : (
      <dd className="italic text-gray-300 whitespace-nowrap">Not set</dd>
    )}
  </div>
);
