import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Heading } from "../shared/Heading";
import { Icon } from "../shared/Icon";

export const NotFoundPage = (): React.JSX.Element => (
  <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
    <Heading as="h1" className="text-title">
      Page not found
    </Heading>
    <Link to="/" className="inline-flex items-center gap-1 hover:underline">
      <Icon icon={ArrowLeft} />
      Back to the home page
    </Link>
  </main>
);
