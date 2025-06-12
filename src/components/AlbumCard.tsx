import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  id?: string;
}

const AlbumCard: FC<Props> = ({ 
  album, 
  active, 
  onSelect, 
  id 
}) => {
  return (
    <motion.div
      id={id}
      className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg"
      style={{
        width: '224px',
        height: '224px',
        border: active ? '2px solid #3b82f6' : '2px solid transparent', // active 時顯示藍色邊框
        transition: 'border-color 0.3s ease',
      }}
      whileHover={!active ? { scale: 1.05, y: -5 } : {}}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 20 },
        y: { type: "spring", stiffness: 300, damping: 20 },
      }}
      onClick={!active ? onSelect : undefined}
    >
      <Image
        src={album.cover}
        alt={album.title}
        width={224}
        height={224}
        className="object-cover w-full h-full"
      />
    </motion.div>
  );
};

export default AlbumCard;