"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import MosaicLogoAssembly from './MosaicLogoAssembly';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  // The six-second assembly is the landing moment. Deep links to inner routes
  // (an inquiry link in an email, say) should open straight onto the content.
  const isHome = usePathname() === '/';
  const [splashState, setSplashState] = useState<'visible' | 'sliding' | 'hidden'>(
    isHome ? 'visible' : 'hidden'
  );

  useEffect(() => {
    if (!isHome) return;

    // The animation takes about 4.8 seconds for all tiles to become fully black
    const slideTimer = setTimeout(() => {
      setSplashState('sliding');
    }, 5000);

    // After the 1-second slide transition, unmount the splash screen
    const hideTimer = setTimeout(() => {
      setSplashState('hidden');
    }, 6000);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(hideTimer);
    };
  }, [isHome]);

  return (
    <>
      {splashState !== 'hidden' && (
        <div 
          className={`fixed inset-0 w-screen h-screen z-[100] bg-[#e9e7e2] transition-transform duration-1000 ease-in-out ${
            splashState === 'sliding' ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <MosaicLogoAssembly />
        </div>
      )}
      {/* We render the children underneath so they are fully loaded and visible as the shutter slides up */}
      {children}
    </>
  );
}
