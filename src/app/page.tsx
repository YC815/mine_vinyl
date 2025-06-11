'use client';
import { useState, useEffect, useRef } from 'react';
import albums from '@/data/albums.json';
import AlbumCard, { Album } from '@/components/AlbumCard';
import TurntablePlayer from '@/components/TurntablePlayer';
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
  const [recordReachedPlayer, setRecordReachedPlayer] = useState(false);

  useEffect(() => {
    if (selected) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // 重置唱片到達狀態
      setRecordReachedPlayer(false);
    } else {
      // 重置唱片到達狀態
      setRecordReachedPlayer(false);
    }
  }, [selected]);

  // 計算唱盤位置
  useEffect(() => {
    const calculatePlayerPosition = () => {
      if (playerRef.current) {
        // 尋找轉盤中心點元素
        const platterBase = playerRef.current.querySelector('#platter-base');
        if (platterBase) {
          const platterRect = platterBase.getBoundingClientRect();
          const centerX = platterRect.left + (platterRect.width / 2);
          // 向上微調 10px
          const centerY = platterRect.top + (platterRect.height / 2) - 10;
          setPlayerPosition({ x: centerX, y: centerY });
        } else {
          const rect = playerRef.current.getBoundingClientRect();
          // 如果找不到轉盤元素，使用預設計算
          const centerX = rect.left + (rect.width / 2);
          const centerY = rect.top + (rect.height / 2);
          setPlayerPosition({ x: centerX, y: centerY });
        }
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

  const handleRecordReachedPlayer = () => {
    setRecordReachedPlayer(true);
  };

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <div ref={playerRef}>
        <TurntablePlayer 
          album={selected} 
          playing={recordReachedPlayer}
        />
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
            onRecordReachedPlayer={handleRecordReachedPlayer}
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
