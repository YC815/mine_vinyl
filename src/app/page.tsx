'use client';
import { useState, useEffect, useRef } from 'react';
import albums from '@/data/albums.json';
import AlbumCard, { Album } from '@/components/AlbumCard';
import VinylPlayer from '@/components/VinylPlayer';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Home() {
  const [selected, setSelected] = useState<Album | undefined>();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [showDialog, setShowDialog] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selected]);

  // 計算唱盤位置
  useEffect(() => {
    const calculatePlayerPosition = () => {
      if (playerRef.current) {
        const rect = playerRef.current.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2) - 95;
        setPlayerPosition({ x: centerX, y: centerY });
      }
    };

    calculatePlayerPosition();
    window.addEventListener('resize', calculatePlayerPosition);
    window.addEventListener('scroll', calculatePlayerPosition);
    return () => {
      window.removeEventListener('resize', calculatePlayerPosition);
      window.removeEventListener('scroll', calculatePlayerPosition);
    };
  }, []);

  const closePopup = () => {
    setShowDialog(false);
    setSelected(undefined);
  };

  const handleAnimationComplete = () => {
    setShowDialog(true);
  };

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <div ref={playerRef}>
        <VinylPlayer album={selected} playing={!!selected} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            active={activeId === album.id}
            onSelect={() => {
              setActiveId(album.id);
              setSelected(album);
            }}
            onAnimationComplete={handleAnimationComplete}
            playerPosition={playerPosition}
          />
        ))}
      </div>
      <Dialog open={showDialog} onOpenChange={closePopup}>
        <DialogContent className="text-black space-y-2">
          {selected && (
            <>
              <DialogTitle className="text-xl font-bold">{selected.title}</DialogTitle>
              <p className="text-sm text-gray-600">{selected.artist}</p>
              <p>{selected.description}</p>
              <p className="font-semibold">My thoughts:</p>
              <p>{selected.comment}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
