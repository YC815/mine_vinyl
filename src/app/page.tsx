'use client';
import { useState, useEffect } from 'react';
import albums from '@/data/albums.json';
import AlbumCard, { Album } from '@/components/AlbumCard';
import VinylPlayer from '@/components/VinylPlayer';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export default function Home() {
  const [selected, setSelected] = useState<Album | undefined>();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (selected) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selected]);

  const closePopup = () => setSelected(undefined);

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <VinylPlayer album={selected} playing={!!selected} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            active={activeId === album.id}
            onSelect={() => {
              setActiveId(album.id);
              setSelected(album);
            }}
          />
        ))}
      </div>
      <Dialog open={!!selected} onOpenChange={closePopup}>
        <DialogContent className="text-black space-y-2">
          {selected && (
            <>
              <h2 className="text-xl font-bold">{selected.title}</h2>
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
