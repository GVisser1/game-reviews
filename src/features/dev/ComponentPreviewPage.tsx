import { Link, useParams } from "@tanstack/react-router";
import { isNil } from "lodash-es";
import { Heading } from "../../shared/Heading";
import { findPreview } from "./previewRegistry";

const BACK_LINK = (
  <Link to="/dev/components" className="text-small hover:underline">
    ← All components
  </Link>
);

export const ComponentPreviewPage = (): React.JSX.Element => {
  const { name } = useParams({ from: "/dev/components/$name" });
  const preview = findPreview(name);

  if (isNil(preview)) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-4 p-8">
        {BACK_LINK}
        <Heading as="h1" className="text-title">
          No preview called “{name}”
        </Heading>
      </main>
    );
  }

  const { Examples } = preview;
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        {BACK_LINK}
        <Heading as="h1" className="text-title">
          {preview.title}
        </Heading>
        <p className="text-lead text-muted">{preview.description}</p>
      </div>
      <Examples />
    </main>
  );
};
