import { useParams } from "@tanstack/react-router";
import { isNil } from "lodash-es";
import { Heading } from "../shared/Heading";
import { findDocsPage } from "./docsRegistry";
import { MDX_COMPONENTS } from "./mdxComponents";

export const DocsPage = (): React.JSX.Element => {
  const { name } = useParams({ from: "/dev/docs/$name" });
  const page = findDocsPage(name);

  if (isNil(page)) {
    return (
      <Heading as="h1" className="text-title">
        No docs called “{name}”
      </Heading>
    );
  }

  const { Content } = page;
  return (
    <article className="flex flex-col gap-4">
      <Heading as="h1" className="text-title">
        {page.title}
      </Heading>
      <p className="text-lead text-muted">{page.description}</p>
      <Content components={MDX_COMPONENTS} />
    </article>
  );
};
