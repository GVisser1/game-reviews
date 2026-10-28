import { Link } from "@tanstack/react-router";

export const NotFoundPage = (): React.JSX.Element => (
  <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
    <h1 className="text-2xl font-bold">Page not found</h1>
    <Link to="/" className="hover:underline">
      ← Back to the home page
    </Link>
  </main>
);
