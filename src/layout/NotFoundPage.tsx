import { Link } from "@tanstack/react-router";
import { Heading } from "../shared/Heading";

export const NotFoundPage = (): React.JSX.Element => (
  <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
    <Heading as="h1" className="text-title">
      Page not found
    </Heading>
    <Link to="/" className="hover:underline">
      ← Back to the home page
    </Link>
  </main>
);
