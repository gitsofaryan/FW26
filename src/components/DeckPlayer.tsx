import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeckCard from './DeckCard';
import type { Song } from './DeckCard';

// Original Data - Restored Gen-Z / Light Mode
const SONGS: Song[] = [
  {
    id: '1',
    title: "Billie Jean",
    artist: "Michael Jackson",
    cover: "https://images.unsplash.com/photo-1618609377864-68609b857e90?q=80&w=1000&auto=format&fit=crop",
    duration: "04:54:00",
    bgGradient: "#fee2e2", // Light Red
    headerText: "THRILLER CLASSIC",
    subText: "The legendary chart-topping pop masterpiece",
    youtubeId: "Zi_XLOBDo_Y"
  },
  {
    id: '2',
    title: "Move (Yeh Ishq)",
    artist: "Sonu Nigam & Shashwat Sachdev",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop",
    duration: "02:30:00",
    bgGradient: "#ffedd5", // Light Orange
    headerText: "BOLLYWOOD GLIDE",
    subText: "High energy fusion of classic and modern beats",
    youtubeId: "SYsTrlxrRss"
  },
  {
    id: '3',
    title: "Hum Pyaar Karne Wale",
    artist: "Udit Narayan, Anuradha Paudwal & Qveen Herby",
    cover: "https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=1000&auto=format&fit=crop",
    duration: "03:40:00",
    bgGradient: "#ccfbf1", // Light Teal
    headerText: "BOLLYWOOD REVENGE",
    subText: "The iconic melody remixed with modern synth beats",
    youtubeId: "Th2Op6uvNXw"
  },
  {
    id: '4',
    title: "Can't Be Broke",
    artist: "Rick Ross feat. Yungeen Ace",
    cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1000&auto=format&fit=crop",
    duration: "00:48:00",
    bgGradient: "#dbeafe", // Light Blue
    headerText: "MOTION FACTORY",
    subText: "Best Suited For Freelancers, Content Creators",
    youtubeId: "V8XrBwviKpM"
  },
  {
    id: '5',
    title: "Midnight City",
    artist: "M83",
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
    duration: "04:03:00",
    bgGradient: "#f3e8ff", // Light Purple
    headerText: "NEON DREAMS",
    subText: "Synth-pop anthems for late night drives",
    youtubeId: "dX3k_QDnzHE"
  },
  {
    id: '6',
    title: "Starboy",
    artist: "The Weeknd",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
    duration: "03:50:00",
    bgGradient: "#ffe4e6", // Light Red/Pink
    headerText: "STAR POWER",
    subText: "Chart topping hits from the modern legend",
    youtubeId: "34Na4j8AVgA"
  },
  {
    id: '7',
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    duration: "03:23:00",
    bgGradient: "#e0f2fe", // Light Sky
    headerText: "FUTURE NOSTALGIA",
    subText: "Retro disco vibes reimaged for today",
    youtubeId: "TUVcZfQe-Kw"
  },
  {
    id: '8',
    title: "APT.",
    artist: "ROSÉ & Bruno Mars",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop",
    duration: "02:50:00",
    bgGradient: "#fce7f3", // Light Pink
    headerText: "APARTMENT BEATS",
    subText: "The record-breaking pop sensation that swept the globe",
    youtubeId: "APx7k41mB-M"
  },
  {
    id: '9',
    title: "AAAHH MEN!",
    artist: "Doja Cat",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    duration: "02:01:00",
    bgGradient: "#f5f5f4", // Light Stone/Grey
    headerText: "VIE SELECTION",
    subText: "Doja Cat's bold, experimental rap track",
    youtubeId: "j41x542qL8c"
  },
  {
    id: '10',
    title: "Run Down The City (Monica)",
    artist: "Reble, Shashwat Sachdev, Asha Bhosle & R.D. Burman",
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop",
    duration: "02:44:00",
    bgGradient: "#ecfeff", // Light Cyan
    headerText: "CITY DRIFT",
    subText: "High-speed retro Bollywood fusion",
    youtubeId: "hosbQVvlais"
  },
  {
    id: '11',
    title: "Beat It",
    artist: "Michael Jackson",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop",
    duration: "04:18:00",
    bgGradient: "#fee2e2", // Light Red
    headerText: "THRILLER LEGEND",
    subText: "Beat it, beat it, no one wants to be defeated",
    youtubeId: "8fO8jVZ3T9g"
  }
];

