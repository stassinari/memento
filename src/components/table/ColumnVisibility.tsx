import { Table } from "@tanstack/react-table";

interface ColumnVisibilityProps {
  table: Table<any>;
}

export const ColumnVisibility: React.FC<ColumnVisibilityProps> = ({
  table,
}) => {
  return (
    <div className="inline-block text-left">
      <label>
        <input
          type="checkbox"
          checked={table.getIsAllColumnsVisible()}
          onChange={table.getToggleAllColumnsVisibilityHandler()}
        />
        Toggle All
      </label>
      {table.getAllLeafColumns().map((column) => {
        return (
          <div key={column.id}>
            <label>
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              {column.id}
            </label>
          </div>
        );
      })}
    </div>
  );
};
