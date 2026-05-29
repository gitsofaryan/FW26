import React, { useState, useEffect, Suspense, lazy } from 'react';
import type { MasonryItem } from './components/MasonryGallery';
import { Plus, Send, X, Music, Loader2, Upload, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import PillNav from './components/PillNav';
import { fetchGalleryItems, addGalleryItem, deleteGalleryItem } from './lib/gallery';

import type { PillNavItem } from './components/PillNav';
import { hyperspeedPresets } from './components/Hyperspeed';
import CountdownBucket from './components/CountdownBucket';
import imageCompression from 'browser-image-compression';

// Lazy load heavy components
const FaultyTerminalBackground = lazy(() => import('./components/FaultyTerminalBackground'));
const MasonryGallery = lazy(() => import('./components/MasonryGallery'));
const DeckPlayer = lazy(() => import('./components/DeckPlayer'));
const PassCard = lazy(() => import('./components/PassCard').then(module => ({ default: module.PassCard })));
const Hyperspeed = lazy(() => import('./components/Hyperspeed').then(module => ({ default: module.Hyperspeed })));

/* ─── Navigation Data ─── */
const NAV_ITEMS: PillNavItem[] = [
  { label: 'Home', href: 'main', hoverColor: '#eab308' },
  { label: 'Pass', href: 'pass', hoverColor: '#ef4444' },
  { label: 'Gallery', href: 'gallery', hoverColor: '#22c55e' }
];

/* ─── Gallery Data ─── */
const INITIAL_GALLERY_ITEMS: MasonryItem[] = [];

/* ─── Grid Multiplier ─── */
const GRID_MUL: [number, number] = [2, 1];

export default function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'gallery' | 'pass'>('main');
  const [presetKey, setPresetKey] = useState<keyof typeof hyperspeedPresets>('one');
  const [terminalKey] = useState(0);
  const [isPaused] = useState(false);
  const [showMusic, setShowMusic] = useState(true);
  const [galleryKey, setGalleryKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic Gallery Items
  const [galleryItems, setGalleryItems] = useState<MasonryItem[]>(INITIAL_GALLERY_ITEMS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Music active audio play state (for the nav button indicator)
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsAudioPlaying(customEvent.detail.isPlaying);
    };
    window.addEventListener('music:state', handleStateChange);
    return () => window.removeEventListener('music:state', handleStateChange);
  }, []);

  // Click outside to close DeckPlayer
  useEffect(() => {
    if (!showMusic) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is inside player or toggle buttons
      const isPlayerClick = target.closest('.deck-player-container');
      const isToggleClick = target.closest('.music-toggle-btn');

      if (!isPlayerClick && !isToggleClick) {
        setShowMusic(false);
      }
    };

    // Use a tiny timeout to avoid immediate trigger during the opening click
    const timer = setTimeout(() => {
      window.addEventListener('click', handleGlobalClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [showMusic]);


  // Modal form states
  const [newEnrollmentNumber, setNewEnrollmentNumber] = useState('');
  const [newPostHeight, setNewPostHeight] = useState(300);
  const [newPostFile, setNewPostFile] = useState<File | null>(null);

  // Load gallery from Supabase on mount
  useEffect(() => {
    const loadGallery = async () => {
      setGalleryLoading(true);
      const items = await fetchGalleryItems();
      if (items.length > 0) {
        setGalleryItems(items);
      }
      setGalleryLoading(false);
    };
    loadGallery();
  }, []);

  // Function to add memory post (with Supabase integration)
  const handleAddPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnrollmentNumber || !newPostFile) return;
    setIsSubmitting(true);

    try {
      // Compress image before upload
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(newPostFile, options);

      // Try Supabase insert and upload first
      const newItem = await addGalleryItem(newEnrollmentNumber, compressedFile, newPostHeight);
      if (newItem) {
        setGalleryItems(prev => [newItem, ...prev]);
      } else {
        // Fallback: add locally if Supabase fails (create a local object URL for preview)
        const localItem: MasonryItem = {
          id: Date.now().toString(),
          img: URL.createObjectURL(compressedFile),
          height: newPostHeight,
          enrollmentNumber: newEnrollmentNumber,
        };
        setGalleryItems(prev => [localItem, ...prev]);
      }

      setNewEnrollmentNumber('');
      setNewPostHeight(300);
      setNewPostFile(null);
      setIsAddModalOpen(false);
      setGalleryKey(k => k + 1);
    } catch (err) {
      console.error('Error submitting memory:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const success = await deleteGalleryItem(id);
      if (success) {
        setGalleryItems(prev => prev.filter(item => item.id !== id));
        setGalleryKey(k => k + 1);
      } else {
        // Fallback: delete locally if Supabase fails or doesn't find it
        setGalleryItems(prev => prev.filter(item => item.id !== id));
        setGalleryKey(k => k + 1);
      }
    } catch (err) {
      console.error('Error deleting memory:', err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black font-sans text-white font-medium overflow-x-hidden">

      {/* ═══════════ TOP CENTER WIDE V-SHAPED COUNTDOWN BUCKET ═══════════ */}
      <CountdownBucket targetDate="2026-06-14T14:00:00+05:30" isMobile={isMobile} />


      {/* ═══════════ STREAMLINED PILL NAVIGATION & MUSIC TOGGLE ═══════════ */}
      <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-4 pointer-events-none">
        {/* Global Music Toggle Button */}
        <button
          onClick={() => setShowMusic(!showMusic)}
          className={`pointer-events-auto p-2 sm:p-3 backdrop-blur-xl border border-white/40 rounded-full transition-all shadow-2xl hover:scale-105 cursor-pointer flex-shrink-0 music-toggle-btn hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.55)] hover:border-white/50 duration-300 ${showMusic ? 'bg-white text-black font-black font-mono' : 'bg-zinc-950/95 text-white/80'}`}
          title="Toggle player deck"
        >
          <Music size={isMobile ? 16 : 20} className={showMusic ? "animate-pulse" : ""} />
        </button>

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
          className="pointer-events-auto shadow-2xl"
          baseColor="rgba(9, 9, 11, 0.98)"
        />

        {/* Global Play/Pause Control Button */}
        <button
          onClick={() => window.dispatchEvent(new Event('music:toggle'))}
          className={`pointer-events-auto p-2 sm:p-3 backdrop-blur-xl border border-white/40 rounded-full transition-all shadow-2xl hover:scale-105 cursor-pointer flex-shrink-0 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.55)] hover:border-white/50 duration-300 ${isAudioPlaying ? 'bg-zinc-950/95 text-white/90' : 'bg-white/10 text-white/80'}`}
          title={isAudioPlaying ? "Pause Music" : "Play Music"}
        >
          {isAudioPlaying ? <Pause size={isMobile ? 16 : 20} /> : <Play size={isMobile ? 16 : 20} />}
        </button>
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
              <Suspense fallback={<div className="absolute inset-0 bg-black flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500 opacity-50" /></div>}>
                <FaultyTerminalBackground
                  key={terminalKey}
                  scale={1.5}
                  gridMul={GRID_MUL}
                  digitSize={1.2}
                  timeScale={1}
                  pause={isPaused}
                  scanlineIntensity={isMobile ? 0.3 : 1.0}
                  glitchAmount={isMobile ? 1.0 : 1.2}
                  flickerAmount={isMobile ? 0.5 : 1.0}
                  noiseAmp={isMobile ? 0.4 : 1.0}
                  chromaticAberration={isMobile ? 0.0 : 2.0}
                  dither={isMobile ? 0.0 : 0.1}
                  curvature={isMobile ? 0.0 : 0.1}
                  tint="#ffffff"
                  mouseReact={!isMobile}
                  mouseStrength={0.5}
                  pageLoadAnimation={true}
                  brightness={1.0}
                  dpr={isMobile ? 1.0 : 1.5}
                  className="absolute inset-0 w-full h-full z-0"
                />
              </Suspense>



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
            className="min-h-screen pt-24 pb-20 px-3 sm:px-6 md:px-12 lg:px-20 bg-black"
          >
            <div className="max-w-7xl mx-auto">
              {/* Gallery heading removed — clean edge-to-edge layout */}

              {galleryLoading ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-3">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan-500/60">
                    Decrypting Memory Core...
                  </span>
                </div>
              ) : (
                <Suspense fallback={<div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-cyan-500 opacity-50" /></div>}>
                  <MasonryGallery
                    key={galleryKey}
                    items={galleryItems}
                    animateFrom="bottom"
                    blurToFocus={true}
                    stagger={0.08}
                    scaleOnHover={true}
                    hoverScale={0.96}
                    colorShiftOnHover={true}
                    onDelete={handleDeletePost}
                  />
                </Suspense>
              )}
            </div>

            {/* Floating Plus Action Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsAddModalOpen(true)}
              className="fixed bottom-20 right-4 sm:bottom-10 sm:right-10 w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/20 z-40 cursor-pointer border border-cyan-400/20"
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
              <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
                <Hyperspeed
                  effectOptions={hyperspeedPresets[presetKey]}
                  className="w-full h-full"
                />
              </Suspense>
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
              className="fixed top-1/2 right-4 md:right-6 -translate-y-1/2 pointer-events-auto z-50 hidden sm:flex flex-col items-center gap-3"
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

            {/* Responsive container for PassCard — scrollable on small phones */}
            <div
              onClick={() => setActiveTab('main')}
              className="relative z-10 w-full min-h-screen sm:h-screen flex items-center justify-center sm:overflow-hidden pt-16 pb-20 sm:pt-12 sm:pb-16 px-2 sm:px-0 cursor-pointer"
            >
              <div onClick={(e) => e.stopPropagation()} className="cursor-default">
                <Suspense fallback={<div className="w-[300px] h-[400px] bg-zinc-900/50 animate-pulse rounded-2xl" />}>
                  <PassCard
                    formUrl="https://docs.google.com/forms/d/e/1FAIpQLSeserd7A5CwQ9j6kn6DlHYxh2-QLRq6TME760itTc_NocNs5Q/viewform"
                    className="bg-transparent border-none"
                  />
                </Suspense>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ ADD MEMORY MODAL ═══════════ */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-5 sm:space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto cursor-default"
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
                  <label className="text-[10px] font-mono uppercase text-white/40">Enrollment Number</label>
                  <input
                    type="text"
                    required
                    value={newEnrollmentNumber}
                    onChange={(e) => setNewEnrollmentNumber(e.target.value)}
                    placeholder="e.g. FW26-001"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all font-sans"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/40">Upload Image</label>
                  <label className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-dashed border-white/15 hover:border-cyan-500/50 rounded-xl text-sm text-white/50 transition-all cursor-pointer ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload size={16} />
                    <span>{newPostFile ? newPostFile.name : 'Choose a photo...'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewPostFile(file);
                        }
                      }}
                      disabled={isSubmitting}
                    />
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-white/40">Card Aspect Ratio (Height)</label>
                  <div className="flex gap-2">
                    {[250, 350, 450].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setNewPostHeight(h)}
                        disabled={isSubmitting}
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
                  disabled={isSubmitting || !newPostFile}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer mt-6 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Publish Memory</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Music Player Content (Always mounted, toggled visually via CSS to prevent audio pause) */}
      <div className="fixed inset-0 top-[56px] sm:top-[72px] bottom-[72px] sm:bottom-[96px] z-[100000] pointer-events-none flex items-center justify-center">
        <div
          className="transition-all duration-300 pointer-events-auto"
          style={{
            opacity: showMusic ? 1 : 0,
            transform: showMusic ? (isMobile ? 'scale(0.95)' : 'scale(1.0)') : 'scale(0.5) translateY(20px)',
            pointerEvents: showMusic ? 'auto' : 'none'
          }}
        >
          <div className="filter drop-shadow-2xl deck-player-container">
            <Suspense fallback={<div className="w-[320px] h-[400px] bg-zinc-950/80 backdrop-blur-xl animate-pulse rounded-[32px] border border-white/10" />}>
              <DeckPlayer />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ═══════════ CRT Overlay (global) ═══════════ */}
      <div className="crt-overlay" style={{ touchAction: 'none' }} />
      <div className="crt-vignette" style={{ touchAction: 'none' }} />
    </div>
  );
}
