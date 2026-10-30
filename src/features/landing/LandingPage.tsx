import { Link } from "@tanstack/react-router";
import { Heading } from "../../shared/Heading";
import { StarRating } from "../../shared/StarRating";
import { SITE_DESCRIPTION } from "../../utils/pageHeadUtil";

const EXAMPLE_RATING = 4;

export const LandingPage = (): React.JSX.Element => (
  <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
    <Heading as="h1" className="text-4xl font-bold">
      Game Reviews
    </Heading>
    <p className="text-lg text-gray-600">{SITE_DESCRIPTION}</p>
    <StarRating rating={EXAMPLE_RATING} />
    <div className="flex gap-3">
      <Link to="/app" search={{ q: undefined }} className="rounded bg-black px-4 py-2 text-white">
        Browse games
      </Link>
      <Link to="/login" search={{ redirect: undefined }} className="rounded border px-4 py-2">
        Sign in
      </Link>
    </div>
  </main>
);
