// The text roles meant for headings, which the Heading component sets in the heading font. index.css can't say this,
// since a text role doesn't carry a font, so the text sizes page reads it from here. A unit test checks each one exists.
export const HEADING_TEXT_ROLES = ["display", "title", "heading"];
