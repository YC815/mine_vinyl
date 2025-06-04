import { FC, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
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
  onAnimationComplete?: () => void;
  playerPosition?: { x: number; y: number };
}

// 動畫階段
enum AnimationStage {
  INITIAL = 'initial',
  RECORD_SLIDE = 'record_slide',
  RECORD_TO_PLAYER = 'record_to_player',
  SPINNING = 'spinning'
}

const AlbumCard: FC<Props> = ({ 
  album, 
  active, 
  onSelect, 
  onAnimationComplete,
  playerPosition = { x: 0, y: 0 }
}) => {
  const [animationStage, setAnimationStage] = useState<AnimationStage>(AnimationStage.INITIAL);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 新增：傾斜效果相關的 motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseDistance = useMotionValue(0);

  // 檢測深色模式
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (active) {
      setAnimationStage(AnimationStage.RECORD_TO_PLAYER);
    } else {
      setAnimationStage(AnimationStage.INITIAL);
    }
  }, [active]);

  // 計算卡片位置
  useEffect(() => {
    const calculateCardPosition = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setCardPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    };

    calculateCardPosition();
    window.addEventListener('resize', calculateCardPosition);
    return () => window.removeEventListener('resize', calculateCardPosition);
  }, []);

  const handleAnimationComplete = () => {
    if (active) {
      switch (animationStage) {
        case AnimationStage.RECORD_TO_PLAYER:
          setAnimationStage(AnimationStage.SPINNING);
          break;
        case AnimationStage.SPINNING:
          if (onAnimationComplete) {
            onAnimationComplete();
          }
          break;
      }
    }
  };

  // 計算動畫位置
  const getAnimationPosition = () => {
    switch (animationStage) {
      case AnimationStage.INITIAL:
        return { x: 0, y: 0 };
      case AnimationStage.RECORD_TO_PLAYER:
      case AnimationStage.SPINNING:
        return { 
          x: playerPosition.x - cardPosition.x,
          y: playerPosition.y - cardPosition.y
        };
      default:
        return { x: 0, y: 0 };
    }
  };

  // 新增：傾斜效果相關的動畫設定
  const rotateX = useSpring(useTransform(y, [-100, 100], [6, -6]), {
    stiffness: 300,
    damping: 20
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-6, 6]), {
    stiffness: 300,
    damping: 20
  });
  const translateZ = useSpring(isHovered ? 8 : 0, {
    stiffness: 300,
    damping: 20
  });

  // 動態陰影效果
  const shadowX = useSpring(useTransform(x, [-100, 100], [-12, 12]), {
    stiffness: 300,
    damping: 30
  });
  const shadowY = useSpring(useTransform(y, [-100, 100], [-12, 12]), {
    stiffness: 300,
    damping: 30
  });
  const shadowBlur = useSpring(useTransform(
    mouseDistance,
    [0, 100],
    [8, 20]
  ), {
    stiffness: 400,
    damping: 25
  });

  // 動態光源效果
  const lightIntensity = useSpring(
    isHovered ? (isDarkMode ? 0.8 : 0.15) : (isDarkMode ? 0.05 : 0.1),
    { stiffness: 300, damping: 20 }
  );

  // 計算合成的陰影效果
  const boxShadow = useTransform(
    [shadowX, shadowY, shadowBlur, translateZ, lightIntensity],
    ([latestX, latestY, latestBlur, latestZ, latestIntensity]: [number, number, number, number, number]) => {
      const shadowColor = isDarkMode
        ? `rgba(255, 255, 255, ${latestIntensity * 0.5})`
        : `rgba(0, 0, 0, 0.5)`;

      const intensity = isHovered ? 1.5 : 1.2;
      const edgeShadow = isDarkMode && isHovered
        ? `, 0px 0px 3px rgba(255, 255, 255, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.2)`
        : '';
      const ambientLight = isDarkMode && isHovered
        ? `, 0 0 20px 5px rgba(255, 255, 255, 0.15)`
        : '';
      const baseShadowOpacity = isDarkMode ? (isHovered ? 0.35 : 0) : (isHovered ? 0.35 : 0.15);
      const shadowSize = isHovered ? 8 : 6;
      const shadowOffset = isHovered ? 3 : 2;
      const lightModeAmbient = !isDarkMode
        ? `, 0 4px 15px rgba(0, 0, 0, ${isHovered ? 0.12 : 0.08})`
        : '';

      return `
        ${-latestX * 0.5}px ${-latestY * 0.5}px ${latestBlur * 0.7 * intensity}px ${shadowColor},
        0px ${shadowOffset + latestZ * 0.2}px ${shadowSize + latestZ}px rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${baseShadowOpacity})${edgeShadow}${ambientLight}${lightModeAmbient}
      `;
    }
  );

  const position = getAnimationPosition();

  // 新增：滑鼠事件處理
  function handleMouseMove(event: React.MouseEvent) {
    if (active) return; // 如果卡片正在播放，不處理傾斜效果
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);

    const distance = Math.sqrt(
      Math.pow(event.clientX - centerX, 2) +
      Math.pow(event.clientY - centerY, 2)
    );
    mouseDistance.set(Math.min(distance, 100));
  }

  function handleMouseEnter() {
    if (!active) {
      setIsHovered(true);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    mouseDistance.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer perspective-1000"
      style={{
        perspective: 1000,
        width: '192px',
        height: '192px',
        rotateX: active ? 0 : rotateX,
        rotateY: active ? 0 : rotateY,
        boxShadow: active ? undefined : boxShadow,
        z: active ? 0 : translateZ,
        border: isDarkMode
          ? isHovered && !active
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "1px solid rgba(255, 255, 255, 0)"
          : "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "0.75rem",
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        willChange: "transform, box-shadow, border"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={!active ? { scale: 1.02 } : undefined}
      transition={{
        scale: { type: "spring", stiffness: 400, damping: 17 },
        boxShadow: { type: "spring", stiffness: 300, damping: 20 }
      }}
      onClick={!active ? onSelect : undefined}
    >
      <motion.div
        style={{
          transform: "translateZ(12px)",
          transformStyle: "preserve-3d",
          filter: isDarkMode && isHovered && !active ? 'brightness(1.15) contrast(1.05)' : 'none',
          transition: 'filter 0.3s ease',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* 專輯圖片 */}
        <Image
          src={album.cover}
          alt={album.title}
          width={192}
          height={192}
          className="object-cover z-10 relative rounded shadow"
          style={{ zIndex: 10 }}
        />
      </motion.div>
      
      {/* 黑膠唱片 */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: position.x,
              y: position.y,
              opacity: 1,
              rotate: animationStage === AnimationStage.SPINNING ? 360 : 0,
            }}
            transition={{
              x: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
                duration: 0.2
              },
              y: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
                duration: 0.2
              },
              rotate: animationStage === AnimationStage.SPINNING ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              } : {
                duration: 0.5,
                ease: "easeInOut"
              }
            }}
            onAnimationComplete={handleAnimationComplete}
            className="record-slide absolute top-1/2 left-0 flex items-center justify-center"
            style={{
              width: 192,
              height: 192,
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 60% 40%, #222 60%, #000 100%),
                repeating-radial-gradient(circle, transparent 0, transparent 5px, rgba(255,255,255,0.08) 7px, transparent 8px)
              `,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              zIndex: 0,
              overflow: 'visible',
            }}
          >
            {/* 中心黃色標籤 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 48,
                height: 48,
                background: '#ffe066',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 2px #222',
                zIndex: 2,
              }}
            />
            {/* 唱片中心孔 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 8,
                height: 8,
                background: '#eee',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                boxShadow: '0 0 2px #888',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 深色模式下的光暈效果 */}
      {isDarkMode && !active && (
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)',
            opacity: 0,
            zIndex: 1,
            transition: 'opacity 0.3s ease'
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0
          }}
          transition={{
            opacity: { duration: 0.3 }
          }}
          onMouseMove={(e) => {
            if (!isHovered) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
            e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
          }}
        />
      )}
    </motion.div>
  );
};

export default AlbumCard;
