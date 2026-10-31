// The few mdast fields this plugin needs.
type MdastNode = { type: string; children?: MdastNode[] };

// MDX parses text on its own line inside JSX as Markdown, so the formatter's
//
//   <Heading as="h1">
//     Page title
//   </Heading>
//
// renders `<h1><p>Page title</p></h1>`, and an icon followed by its text on the next line renders the text in a `<p>`.
// This unwraps the paragraph when it's the only one inside a JSX element, so the text renders as if it were on one line
// with its tags. Several paragraphs, separated by blank lines, are prose and stay paragraphs.
export const remarkUnwrapJsxText =
  () =>
  (tree: MdastNode): void => {
    unwrap(tree);
  };

const unwrap = (node: MdastNode): void => {
  node.children?.forEach(unwrap);
  const paragraphs = node.children?.filter((child) => child.type === "paragraph") ?? [];
  if (node.type === "mdxJsxFlowElement" && paragraphs.length === 1) {
    node.children = node.children?.flatMap((child) => (child.type === "paragraph" ? (child.children ?? []) : [child]));
  }
};
