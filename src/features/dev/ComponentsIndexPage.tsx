import { Link } from "@tanstack/react-router";
import { filter } from "lodash-es";
import { Heading } from "../../shared/Heading";
import { PREVIEWS } from "./previewRegistry";
import { PREVIEW_GROUPS } from "./utils/previewUtil";

export const ComponentsIndexPage = (): React.JSX.Element => (
  <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
    <div className="flex flex-col gap-2">
      <Heading as="h1" className="text-title">
        Components
      </Heading>
      <p className="text-lead text-muted">
        Every shared component and style, each in light and dark mode. Add a <code>*.preview.tsx</code> file next to a
        component to list it here.
      </p>
    </div>
    {PREVIEW_GROUPS.map((group) => (
      <section key={group} className="flex flex-col gap-3">
        <Heading as="h2" className="text-heading">
          {group}
        </Heading>
        <ul className="flex flex-col divide-y divide-line rounded border">
          {filter(PREVIEWS, { group }).map((preview) => (
            <li key={preview.slug}>
              <Link
                to="/dev/components/$name"
                params={{ name: preview.slug }}
                className="flex flex-col gap-1 p-4 hover:bg-surface-raised"
              >
                <span className="font-medium">{preview.title}</span>
                <span className="text-small text-muted">{preview.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </main>
);
