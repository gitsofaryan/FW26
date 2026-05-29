import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import Waveform from './Waveform';

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  bgGradient: string;
  headerText: string;
  subText: string;
  youtubeId?: string;
}

interface CardProps {
  song: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  index: number;
  isBackground?: boolean;
}

export default function DeckCard({ song, isPlaying, onTogglePlay, onNext, onPrev, isBackground = false }: CardProps) {
  return (
    <div className={`relative w-full h-full bg-white rounded-[24px] overflow-hidden flex flex-col border border-zinc-200 transition-all ${isBackground ? 'brightness-95 grayscale-[0.3] shadow-none' : 'shadow-[0_8px_30px_rgba(0,0,0,0.1)] ring-1 ring-black/5'}`}>
      
      {/* Enhanced glow effect for light mode */}
      {!isBackground && (
        <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] pointer-events-none z-20" />
      )}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none transition-colors duration-500"
        style={{ background: `linear-gradient(to bottom, ${song.bgGradient}, #ffffff)` }}
      />
      
      {/* Card Content */}
      <div className="flex-1 px-6 flex flex-col relative z-10 pt-6 justify-start">
        <motion.h1 
          layoutId={`header-${song.id}`}
          className="font-sans text-3xl font-black tracking-tighter text-black mb-1 leading-none"
        >
          {song.headerText}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-xs text-zinc-500 max-w-[90%] font-medium tracking-tight"
        >
          {song.subText}
        </motion.p>
      </div>

      {/* Spotify-style Player Section */}
      <div className="p-3 relative z-10">
        <div className="bg-zinc-900 rounded-[20px] p-4 flex flex-col gap-3 shadow-xl relative overflow-hidden group">
          
          {/* Top Info Row */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 shadow-md">
               <img src={song.cover} alt="cover" loading="lazy" width="48" height="48" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-white font-bold text-sm truncate">{song.title}</h3>
              <p className="text-zinc-400 text-xs truncate">{song.artist}</p>
            </div>
          </div>
          
          {/* Waveform / Progress */}
          <div className="flex items-center gap-2">
             <div className="flex-1 h-4 flex items-center">
                <Waveform isPlaying={isPlaying} />
             </div>
             <span className="text-[10px] font-medium text-zinc-400">{song.duration}</span>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between px-2 pt-1">
             <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
               <Shuffle size={16} />
             </button>
             
             <div className="flex items-center gap-4">
               <button onClick={onPrev} className="text-white hover:scale-110 transition-transform cursor-pointer">
                 <SkipBack size={20} fill="currentColor" />
               </button>
               <button onClick={onTogglePlay} className="text-black bg-white hover:scale-105 transition-transform p-2 rounded-full cursor-pointer">
                 {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
               </button>
               <button onClick={onNext} className="text-white hover:scale-110 transition-transform cursor-pointer">
                 <SkipForward size={20} fill="currentColor" />
               </button>
             </div>
             
             <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
               <Repeat size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
