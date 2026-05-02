'use client';

import React, { useEffect, useState } from 'react';

export const SecurityWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // 1. Block Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Block Common DevTools Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl + Shift + I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
      }
      // Ctrl + Shift + J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
      }
      // Ctrl + U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
      // Print Screen
      if (e.key === 'PrintScreen') {
        alert('Screenshots are disabled for premium content protection.');
        document.body.style.display = 'none';
        setTimeout(() => {
          document.body.style.display = 'block';
        }, 1000);
      }
    };

    // 3. DevTools Detection (Infinite Debugger Loop Trick)
    // This makes the browser hang if devtools is open
    const detectDevTools = () => {
      const start = new Date().getTime();
      debugger;
      const end = new Date().getTime();
      if (end - start > 100) {
        setIsDevToolsOpen(true);
      }
    };

    // 4. Content Protection on Visibility Change (Anti-screenshot/recording)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = 'Neural-Bets - Protected';
      } else {
        document.title = 'Neural-Bets';
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Run devtools detection periodically if you want to be aggressive
    // const interval = setInterval(detectDevTools, 2000);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // clearInterval(interval);
    };
  }, []);

  if (isDevToolsOpen) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Security Violation</h1>
          <p className="text-slate-400 max-w-md">
            Developer tools detection active. To protect our proprietary neural consensus data, 
            access is disabled while inspector tools are open. Please close DevTools to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        body {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>
      {children}
    </>
  );
};
