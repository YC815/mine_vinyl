'use client';
import { useState } from 'react';
import albums from '@/data/albums.json';
import AlbumCard, { Album } from '@/components/AlbumCard';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Home() {
  const [selected, setSelected] = useState<Album | undefined>();
  const [showDialog, setShowDialog] = useState(false);

  const handleSelectAlbum = (album: Album) => {
    setSelected(album);
    setShowDialog(true);
  };

  const closePopup = () => {
    setShowDialog(false);
    // 延遲一點時間重置selected，讓dialog有時間做關閉動畫
    setTimeout(() => {
      setSelected(undefined);
    }, 300);
  };

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <h1 className="text-4xl font-bold text-center text-black">我的黑膠收藏</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {albums.map((album) => (
          <AlbumCard
            id={`album-card-${album.id}`}
            key={album.id}
            album={album}
            active={selected?.id === album.id}
            onSelect={() => handleSelectAlbum(album)}
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
