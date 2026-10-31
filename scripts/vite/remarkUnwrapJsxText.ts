// The few mdast fields this plugin needs.
type MdastNode = { type: string; children?: MdastNode[] };

// MDX parses text on its own line inside JSX as Markdown, so the formatter's
//
//   <Heading as="h1">
//     Page title
//   </Heading>
//
// renders `<h1><p>Page title</p></h1>`. This unwraps a paragraph that's the only thing inside a JSX element, so the
// text renders as if it were on one line with its tags. Several paragraphs, separated by blank lines, stay paragraphs.
export const remarkUnwrapJsxText =
  () =>
  (tree: MdastNode): void => {
    unwrap(tree);
  };

const unwrap = (node: MdastNode): void => {
  node.children?.forEach(unwrap);
  const [onlyChild, ...otherChildren] = node.children ?? [];
  if (node.type === "mdxJsxFlowElement" && onlyChild?.type === "paragraph" && otherChildren.length === 0) {
    node.children = onlyChild.children;
  }
};
