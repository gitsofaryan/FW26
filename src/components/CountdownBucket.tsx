import { useState, useEffect } from 'react';
import RollingCounter from './RollingCounter';

interface CountdownBucketProps {
  targetDate: string;
  isMobile: boolean;
}

export default function CountdownBucket({ targetDate, isMobile }: CountdownBucketProps) {
  const targetTime = new Date(targetDate).getTime();
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = Date.now();
    return Math.max(0, targetTime - now);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setTimeLeft(Math.max(0, targetTime - now));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none w-[88vw] sm:w-[460px]"
      style={{
        height: isMobile ? '56px' : '72px',
        background: 'rgba(255, 255, 255, 0.45)',
        clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)',
        paddingBottom: '2px',
        paddingLeft: '2px',
        paddingRight: '2px'
      }}
    >
      <div
        className="w-full h-full bg-zinc-950 flex items-center justify-center px-4 sm:px-10 py-1.5 sm:py-2"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)'
        }}
      >
        <div
          className="flex items-center justify-between w-full text-white font-mono leading-none text-sm sm:text-base"
          style={{ fontFamily: '"Share Tech Mono", monospace' }}
        >
          {/* Days */}
          <div className="flex items-center">
            <RollingCounter
              value={days}
              places={[10, 1]}
              fontSize={isMobile ? 20 : 26}
              textColor="#ffffff"
              fontWeight={700}
              gradientFrom="#09090b"
              gradientHeight={6}
              gap={3}
              borderRadius={4}
              horizontalPadding={4}
              digitStyle={{ fontFamily: '"Share Tech Mono", monospace' }}
            />
            <span className="text-white/40 font-bold text-xs uppercase pl-2 mt-1">D</span>
          </div>

          {/* Separator */}
          <span className="text-white/30 font-black text-xl px-1.5 animate-pulse select-none">:</span>

          {/* Hours */}
          <div className="flex items-center">
            <RollingCounter
              value={hours}
              places={[10, 1]}
              fontSize={isMobile ? 20 : 26}
              textColor="#ffffff"
              fontWeight={700}
              gradientFrom="#09090b"
              gradientHeight={6}
              gap={3}
              borderRadius={4}
              horizontalPadding={4}
              digitStyle={{ fontFamily: '"Share Tech Mono", monospace' }}
            />
            <span className="text-white/40 font-bold text-xs uppercase pl-2 mt-1">H</span>
          </div>

          {/* Separator */}
          <span className="text-white/30 font-black text-xl px-1.5 animate-pulse select-none">:</span>

          {/* Minutes */}
          <div className="flex items-center">
            <RollingCounter
              value={minutes}
              places={[10, 1]}
              fontSize={isMobile ? 20 : 26}
              textColor="#ffffff"
              fontWeight={700}
              gradientFrom="#09090b"
              gradientHeight={6}
              gap={3}
              borderRadius={4}
              horizontalPadding={4}
              digitStyle={{ fontFamily: '"Share Tech Mono", monospace' }}
            />
            <span className="text-white/40 font-bold text-xs uppercase pl-2 mt-1">M</span>
          </div>

          {/* Separator */}
          <span className="text-white/30 font-black text-xl px-1.5 animate-pulse select-none">:</span>

          {/* Seconds */}
          <div className="flex items-center">
            <RollingCounter
              value={seconds}
              places={[10, 1]}
              fontSize={isMobile ? 20 : 26}
              textColor="#ffffff"
              fontWeight={700}
              gradientFrom="#09090b"
              gradientHeight={6}
              gap={3}
              borderRadius={4}
              horizontalPadding={4}
              digitStyle={{ fontFamily: '"Share Tech Mono", monospace' }}
            />
            <span className="text-white/40 font-bold text-xs uppercase pl-2 mt-1">S</span>
          </div>
        </div>
      </div>
    </div>
  );
}
