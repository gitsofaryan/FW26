/**
 * PillNav - A premium, GSAP-powered navigation component.
 * Features:
 * - Rising circle background animation on hover
 * - Rotating logo animation
 * - Custom Share Tech Mono font and white bezel styling matching the countdown clock
 * - Custom tab switching state integration
 */

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';


export type PillNavItem = {
  label: string;
  href: 'main' | 'gallery' | 'pass';
  ariaLabel?: string;
  hoverColor?: string;
};

export interface PillNavProps {
  /** Logo icon component */
  logo: React.ReactNode;
  /** Navigation items array */
  items: PillNavItem[];
  /** The current active tab for highlighting */
  activeTab?: 'main' | 'gallery' | 'pass';
  /** Callback to trigger React state tab switching */
  onTabChange?: (tab: 'main' | 'gallery' | 'pass') => void;
  /** Optional extra class names for the nav container */
  className?: string;
  /** GSAP easing function */
  ease?: string;
  /** Background color of nav parts */
  baseColor?: string;
  /** The color of individual pills */
  pillColor?: string;
  /** Text color when hovered */
  hoveredPillTextColor?: string;
  /** Default text color for pills */
  pillTextColor?: string;
  /** Whether to play an entrance animation on mount */
  initialLoadAnimation?: boolean;
}

export const PillNav: React.FC<PillNavProps> = ({
  logo,
  items,
  activeTab,
  onTabChange,
  className = '',
  ease = 'power3.out',
  baseColor = '#09090b',
  pillColor = 'rgba(255, 255, 255, 0.04)',
  hoveredPillTextColor = '#000000',
  pillTextColor = '#ffffff',
  initialLoadAnimation = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLDivElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const [compact, setCompact] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setCompact(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderLogo = () => {
    if (!logo) return null;
    return (
      <div ref={logoImgRef} className="flex items-center justify-center text-white">
        {logo}
      </div>
    );
  };

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;
        
        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        
        // Calculate the radius for the expanding circle to cover the pill
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;
        
        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');
        
        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        
        tl.to(circle, { 
          scale: 1.25, 
          xPercent: -50, 
          duration: 0.7, 
          ease, 
          overwrite: 'auto' 
        }, 0);
        
        if (label) {
          tl.to(label, { 
            y: -(h + 8), 
            duration: 0.5, 
            ease, 
            overwrite: 'auto' 
          }, 0);
        }
        
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 20), opacity: 0 });
          tl.to(white, { 
            y: 0, 
            opacity: 1, 
            duration: 0.5, 
            ease, 
            overwrite: 'auto' 
          }, 0);
        }
        
        tlRefs.current[index] = tl;
      });
    };

    layout();
    
    const onResize = () => layout();
    window.addEventListener('resize', onResize);
    
    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    // Initial load animation
    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;
      
      if (logo) {
        gsap.set(logo, { scale: 0, opacity: 0 });
        gsap.to(logo, {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.5)"
        });
      }
      
      if (navItems) {
        const listItems = navItems.querySelectorAll('li');
        gsap.set(listItems, { opacity: 0, x: 20 });
        gsap.to(listItems, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.15
        });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.35,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.25,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      overwrite: 'auto',
      onComplete: () => gsap.set(img, { rotate: 0 })
    });
  };

  const handleItemClick = (e: React.MouseEvent, href: 'main' | 'gallery' | 'pass') => {
    e.preventDefault();
    onTabChange?.(href);
  };

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': pillTextColor,
    '--nav-h': compact ? '48px' : '56px',
    '--pill-pad-x': compact ? '14px' : '24px',
    '--pill-gap': compact ? '6px' : '8px'
  } as React.CSSProperties;

  return (
    <div 
      ref={containerRef}
      className={`relative p-[2px] rounded-full shadow-xl max-w-sm mx-auto select-none ${className}`} 
      style={{ 
        ...cssVars, 
        fontFamily: '"Share Tech Mono", monospace',
        background: 'rgba(255, 255, 255, 0.45)' // Solid white bezel frame matching terminal borders
      }}
    >
      <div
        className="flex items-center justify-center p-1.5 rounded-full backdrop-blur-xl"
        style={{ background: 'var(--base)' }}
      >
        {/* Logo container (only if logo provided) */}
        {logo && (
          <div 
            ref={logoRef}
            onMouseEnter={handleLogoEnter}
            className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer mr-2"
            style={{
              width: 'calc(var(--nav-h) - 10px)',
              height: 'calc(var(--nav-h) - 10px)'
            }}
          >
            {renderLogo()}
          </div>
        )}

        {/* Main Nav Pills Container */}
        <div
          ref={navItemsRef}
          className="flex items-center rounded-full"
          style={{ height: 'calc(var(--nav-h) - 10px)' }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-0 h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = activeTab === item.href;
              
              const pillStyle: React.CSSProperties = {
                background: 'var(--pill-bg)',
                color: 'var(--pill-text)',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)'
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: item.hoverColor || '#ffffff', 
                      willChange: 'transform'
                    }}
                    aria-hidden="true"
                    ref={el => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-none z-[2] overflow-hidden py-1">
                    <span
                      className="pill-label relative z-[2] inline-block font-bold text-xs sm:text-sm tracking-widest"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-1 z-[3] inline-block w-full text-center font-bold text-xs sm:text-sm tracking-widest"
                      style={{
                        color: 'var(--hover-text)',
                        willChange: 'transform, opacity'
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 rounded-full z-[4]"
                      style={{ background: item.hoverColor || '#ffffff' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses = "relative overflow-hidden inline-flex items-center justify-center h-full self-center no-underline rounded-full box-border font-medium uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:z-10";

              return (
                <li key={item.href} role="none" className="flex items-center">
                  <a
                    role="menuitem"
                    href={`#${item.href}`}
                    onClick={(e) => handleItemClick(e, item.href)}
                    className={basePillClasses}
                    style={pillStyle}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    {PillContent}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PillNav;
