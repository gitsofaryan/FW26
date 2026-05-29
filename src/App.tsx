import { useState, useEffect } from 'react';
import FaultyTerminalBackground from './components/FaultyTerminalBackground';
import MasonryGallery from './components/MasonryGallery';
import type { MasonryItem } from './components/MasonryGallery';
import { Plus, Send, X, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RollingCounter from './components/RollingCounter';
import PillNav from './components/PillNav';

const InstagramIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import type { PillNavItem } from './components/PillNav';
import DeckPlayer from './components/DeckPlayer';
import { PassCard } from './components/PassCard';
import { Hyperspeed, hyperspeedPresets } from './components/Hyperspeed';

/* ─── Navigation Data ─── */
const NAV_ITEMS: PillNavItem[] = [
  { label: 'Home', href: 'main', hoverColor: '#eab308' },
  { label: 'Pass', href: 'pass', hoverColor: '#ef4444' },
  { label: 'Gallery', href: 'gallery', hoverColor: '#22c55e' }
];

/* ─── Gallery Data ─── */
const INITIAL_GALLERY_ITEMS: MasonryItem[] = [
  { id: '1', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600', height: 400, title: 'Mountain Lake' },
  { id: '2', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600', height: 250, title: 'Alpine Meadow' },
  { id: '3', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600', height: 600, title: 'Forest Trail' },
  { id: '4', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600', height: 350, title: 'Coastal Cliffs' },
  { id: '5', img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=600', height: 500, title: 'Desert Dunes' },
  { id: '6', img: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=600', height: 300, title: 'Northern Lights' },
  { id: '7', img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bdb?auto=format&fit=crop&q=80&w=600', height: 450, title: 'Rocky Falls' },
  { id: '8', img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=600', height: 280, title: 'Green Hills' },
  { id: '9', img: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&q=80&w=600', height: 550, title: 'Sunrise Peak' },
  { id: '10', img: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=600', height: 320, title: 'Sunset Valley' },
];

/* ─── Grid Multiplier ─── */
const GRID_MUL: [number, number] = [2, 1];

export default function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'gallery' | 'pass'>('main');
  const [presetKey, setPresetKey] = useState<keyof typeof hyperspeedPresets>('one');
  const [terminalKey] = useState(0);
  const [isPaused] = useState(false);
  const [showMusic, setShowMusic] = useState(true);
  const [galleryKey, setGalleryKey] = useState(0);

  // Dynamic Gallery Items
  const [galleryItems, setGalleryItems] = useState<MasonryItem[]>(INITIAL_GALLERY_ITEMS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  // Modal form states
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostHeight, setNewPostHeight] = useState(300);

  // Farewell Countdown Timer to June 14, 2026, 2:00 PM IST (Indian Standard Time)
  const targetTime = new Date('2026-06-14T14:00:00+05:30').getTime();
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

  // Function to add memory post
  const handleAddPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostImage) return;

    const newItem: MasonryItem = {
      id: Date.now().toString(),
      img: newPostImage,
      height: newPostHeight,
      title: newPostTitle
    };

    setGalleryItems([newItem, ...galleryItems]);
    setNewPostTitle('');
    setNewPostImage('');
    setNewPostHeight(300);
    setIsAddModalOpen(false);
    setGalleryKey(k => k + 1);
  };

  return (
    <div className="relative min-h-screen bg-black font-sans text-white font-medium overflow-x-hidden">

      {/* ═══════════ TOP CENTER WIDE V-SHAPED COUNTDOWN BUCKET ═══════════ */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none w-[92vw] sm:w-[460px]"
        style={{
          height: '60px',
          background: 'rgba(255, 255, 255, 0.25)', // Solid white bezel frame matching terminal borders
          clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)',
          paddingBottom: '2px', // 2px bezel thickness at bottom
          paddingLeft: '2px',  // 2px bezel thickness at left slope
          paddingRight: '2px'  // 2px bezel thickness at right slope
        }}
      >
        <div
          className="w-full h-full bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center px-4 sm:px-10"
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
                fontSize={26}
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
                fontSize={26}
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
                fontSize={26}
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
                fontSize={26}
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

      {/* ═══════════ STREAMLINED PILL NAVIGATION ═══════════ */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex pointer-events-none">
        <PillNav
          logo={null}
          items={NAV_ITEMS}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'gallery') {
              setGalleryKey(k => k + 1);
            }
          }}
          className="pointer-events-auto"
          baseColor="rgba(9, 9, 11, 0.9)"
        />
      </div>

      {/* ═══════════ TAB CONTENT ═══════════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-screen overflow-hidden"
          >
            {/* ───── Section 1: FaultyTerminal Landing ───── */}
            <section className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <FaultyTerminalBackground
                key={terminalKey}
                scale={1.5}
                gridMul={GRID_MUL}
                digitSize={1.2}
                timeScale={1}
                pause={isPaused}
                scanlineIntensity={1.0}
                glitchAmount={1.2}
                flickerAmount={1}
                noiseAmp={1}
                chromaticAberration={2}
                dither={0.1}
                curvature={0.1}
                tint="#ffffff"
                mouseReact={true}
                mouseStrength={0.5}
                pageLoadAnimation={true}
                brightness={1.0}
                className="absolute inset-0 w-full h-full z-0"
              />


              {/* Bottom Left Profile Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-10 left-4 sm:left-10 z-[100000] flex flex-col items-center gap-2 sm:gap-3"
              >
                {/* Silhouette Image / Profile watermark */}
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.6 }}
                  animate={{ 
                    opacity: isProfileHovered ? 1 : 0, 
                    y: isProfileHovered ? 0 : 30, 
                    scale: isProfileHovered ? 1 : 0.6 
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-24 h-24 sm:w-44 sm:h-44 md:w-56 md:h-56 relative pointer-events-none select-none origin-bottom"
                >
                  <img
                    src="/arien_jain.png"
                    alt="arien_jain profile"
                    className="w-full h-full object-contain"
                    style={{ filter: 'invert(50)' }}
                  />
                </motion.div>

                {/* Glassmorphic Instagram button matching other control buttons */}
                <a
                  href="https://instagram.com/arien_jain"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setIsProfileHovered(true)}
                  onMouseLeave={() => setIsProfileHovered(false)}
                  className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-md border border-white/20 bg-white/10 text-white hover:bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold font-mono tracking-wider transition-all shadow-2xl hover:scale-105 cursor-pointer"
                >
                  <InstagramIcon size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                  <span>by arien_jain</span>
                </a>
              </motion.div>


            </section>
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          /* ═══════════ GALLERY TAB ═══════════ */
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-20 bg-black"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center mb-16"
              >
                {/* <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] font-mono mb-3">Memories</p> */}
                {/* <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tight uppercase">
                  Class Gallery
                </h2> */}
                {/* <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" /> */}
              </motion.div>

              <MasonryGallery
                key={galleryKey}
                items={galleryItems}
                animateFrom="bottom"
                blurToFocus={true}
                stagger={0.08}
                scaleOnHover={true}
                hoverScale={0.96}
                colorShiftOnHover={true}
              />
            </div>

            {/* Floating Plus Action Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsAddModalOpen(true)}
              className="fixed bottom-10 right-10 w-14 h-14 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/20 z-40 cursor-pointer border border-cyan-400/20"
            >
              <Plus size={28} />
            </motion.button>
          </motion.div>
        )}

        {activeTab === 'pass' && (
          /* ═══════════ PASS (PRICING & DETAILS) TAB ═══════════ */
          <motion.div
            key="pass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full min-h-screen"
          >
            {/* Hyperspeed Background - fixed to cover entire viewport behind content */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <Hyperspeed
                effectOptions={hyperspeedPresets[presetKey]}
                className="w-full h-full"
              />
            </div>

            {/* Corner Details Decorator */}
            <div className="absolute top-12 left-12 text-[10px] text-white/30 font-mono tracking-tighter pointer-events-none hidden md:block leading-relaxed z-10">
              CORE_SYSTEM_02 // PASS_PROVISIONING_ENG<br />
              SECTOR: 9X-PRICING-B<br />
              WARP_FIELD: {presetKey === 'one' ? '98.4%' : presetKey === 'two' ? '92.1%' : presetKey === 'three' ? '88.7%' : presetKey === 'four' ? '95.6%' : '99.1%'}
            </div>

            {/* Vertical Right-Aligned Preset Selector (floating above the scrollable content) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="fixed top-1/2 right-4 md:right-6 -translate-y-1/2 pointer-events-auto z-50 flex flex-col items-center gap-3"
            >
              <div className="flex flex-col gap-2.5">
                {(Object.keys(hyperspeedPresets) as Array<keyof typeof hyperspeedPresets>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setPresetKey(key)}
                    className={`
                      px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer text-center
                      ${presetKey === key
                        ? 'bg-[#F9F9F9] text-black scale-105 shadow-lg shadow-white/10'
                        : 'bg-black/40 text-white/60 hover:bg-black/60 border border-white/10 backdrop-blur-sm'}
                    `}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Fullscreen non-scrollable container for PassCard */}
            <div className="relative z-10 w-full h-screen flex items-center justify-center overflow-hidden pt-12 pb-16">
              <PassCard
                formUrl="https://docs.google.com/forms/d/e/1FAIpQLSeserd7A5CwQ9j6kn6DlHYxh2-QLRq6TME760itTc_NocNs5Q/viewform"
                className="bg-transparent border-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ ADD MEMORY MODAL ═══════════ */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-bold uppercase font-mono text-cyan-400">Post Memory</h3>
                <p className="text-xs text-white/50 font-mono">Add your contribution to the Class of 2026 boards.</p>
              </div>

              <form onSubmit={handleAddPostSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/40">Memory Title</label>
                  <input
                    type="text"
                    required
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="e.g. Farewell Toast with Batchmates"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/40">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/40">Card Aspect Ratio (Height)</label>
                  <div className="flex gap-2">
                    {[250, 350, 450].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setNewPostHeight(h)}
                        className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer ${newPostHeight === h
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                          }`}
                      >
                        {h === 250 ? 'Compact' : h === 350 ? 'Standard' : 'Tall'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer mt-6 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Send size={14} />
                  <span>Publish Memory</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Music Toggle Button in Top-Right */}
      <div className="fixed top-6 right-6 z-[100000]">
        <button
          onClick={() => setShowMusic(!showMusic)}
          className={`p-3 backdrop-blur-md border border-white/20 rounded-full transition-all shadow-2xl hover:scale-105 cursor-pointer ${showMusic ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'}`}
        >
          <Music size={20} className={showMusic ? "animate-pulse" : ""} />
        </button>
      </div>

      {/* Global Music Player Content (Always mounted, toggled visually via CSS to prevent audio pause) */}
      <div 
        className="fixed right-6 top-20 z-[100000] origin-top-right transition-all duration-300 pointer-events-auto"
        style={{
          opacity: showMusic ? 1 : 0,
          transform: showMusic ? 'scale(0.75)' : 'scale(0.68) translateY(-10px)',
          pointerEvents: showMusic ? 'auto' : 'none'
        }}
      >
        <div className="filter drop-shadow-2xl">
          <DeckPlayer />
        </div>
      </div>

      {/* ═══════════ CRT Overlay (global) ═══════════ */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
