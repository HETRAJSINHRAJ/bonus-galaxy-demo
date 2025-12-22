'use client';

import { useEffect } from 'react';

// Initialize error suppression immediately (before component mounts)
// This is critical for Chrome translation which modifies DOM before React hydration
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const errorMessage = args[0]?.toString() || '';
    const errorString = JSON.stringify(args);
    
    // Suppress DOM manipulation errors (occurs with Chrome translation and portals)
    if (
      errorMessage.includes('removeChild') ||
      errorMessage.includes('insertBefore') ||
      errorMessage.includes('Failed to execute') ||
      errorMessage.includes('not a child of this node') ||
      errorString.includes('removeChild') ||
      errorString.includes('insertBefore') ||
      errorString.includes('removeChildFromContainer') ||
      errorString.includes('insertOrAppendPlacementNode')
    ) {
      // Silently ignore these errors - they're caused by Chrome translation
      return;
    }
    
    // Call original for all other errors
    originalError(...args);
  };
  
  console.warn = (...args: any[]) => {
    const warnMessage = args[0]?.toString() || '';
    
    // Suppress portal-related warnings
    if (
      warnMessage.includes('removeChild') ||
      warnMessage.includes('insertBefore') ||
      warnMessage.includes('not a child')
    ) {
      return;
    }
    
    originalWarn(...args);
  };
}

/**
 * ErrorSuppressor component to suppress known Next.js Turbopack portal errors
 * Especially important for Chrome translation which modifies the DOM
 */
export function ErrorSuppressor() {
  useEffect(() => {
    // Detect if Chrome translation is active
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          // Chrome adds 'translated-ltr' or 'translated-rtl' class
          if (target.classList && (target.classList.contains('translated-ltr') || target.classList.contains('translated-rtl'))) {
            // Chrome translation is active - suppress all portal errors
            console.info('Chrome translation detected - portal error suppression active');
          }
        }
      });
    });
    
    // Observe the html element for translation
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return null;
}
