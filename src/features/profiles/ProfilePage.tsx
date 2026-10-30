import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { isEmpty, isNil } from "lodash-es";
import { GameTile } from "../../shared/GameTile";
import { Heading } from "../../shared/Heading";
import { StarRating } from "../../shared/StarRating";
import { toErrorMessage } from "../../utils/errorUtil";
import { profileQueryOptions, profileReviewsQueryOptions } from "./profileQuery";
import type { Profile } from "./types";

type ProfileReviewsProps = {
  profile: Profile;
};

const ProfileReviews = ({ profile }: ProfileReviewsProps): React.JSX.Element => {
  const { data: reviews, isPending, error } = useQuery(profileReviewsQueryOptions(profile.username));

  if (isPending) {
    return <p>Loading reviews…</p>;
  }
  if (error) {
    return <p className="text-red-600">Could not load reviews: {toErrorMessage(error)}</p>;
  }
  if (isEmpty(reviews)) {
    return (
      <p>
        {profile.isOwn ? "You haven't reviewed any games yet." : `${profile.displayName} hasn't rated any games yet.`}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {reviews.map((review) => (
        <GameTile key={review.gameId} gameId={review.gameId} name={review.gameName} coverUrl={review.coverUrl}>
          <span className="text-xs text-gray-500">{review.releaseYear}</span>
          <StarRating rating={review.rating} />
          {review.body && <p className="line-clamp-3 text-sm text-gray-600">{review.body}</p>}
        </GameTile>
      ))}
    </ul>
  );
};

export const ProfilePage = (): React.JSX.Element => {
  const { username } = useParams({ from: "/app/users/$username" });
  const { data: profile, isPending, error } = useQuery(profileQueryOptions(username));

  if (isPending) {
    return <p>Loading profile…</p>;
  }
  if (error) {
    return <p className="text-red-600">Could not load this profile: {toErrorMessage(error)}</p>;
  }
  if (isNil(profile)) {
    return (
      <Heading as="h1" className="text-2xl font-bold">
        Player not found
      </Heading>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {profile.avatarUrl && <img src={profile.avatarUrl} alt="" className="size-12 rounded-full" />}
        <Heading as="h1" className="text-2xl font-bold">
          {profile.displayName}
        </Heading>
        {profile.isOwn && (
          <Link to="/app/account" className="ml-auto text-sm hover:underline">
            Account settings
          </Link>
        )}
      </div>
      <ProfileReviews profile={profile} />
    </div>
  );
};
