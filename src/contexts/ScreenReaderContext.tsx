'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ScreenReaderContextType {
  isScreenReaderMode: boolean;
  announcements: string[];
  toggleScreenReaderMode: () => void;
  announce: (message: string) => void;
  clearAnnouncements: () => void;
}

const ScreenReaderContext = createContext<ScreenReaderContextType | undefined>(undefined);

export function useScreenReader() {
  const context = useContext(ScreenReaderContext);
  if (!context) {
    throw new Error('useScreenReader must be used within ScreenReaderProvider');
  }
  return context;
}

interface ScreenReaderProviderProps {
  children: ReactNode;
}

export function ScreenReaderProvider({ children }: ScreenReaderProviderProps) {
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Detect screen reader automatically
  useEffect(() => {
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasScreenReader = 
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        navigator.userAgent.includes('TalkBack') ||
        window.speechSynthesis !== undefined;

      // Check for reduced motion preference (often used by screen reader users)
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check for high contrast mode
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;

      if (hasScreenReader || prefersReducedMotion || highContrast) {
        setIsScreenReaderMode(true);
      }

      // Also check localStorage for user preference
      const savedPreference = localStorage.getItem('screenReaderMode');
      if (savedPreference === 'true') {
        setIsScreenReaderMode(true);
      }
    };

    detectScreenReader();
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev, message]);
    
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(msg => msg !== message));
    }, 3000);
  }, []);

  const toggleScreenReaderMode = useCallback(() => {
    const newMode = !isScreenReaderMode;
    setIsScreenReaderMode(newMode);
    localStorage.setItem('screenReaderMode', newMode.toString());
    
    announce(newMode ? 'Screen reader mode enabled' : 'Screen reader mode disabled');
  }, [isScreenReaderMode, announce]);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
  }, []);

  // Apply screen reader optimizations to the DOM
  useEffect(() => {
    if (isScreenReaderMode) {
      document.body.classList.add('screen-reader-mode');
      // Reduce animations for better screen reader experience
      document.body.style.setProperty('--animation-duration', '0.1s');
      document.body.style.setProperty('--transition-duration', '0.1s');
    } else {
      document.body.classList.remove('screen-reader-mode');
      document.body.style.removeProperty('--animation-duration');
      document.body.style.removeProperty('--transition-duration');
    }
  }, [isScreenReaderMode]);

  // Add keyboard shortcuts for screen reader mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + S = Toggle screen reader mode
      if (event.altKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        toggleScreenReaderMode();
      }
      
      // Alt + H = Jump to main content (when screen reader mode is on)
      if (isScreenReaderMode && event.altKey && event.key.toLowerCase() === 'h') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          announce('Jumped to main content');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isScreenReaderMode, toggleScreenReaderMode, announce]);

  return (
    <ScreenReaderContext.Provider
      value={{
        isScreenReaderMode,
        announcements,
        toggleScreenReaderMode,
        announce,
        clearAnnouncements,
      }}
    >
      {children}
    </ScreenReaderContext.Provider>
  );
}
