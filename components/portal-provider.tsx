'use client';

import { useEffect, useState } from 'react';

/**
 * PortalProvider ensures a stable portal container exists on the client
 * This prevents removeChild errors with Radix UI portals in Next.js
 */
export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Create a portal root container if it doesn't exist
    if (!document.getElementById('portal-root')) {
      const portalRoot = document.createElement('div');
      portalRoot.id = 'portal-root';
      document.body.appendChild(portalRoot);
    }

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
