import { Album } from "./AlbumCard";
import { FC, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  album?: Album;
  playing: boolean;
}

const VinylPlayer: FC<Props> = ({ album, playing }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (album && audioRef.current) {
      audioRef.current.src = album.track1;
      audioRef.current.play().catch(() => {});
    }
  }, [album]);

  return (
    <div className="w-full flex flex-col items-center" id="player">
      <div className="relative w-64 h-64">
        <motion.div
          className="tonearm absolute right-0 top-1/2 w-28 h-1 bg-gray-300 origin-left"
          animate={{ rotate: playing ? 0 : -45 }}
          transition={{ type: "spring", stiffness: 120 }}
        />
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default VinylPlayer;
