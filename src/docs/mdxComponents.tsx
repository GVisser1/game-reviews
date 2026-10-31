import { kebabCase } from "lodash-es";
import type { MDXComponents } from "mdx/types";
import { Heading } from "../shared/Heading";
import { ColorRoles } from "./ColorRoles";
import { ContrastTable } from "./ContrastTable";
import { Demo } from "./Demo";
import { Palette } from "./Palette";
import { PropsTable } from "./PropsTable";
import { TextRoles } from "./TextRoles";

// How the docs pages' Markdown renders, plus the components every page can use without importing them.
export const MDX_COMPONENTS: MDXComponents = {
  h2: ({ children }) => (
    <Heading as="h2" id={typeof children === "string" ? kebabCase(children) : undefined} className="mt-6 text-heading">
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" className="mt-2 text-lead font-semibold">
      {children}
    </Heading>
  ),
  p: (props) => <p className="max-w-prose" {...props} />,
  ul: (props) => <ul className="flex max-w-prose list-disc flex-col gap-1 pl-6" {...props} />,
  ol: (props) => <ol className="flex max-w-prose list-decimal flex-col gap-1 pl-6" {...props} />,
  a: (props) => <a className="text-accent underline hover:text-accent-hover" {...props} />,
  code: (props) => <code className="rounded bg-surface-raised px-1 font-mono text-small" {...props} />,
  ColorRoles,
  ContrastTable,
  Demo,
  Palette,
  PropsTable,
  TextRoles,
};
