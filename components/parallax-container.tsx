'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';

interface ParallaxContainerProps {
  children?: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxContainer({ children, speed = 0.5, className = '' }: ParallaxContainerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isMountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    isMountedRef.current = true;
    
    if (!elementRef.current) return;

    // Add smooth transition
    elementRef.current.style.transition = 'transform 0.1s ease-out';
    elementRef.current.style.willChange = 'transform';

    let ticking = false;

    const handleScroll = () => {
      if (!ticking && isMountedRef.current) {
        rafRef.current = window.requestAnimationFrame(() => {
          if (!elementRef.current || !isMountedRef.current) return;
          
          const rect = elementRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Check if element is in viewport with buffer
          const isInViewport = rect.top < windowHeight && rect.bottom > 0;
          
          if (isInViewport) {
            // Calculate parallax offset relative to viewport center
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const distanceFromCenter = elementCenter - viewportCenter;
            
            // Apply parallax with reduced speed for smoother effect
            const yPos = distanceFromCenter * speed * 0.1;
            elementRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check with small delay to ensure mount
    const timeoutId = setTimeout(handleScroll, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed]);

  // Prevent hydration mismatch - render without transform initially
  if (!mounted) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
