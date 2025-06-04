import { FC, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Album } from './AlbumCard';

interface Props {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
}

const AlbumDetail: FC<Props> = ({ album, isOpen, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (isOpen && audio) {
      audio.play();
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && album && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* 彈出視窗 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl z-50 w-[480px]"
          >
            <div className="flex gap-6">
              {/* 專輯封面 */}
              <div className="w-48 h-48 relative">
                <Image
                  src={album.cover}
                  alt={album.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              
              {/* 專輯資訊 */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{album.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{album.artist}</p>
                <p className="text-gray-700 mb-4">{album.description}</p>
                
                {/* 曲目列表 */}
                <div className="space-y-2">
                  <p className="font-medium">曲目：</p>
                  <p>1. {album.track1}</p>
                  <p>2. {album.track2}</p>
                </div>
              </div>
            </div>
            
            {/* 評論 */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600 italic">&ldquo;{album.comment}&rdquo;</p>
            </div>
            
            {/* 關閉按鈕 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* 音訊播放器（隱藏） */}
            <audio ref={audioRef} src={album.track1} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlbumDetail; 