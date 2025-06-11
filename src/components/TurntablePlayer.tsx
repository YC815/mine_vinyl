import React, { FC, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Album } from './AlbumCard';

interface TurntablePlayerProps {
  album?: Album;
  playing: boolean;
  onPlatterReady?: () => void;
}

const TurntablePlayer: FC<TurntablePlayerProps> = ({ album, playing, onPlatterReady }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (album && audioRef.current && playing) {
      audioRef.current.src = album.track1;
      audioRef.current.play().catch(() => {});
    } else if (!playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [album, playing]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="relative w-[500px] h-[280px] bg-zinc-900 rounded-sm shadow-xl">
        {/* 唱盤機身 */}
        <div className="absolute top-0 left-0 w-full h-full bg-zinc-900 rounded-sm border border-zinc-800" style={{ zIndex: 1 }}>
          {/* 唱盤基座 */}
          <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] flex items-center justify-center">
            {/* 左側控制旋鈕 */}
            <div className="absolute top-[20%] left-[5%] w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-zinc-700"></div>
            </div>
            
            {/* 轉盤底座 */}
            <div 
              className="absolute top-[50%] left-[50%] w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800 border border-zinc-700"
              id="platter-base"
              style={{ zIndex: 2 }}
            >
              {/* 轉盤表面（唱片放置處） */}
              <div className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 border border-zinc-700">
                {/* 中心點 */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-400"></div>
                
                {/* 同心圓紋理 */}
                <div className="absolute top-1/2 left-1/2 w-[85%] h-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800"></div>
                <div className="absolute top-1/2 left-1/2 w-[70%] h-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800"></div>
                <div className="absolute top-1/2 left-1/2 w-[55%] h-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800"></div>
                <div className="absolute top-1/2 left-1/2 w-[40%] h-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800"></div>
                <div className="absolute top-1/2 left-1/2 w-[25%] h-[25%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800"></div>
              </div>
            </div>
            
            {/* Logo區域 */}
            <div className="absolute bottom-[5%] left-[15%] text-zinc-500 text-xs font-light tracking-wider" style={{ zIndex: 3 }}>
              audio-technica
            </div>

            {/* 控制按鈕 */}
            <div className="absolute bottom-[10%] right-[10%] flex space-x-3">
              <div className="w-6 h-2 bg-zinc-700 rounded-sm"></div>
              <div className="w-6 h-2 bg-zinc-700 rounded-sm"></div>
            </div>
          </div>
          
          {/* 底部控制區 */}
          <div className="absolute bottom-[3%] left-0 w-full flex justify-center space-x-8">
            <div className="w-4 h-4 rounded-full bg-zinc-800"></div>
            <div className="w-4 h-4 rounded-full bg-zinc-800"></div>
            <div className="w-4 h-4 rounded-full bg-zinc-800"></div>
          </div>
        </div>
        
        {/* 唱臂基座和唱臂（獨立於機身，以獲得更高的 z-index） */}
        <div 
          className="absolute top-[calc(10%+24px)] right-[calc(10%+16px)] w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700"
          style={{ zIndex: 5 }}
        ></div>
        <motion.div
          className="absolute top-[calc(10%+34px)] right-[calc(10%+38px)] w-32 h-1.5 bg-zinc-600 origin-right"
          animate={{ rotate: playing ? 25 : -25 }}
          transition={{ type: "spring", stiffness: 120, delay: playing ? 0.5 : 0 }}
          style={{ zIndex: 5 }}
        >
          {/* 唱針 */}
          <div className="absolute -right-1 -bottom-5 w-4 h-6 bg-zinc-700 rounded-b-sm">
             <div className="w-full h-1/2 bg-zinc-500"></div>
          </div>
        </motion.div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default TurntablePlayer; 