import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { supabase } from "../../lib/supabase";
import { PROFILE_QUERY_KEY } from "../profiles/profileQuery";
import { GAME_REVIEWS_QUERY_KEY } from "./gameReviewsQuery";
import { RATING_SUMMARY_QUERY_KEY } from "./ratingSummaryQuery";
import type { Review } from "./types";

const REVIEWS_QUERY_KEY = ["reviews"];

type ReviewRow = {
  game_id: number;
  game_name: string;
  cover_url: string | null;
  release_year: number | null;
  rating: number;
  body: string | null;
};

type ReviewsState = {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  saveReview: (review: Review) => void;
  removeReview: (gameId: number) => void;
};

type ReviewsSnapshot = {
  previousReviews: Review[] | undefined;
};

const toReview = (row: ReviewRow): Review => ({
  gameId: row.game_id,
  gameName: row.game_name,
  coverUrl: row.cover_url,
  releaseYear: row.release_year,
  rating: row.rating,
  body: row.body,
});

const toReviewRow = (review: Review): ReviewRow => ({
  game_id: review.gameId,
  game_name: review.gameName,
  cover_url: review.coverUrl,
  release_year: review.releaseYear,
  rating: review.rating,
  body: review.body,
});

const withoutGame = (reviews: Review[], gameId: number): Review[] =>
  reviews.filter((review) => review.gameId !== gameId);

const throwIfError = ({ error }: { error: Error | null }): void => {
  if (!isNil(error)) {
    throw error;
  }
};

const fetchReviews = async (): Promise<Review[]> => {
  const { data, error }: PostgrestSingleResponse<ReviewRow[]> = await supabase
    .from("reviews")
    .select("game_id, game_name, cover_url, release_year, rating, body")
    .order("created_at", { ascending: false })
    .overrideTypes<ReviewRow[], { merge: false }>();
  throwIfError({ error });
  return (data ?? []).map(toReview);
};

export const reviewsQueryOptions = queryOptions({
  queryKey: REVIEWS_QUERY_KEY,
  queryFn: fetchReviews,
});

const upsertReview = async (review: Review): Promise<void> => {
  throwIfError(await supabase.from("reviews").upsert(toReviewRow(review), { onConflict: "user_id,game_id" }));
};

const deleteReview = async (gameId: number): Promise<void> => {
  throwIfError(await supabase.from("reviews").delete().eq("game_id", gameId));
};

export const useReviews = (): ReviewsState => {
  const queryClient = useQueryClient();
  const reviewsQuery = useQuery(reviewsQueryOptions);

  // Update the cache straight away so stars change instantly, and roll back if the save fails.
  const updateReviewsOptimistically = async (update: (reviews: Review[]) => Review[]): Promise<ReviewsSnapshot> => {
    await queryClient.cancelQueries({ queryKey: REVIEWS_QUERY_KEY });
    const previousReviews = queryClient.getQueryData<Review[]>(REVIEWS_QUERY_KEY);
    queryClient.setQueryData<Review[]>(REVIEWS_QUERY_KEY, (reviews = []) => update(reviews));
    return { previousReviews };
  };

  const rollBack = (_error: Error, _variables: unknown, snapshot?: ReviewsSnapshot): void => {
    queryClient.setQueryData(REVIEWS_QUERY_KEY, snapshot?.previousReviews);
  };

  // Your own reviews, the games' public review lists, their community ratings and your profile change when you save or
  // remove one.
  const refetchReviews = async (): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: GAME_REVIEWS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: RATING_SUMMARY_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: upsertReview,
    onMutate: (review: Review) =>
      updateReviewsOptimistically((reviews) => [review, ...withoutGame(reviews, review.gameId)]),
    onError: rollBack,
    onSettled: refetchReviews,
  });

  const removeMutation = useMutation({
    mutationFn: deleteReview,
    onMutate: (gameId: number) => updateReviewsOptimistically((reviews) => withoutGame(reviews, gameId)),
    onError: rollBack,
    onSettled: refetchReviews,
  });

  const error = reviewsQuery.error ?? saveMutation.error ?? removeMutation.error;

  return {
    reviews: reviewsQuery.data ?? [],
    isLoading: reviewsQuery.isPending,
    error: error?.message ?? null,
    saveReview: saveMutation.mutate,
    removeReview: removeMutation.mutate,
  };
};
