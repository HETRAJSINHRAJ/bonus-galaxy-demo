'use client';

import { useEffect, useRef, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  animateOn?: 'view' | 'mount';
  className?: string;
  encryptedClassName?: string;
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  animateOn = 'mount',
  className = '',
  encryptedClassName = '',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    setMounted(true);
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (hasStarted.current) return;

    const runAnimation = async () => {
      hasStarted.current = true;
      setIsAnimating(true);

      const chars = text.split('');
      const totalFrames = maxIterations;

      for (let frame = 0; frame <= totalFrames; frame++) {
        if (!isMounted.current) break;

        await new Promise(resolve => setTimeout(resolve, speed));

        if (!isMounted.current) break;

        if (frame === totalFrames) {
          setDisplayText(text);
          setIsAnimating(false);
          return;
        }

        const result = chars.map((char, idx) => {
          if (char === ' ') return ' ';

          let revealFrame: number;
          if (sequential) {
            const progress = revealDirection === 'end'
              ? (chars.length - 1 - idx) / chars.length
              : idx / chars.length;
            revealFrame = Math.floor(progress * totalFrames);
          } else {
            revealFrame = totalFrames - 1;
          }

          if (frame >= revealFrame) {
            return char;
          }

          return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        }).join('');

        setDisplayText(result);
      }

      setDisplayText(text);
      setIsAnimating(false);
    };

    if (animateOn === 'mount') {
      runAnimation();
    } else if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && !hasStarted.current) {
            observer.disconnect();
            runAnimation();
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }
  }, [text, speed, maxIterations, sequential, revealDirection, animateOn]);

  useEffect(() => {
    if (!isAnimating && hasStarted.current) {
      setDisplayText(text);
    }
  }, [text, isAnimating]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <span ref={elementRef} className={className}>
        {text}
      </span>
    );
  }

  return (
    <span ref={elementRef} className={isAnimating ? encryptedClassName : className}>
      {displayText}
    </span>
  );
}
