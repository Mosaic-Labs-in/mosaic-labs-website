"use client";

import React, { useState, useEffect } from 'react';
import MosaicLogoAssembly from './MosaicLogoAssembly';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // The animation takes about 4.2 seconds to fully settle
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 w-screen h-screen z-50">
        <MosaicLogoAssembly />
      </div>
    );
  }

  return <>{children}</>;
}
