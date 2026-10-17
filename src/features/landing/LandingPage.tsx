import { Link } from "@tanstack/react-router";
import { StarRating } from "../../shared/StarRating";

const EXAMPLE_RATING = 4;

export const LandingPage = (): React.JSX.Element => (
  <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
    <h1 className="text-4xl font-bold">Game Reviews</h1>
    <p className="text-lg text-gray-600">Find any game, rate it, and keep track of everything you've played.</p>
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
