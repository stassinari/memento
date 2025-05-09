import { Table } from "@tanstack/react-table";
import { Divider } from "../Divider";
import { InputCheckbox } from "../InputCheckbox";

interface ColumnVisibilityProps {
  table: Table<any>;
}

export const ColumnVisibility = ({
  table,
}: ColumnVisibilityProps) => {
  return (
    <div className="text-left">
      <InputCheckbox
        label="Toggle all"
        checked={table.getIsAllColumnsVisible()}
        handleChange={table.getToggleAllColumnsVisibilityHandler()}
      />
      <Divider spacing="xs" />
      {table.getAllLeafColumns().map((column) => {
        return (
          <div key={column.id}>
            <InputCheckbox
              label={column.id}
              checked={column.getIsVisible()}
              handleChange={column.getToggleVisibilityHandler()}
            />
          </div>
        );
      })}
    </div>
  );
};
