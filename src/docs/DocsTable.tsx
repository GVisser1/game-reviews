import type { ReactNode } from "react";

export const CELL_CLASS_NAME = "border-b px-3 py-2 text-left align-top";

type DocsTableProps = {
  headers: string[];
  // The table's rows, using CELL_CLASS_NAME for their cells.
  children: ReactNode;
};

// The bordered, scrollable table the docs pages use for props and tokens.
export const DocsTable = ({ headers, children }: DocsTableProps): React.JSX.Element => (
  <div className="overflow-x-auto rounded border">
    <table className="w-full text-small">
      <thead className="bg-surface-raised">
        <tr>
          {headers.map((header) => (
            <th key={header} className={CELL_CLASS_NAME}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);
