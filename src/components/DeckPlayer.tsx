import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeckCard from './DeckCard';
import type { Song } from './DeckCard';

// Original Data - Restored Gen-Z / Light Mode
const SONGS: Song[] = [
  {
    id: '3',
    title: "Hum Pyaar Karne Wale",
    artist: "Udit Narayan, Anuradha Paudwal & Qveen Herby",
    cover: "/hum_pyaar_cover.jpg",
    duration: "03:40:00",
    bgGradient: "#ccfbf1", // Light Teal
    headerText: "BOLLYWOOD REVENGE",
    subText: "The iconic melody remixed with modern synth beats",
    youtubeId: "Th2Op6uvNXw"
  },
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
    youtubeId: "ekr2nIex040"
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
    youtubeId: "w6VZ4qm-e0w"
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
    x: typeof window !== 'undefined' && window.innerWidth < 640
      ? (direction > 0 ? 200 : -200)
      : (direction > 0 ? 250 : -250),
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const playerRef = useRef<any>(null);
  const [apiReady, setApiReady] = useState(false);

  // Setup handler references to avoid stale closure gotchas in callbacks
  const nextHandlerRef = useRef<() => void>(() => {});
  nextHandlerRef.current = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SONGS.length);
    setIsPlaying(true);
  };

  const handleNext = () => {
    nextHandlerRef.current();
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Initialize YT API once on mount
  useEffect(() => {
    // Preload all song covers for instantaneous swiping
    SONGS.forEach(song => {
      const img = new Image();
      img.src = song.cover;
    });

    const initPlayer = () => {
      const YT = (window as any).YT;
      if (!YT || !YT.Player || playerRef.current) return;

      playerRef.current = new YT.Player('youtube-audio-player', {
        height: '0',
        width: '0',
        videoId: SONGS[currentIndex].youtubeId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1
        },
        events: {
          onReady: () => {
            setApiReady(true);
            if (isPlaying) {
              playerRef.current.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (event.data === YT.PlayerState.ENDED) {
              // Seamless continuous playback
              nextHandlerRef.current();
            }
          }
        }
      });
    };

    const YT = (window as any).YT;
    if (YT && YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }
  }, []);

  // Synchronize state changes with the player
  useEffect(() => {
    if (!playerRef.current || typeof playerRef.current.loadVideoById !== 'function') return;

    try {
      const currentVideoId = playerRef.current.getVideoData?.()?.video_id;
      const targetVideoId = SONGS[currentIndex].youtubeId;

      if (currentVideoId !== targetVideoId) {
        if (isPlaying) {
          playerRef.current.loadVideoById(targetVideoId);
        } else {
          playerRef.current.cueVideoById(targetVideoId);
        }
      } else {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      }
    } catch (e) {
      console.warn("YouTube Player Control Error:", e);
    }
  }, [currentIndex, isPlaying, apiReady]);

  // Sync state changes with the outside world
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('music:state', { detail: { isPlaying } }));
  }, [isPlaying]);

  // Listen to remote commands from navigation
  useEffect(() => {
    const handlePauseMusic = () => {
      setIsPlaying(false);
    };
    const handlePlayMusic = () => {
      setIsPlaying(true);
    };
    const handleToggleMusic = () => {
      setIsPlaying((prev) => !prev);
    };

    window.addEventListener('music:pause', handlePauseMusic);
    window.addEventListener('music:play', handlePlayMusic);
    window.addEventListener('music:toggle', handleToggleMusic);
    return () => {
      window.removeEventListener('music:pause', handlePauseMusic);
      window.removeEventListener('music:play', handlePlayMusic);
      window.removeEventListener('music:toggle', handleToggleMusic);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
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
    <div className="relative w-[320px] h-[400px] sm:w-[400px] sm:h-[480px] flex items-center justify-center perspective-[1000px]">
      
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

      {/* Hidden YouTube Player Target Div */}
      <div id="youtube-audio-player" className="absolute w-0 h-0 opacity-0 pointer-events-none" />
    </div>
  );
}
