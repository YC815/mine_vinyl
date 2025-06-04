'use client';
import { useState, useEffect } from 'react';
import albums from '@/data/albums.json';
import AlbumCard, { Album } from '@/components/AlbumCard';
import VinylPlayer from '@/components/VinylPlayer';

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
    <div className="p-8 space-y-8">
      <VinylPlayer album={selected} playing={!!selected} />
      <div className="grid grid-cols-2 gap-8">
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

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={closePopup}
        >
          <div className="bg-white text-black p-4 max-w-md space-y-2">
            <h2 className="text-xl font-bold">{selected.title}</h2>
            <p>{selected.description}</p>
            <p className="font-semibold">My thoughts:</p>
            <p>{selected.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
}
