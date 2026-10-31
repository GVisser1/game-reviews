import { PreviewSection } from "../../features/dev/PreviewSection";
import { ShortRatingSummary } from "../../features/reviews/ShortRatingSummary";
import { GameTile } from "../GameTile";

export const title = "Game tile";
export const group = "Components";
export const description = "A game's cover and name, linking to its page, with details underneath.";

const EXAMPLE_COVER_URL = "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rs4.jpg";
const EXAMPLE_SUMMARY = { averageRating: 4.3, ratingCount: 12 };

const GameTilePreview = (): React.JSX.Element => (
  <PreviewSection title="With and without a cover">
    <ul className="grid grid-cols-3 gap-4">
      <GameTile gameId={72} name="Portal 2" coverUrl={EXAMPLE_COVER_URL}>
        <span className="flex gap-2 text-caption text-muted">
          2011
          <ShortRatingSummary summary={EXAMPLE_SUMMARY} />
        </span>
      </GameTile>
      <GameTile gameId={1} name="A game without a cover or ratings" coverUrl={null}>
        <span className="text-caption text-muted">2024</span>
      </GameTile>
    </ul>
  </PreviewSection>
);

export default GameTilePreview;
