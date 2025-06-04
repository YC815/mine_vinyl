import { FC } from "react";
import { motion } from "framer-motion";

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

const tilt = {
  hover: {
    rotateX: -5,
    rotateY: 5,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const AlbumCard: FC<Props> = ({ album, active, onSelect }) => {
  return (
    <motion.div
      variants={tilt}
      whileHover="hover"
      className="relative cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={onSelect}
    >
      <img
        src={album.cover}
        alt={album.title}
        className="w-48 h-48 object-cover z-10 relative rounded shadow"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: active ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="record-slide absolute top-1/2 -translate-y-1/2 right-0 w-32 h-32 rounded-full bg-black"
        style={{ zIndex: 0 }}
      />
    </motion.div>
  );
};

export default AlbumCard;
