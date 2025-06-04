import { FC } from "react";

export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  description: string;
  track1: string;
  track2: string;
  comment: string;
}

interface Props {
  album: Album;
  active: boolean;
  onSelect: () => void;
}

const AlbumCard: FC<Props> = ({ album, active, onSelect }) => {
  return (
    <div className="relative cursor-pointer" onClick={onSelect}>
      <img
        src={album.cover}
        alt={album.title}
        className="w-40 h-40 object-cover z-10 relative"
      />
      <div
        className={`record-slide absolute top-1/2 -translate-y-1/2 right-0 w-32 h-32 rounded-full bg-black ${
          active ? "show" : ""
        }`}
        style={{ zIndex: 0 }}
      ></div>
      <div className="mt-2 text-center">
        <p className="font-semibold">{album.title}</p>
        <p className="text-sm text-gray-500">{album.artist}</p>
      </div>
    </div>
  );
};

export default AlbumCard;
