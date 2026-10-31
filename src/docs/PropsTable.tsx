import { isEmpty, isNil } from "lodash-es";
import type { Documentation } from "react-docgen";
import { CELL_CLASS_NAME, DocsTable } from "./DocsTable";
import { toTypeLabel } from "./utils/docsUtil";

type PropsTableProps = {
  // What `import docs from "./Component.tsx?docgen"` gives.
  docs: Documentation[];
  // Which of the file's components to show; the first one when left out.
  component?: string;
};

const HEADERS = ["Prop", "Type", "Default", "Description"];

// The component's props, read from its TypeScript types and their JSDoc comments, so it can't drift from the code.
export const PropsTable = ({ docs, component }: PropsTableProps): React.JSX.Element => {
  const documentation = docs.find((entry) => entry.displayName === component) ?? docs[0];
  const props = Object.entries(documentation?.props ?? {});
  if (isEmpty(props)) {
    return <p className="text-muted">This component takes no props.</p>;
  }

  return (
    <DocsTable headers={HEADERS}>
      {props.map(([name, prop]) => (
        <tr key={name}>
          <td className={`${CELL_CLASS_NAME} font-mono whitespace-nowrap`}>
            {name}
            {prop.required === true && (
              <span className="text-danger" title="Required">
                *
              </span>
            )}
          </td>
          <td className={`${CELL_CLASS_NAME} font-mono text-accent`}>{toTypeLabel(prop)}</td>
          <td className={`${CELL_CLASS_NAME} font-mono text-muted`}>
            {isNil(prop.defaultValue) ? "—" : String(prop.defaultValue.value)}
          </td>
          <td className={CELL_CLASS_NAME}>{prop.description ?? ""}</td>
        </tr>
      ))}
    </DocsTable>
  );
};