const swipeVariants = {
  enter: () => ({
    scale: 0.95,
    y: -20,
    opacity: 0.6,
    zIndex: 2,
    x: 0,
  }),
  center: {
    zIndex: 3,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const
    }
  },
  exit: (direction: number) => ({
    zIndex: 3,
    x: direction > 0 ? 250 : -250,
    opacity: 0,
    scale: 1,
    rotate: direction > 0 ? 10 : -10,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
};

export default function DeckPlayer() {
  const [currentIndex, setCurrentIndex] = useState(4);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNext = () => {
    setDirection(1);
    const nextIdx = (currentIndex + 1) % SONGS.length;
    setCurrentIndex(nextIdx);
    setIsPlaying(true);
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${SONGS[nextIdx].youtubeId}?autoplay=1&mute=0&enablejsapi=1`;
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    const prevIdx = (currentIndex - 1 + SONGS.length) % SONGS.length;
    setCurrentIndex(prevIdx);
    setIsPlaying(true);
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${SONGS[prevIdx].youtubeId}?autoplay=1&mute=0&enablejsapi=1`;
    }
  };

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (iframeRef.current) {
      if (nextPlaying) {
        iframeRef.current.src = `https://www.youtube.com/embed/${SONGS[currentIndex].youtubeId}?autoplay=1&mute=0&enablejsapi=1`;
      } else {
        iframeRef.current.src = '';
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, isPlaying]);

  const activeSong = SONGS[currentIndex];
  const nextSong = SONGS[(currentIndex + 1) % SONGS.length];
  const nextNextSong = SONGS[(currentIndex + 2) % SONGS.length];

  return (
    <div className="relative w-[300px] h-[340px] flex items-center justify-center perspective-[1000px]">
      
      {/* Background Stack 2 */}
      <motion.div
        key={`bg2-${nextNextSong.id}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        initial={{ scale: 0.85, y: -40, opacity: 0 }}
        animate={{
          scale: 0.9,
          y: -40,
          zIndex: 1,
          opacity: 0.6 
        }}
        transition={{ duration: 0.4 }}
      >
         <DeckCard 
            song={nextNextSong} 
            isPlaying={false}
            onTogglePlay={() => {}}
            onNext={() => {}}
            onPrev={() => {}}
            index={currentIndex + 2}
            isBackground={true}
          />
      </motion.div>

      {/* Background Stack 1 */}
      <motion.div
        key={`bg1-${nextSong.id}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        initial={{ scale: 0.9, y: -20, opacity: 0.3 }}
        animate={{
          scale: 0.95,
          y: -20,
          zIndex: 2,
          opacity: 0.8 
        }}
        transition={{ duration: 0.4 }}
      >
         <DeckCard 
            song={nextSong} 
            isPlaying={false}
            onTogglePlay={() => {}}
            onNext={() => {}}
            onPrev={() => {}}
            index={currentIndex + 1}
            isBackground={true}
          />
      </motion.div>

      {/* Active Card */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={activeSong.id}
          custom={direction}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full z-30 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-[24px]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(_, { offset }) => {
            const swipe = offset.x;
            if (swipe < -80) {
              handlePrev();
            } else if (swipe > 80) {
              handleNext();
            }
          }}
        >
          <DeckCard 
            song={activeSong} 
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
            index={currentIndex}
          />
        </motion.div>
      </AnimatePresence>

      {/* Hidden YouTube Player Iframe to play song audio without showing video */}
      <iframe
        ref={iframeRef}
        width="0"
        height="0"
        src={isPlaying && activeSong.youtubeId ? `https://www.youtube.com/embed/${activeSong.youtubeId}?autoplay=1&mute=0&enablejsapi=1` : ''}
        title="Audio Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
      />
    </div>
  );
}
