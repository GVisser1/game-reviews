import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type GameTileProps = {
  gameId: number;
  name: string;
  coverUrl: string | null;
  children: ReactNode;
};

export const GameTile = ({ gameId, name, coverUrl, children }: GameTileProps): React.JSX.Element => (
  <li className="flex flex-col gap-1">
    <Link to="/app/games/$gameId" params={{ gameId }} className="flex flex-col gap-1 hover:underline">
      {coverUrl ? (
        <img src={coverUrl} alt={name} className="aspect-3/4 w-full rounded object-cover" />
      ) : (
        <div className="aspect-3/4 w-full rounded bg-surface-raised" />
      )}
      <span className="text-small font-medium">{name}</span>
    </Link>
    {children}
  </li>
);
