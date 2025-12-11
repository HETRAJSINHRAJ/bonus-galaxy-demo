'use client';

import React, { useRef, useEffect, useState, useMemo, type ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  onAnimationComplete?: () => void;
  startDelay?: number;
}

const SplitText = ({
  text,
  className = '',
  charClassName = '',
  delay = 50,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onAnimationComplete,
  startDelay = 0,
}: SplitTextProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Split text into elements
  const splitElements = useMemo(() => {
    if (splitType === 'chars') {
      return text.split('').map((char, i) => (
        <span
          key={i}
          className={`split-char inline-block ${charClassName}`}
          style={{ opacity: 0 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    } else if (splitType === 'words') {
      return text.split(' ').map((word, i, arr) => (
        <span 
          key={i} 
          className={`split-word inline-block ${charClassName}`}
          style={{ opacity: 0 }}
        >
          {word}
          {i < arr.length - 1 && '\u00A0'}
        </span>
      ));
    } else {
      // lines - treat as single block for simplicity
      return (
        <span className={`split-line inline-block ${charClassName}`} style={{ opacity: 0 }}>
          {text}
        </span>
      );
    }
  }, [text, splitType, charClassName]);

  // Intersection Observer for triggering animation
  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // GSAP Animation
  useGSAP(
    () => {
      if (!isVisible || !containerRef.current) return;

      const targets = containerRef.current.querySelectorAll(
        splitType === 'chars'
          ? '.split-char'
          : splitType === 'words'
          ? '.split-word'
          : '.split-line'
      );

      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          delay: startDelay / 1000,
          onComplete: onAnimationComplete,
        }
      );
    },
    { dependencies: [isVisible, startDelay], scope: containerRef }
  );

  const style = {
    textAlign,
    overflow: 'hidden',
    whiteSpace: 'normal' as const,
    wordWrap: 'break-word' as const,
  };

  const classes = `split-parent ${className}`;

  const Tag = tag as ElementType;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Tag ref={containerRef} style={style} className={classes}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={containerRef} style={style} className={classes}>
      {splitElements}
    </Tag>
  );
};

export default SplitText;
