/**
 * MasonryGallery - A high-performance, GSAP-powered Masonry layout component.
 * Features:
 * - Responsive column mapping
 * - GSAP animations for entry and updates
 * - Blur-to-focus and directional entrance effects
 * - Interactive hover states (scale, color shift)
 * - Automatic image preloading for smooth layout calculations
 */

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Trash2 } from 'lucide-react';

/** Hook to handle media queries for responsive columns */
const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    const match = queries.findIndex(q => window.matchMedia(q).matches);
    return values[match] !== undefined ? values[match] : defaultValue;
  };

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

/** Hook to measure element size via ResizeObserver */
const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

/** Utility to ensure images are loaded before layout/animation */
const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

export interface MasonryItem {
  id: string;
  img: string;
  url?: string;
  height: number;
  title?: string;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MasonryGalleryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  className?: string;
  itemClassName?: string;
  onDelete?: (id: string) => void;
}

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  className,
  itemClassName,
  onDelete
}) => {
  const columns = useMedia(
    ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)', '(min-width: 400px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top': return { x: item.x, y: -200 };
      case 'bottom': return { x: item.x, y: window.innerHeight + 200 };
      case 'left': return { x: -200, y: item.y };
      case 'right': return { x: window.innerWidth + 200, y: item.y };
      case 'center': return {
        x: containerRect.width / 2 - item.w / 2,
        y: containerRect.height / 2 - item.h / 2
      };
      default: return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const { grid, containerHeight } = useMemo(() => {
    if (!width) return { grid: [] as GridItem[], containerHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const gap = columns <= 2 ? 12 : 24;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    const gridItems = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = (child.height / 400) * columnWidth;
      const y = colHeights[col];
      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });

    return { grid: gridItems, containerHeight: Math.max(...colHeights) };
  }, [columns, items, width]);

  useLayoutEffect(() => {
    if (!imagesReady || !grid.length) return;

    grid.forEach((item, index) => {
      const element = document.querySelector(`[data-masonry-key="${item.id}"]`);
      if (!element) return;

      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          element,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(20px)' })
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 1.2,
            ease: 'power3.out',
            delay: index * stagger
          }
        );
      } else {
        gsap.to(element, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto'
        });
      }
    });

    if (grid.length > 0) hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (_id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(element, { scale: hoverScale, duration: 0.4, ease: 'power2.out' });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.4 });
    }
  };

  const handleMouseLeave = (_id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(element, { scale: 1, duration: 0.4, ease: 'power2.out' });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.4 });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className ?? ''}`}
      style={{ height: containerHeight, minHeight: '400px' }}
    >
      {grid.map(item => (
        <div
          key={item.id}
          data-masonry-key={item.id}
          className={`absolute overflow-hidden cursor-pointer rounded-xl transition-shadow hover:shadow-2xl group ${itemClassName ?? ''}`}
          style={{
            willChange: 'transform, width, height, opacity, filter',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
          }}
          onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {colorShiftOnHover && (
              <div className="color-overlay absolute inset-0 bg-gradient-to-tr from-cyan-500/40 to-purple-500/40 opacity-0 pointer-events-none transition-opacity" />
            )}
          </div>
          {item.title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs font-medium uppercase tracking-wider">{item.title}</p>
            </div>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to delete this memory?")) {
                  onDelete(item.id);
                }
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-500/80 border border-white/10 text-white/60 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-30 cursor-pointer shadow-md"
              title="Delete memory"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      {grid.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="text-white/20 text-6xl mb-4">📸</div>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">No memories yet</p>
          <p className="text-white/20 font-sans text-xs mt-2">Be the first to post a memory!</p>
        </div>
      )}
    </div>
  );
};

export default MasonryGallery;
