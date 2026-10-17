const COVER_URL_PREFIX = "https://images.igdb.com/igdb/image/upload/t_cover_big/";
const MS_PER_SECOND = 1000;

export const toCoverUrl = (cover?: { image_id: string }): string | null =>
  cover ? `${COVER_URL_PREFIX}${cover.image_id}.jpg` : null;

export const toReleaseYear = (unixSeconds?: number): number | null =>
  unixSeconds ? new Date(unixSeconds * MS_PER_SECOND).getUTCFullYear() : null;
