import React from "react";
import "twin.macro";

interface EquipmentTableProps {
  rows: EquipmentRowProps[];
  onClick: () => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  rows,
  onClick,
}) => {
  return (
    <>
      <dl tw="-my-3 divide-y divide-gray-200">
        {rows.map(({ label, value }) => (
          <EquipmentRow key={label} label={label} value={value} />
        ))}
      </dl>

      <button
        type="button"
        tw="text-sm font-medium text-orange-500 hover:underline"
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

const EquipmentRow: React.FC<EquipmentRowProps> = ({ label, value }) => (
  <div tw="flex justify-between py-3 text-sm font-medium">
    <dt tw="text-gray-500">{label}</dt>
    {value ? (
      <dd tw="text-gray-900 whitespace-nowrap">{value}</dd>
    ) : (
      <dd tw="italic text-gray-300 whitespace-nowrap">Not set</dd>
    )}
  </div>
);
