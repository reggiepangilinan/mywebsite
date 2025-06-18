'use client';

import { useState, useEffect } from 'react';
import { useScreenReader } from '@/contexts/ScreenReaderContext';
import styles from './ScreenReaderShortcuts.module.css';

export default function ScreenReaderShortcuts() {
  const { isScreenReaderMode, announce } = useScreenReader();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Show shortcuts when screen reader mode is first enabled
  useEffect(() => {
    if (isScreenReaderMode) {
      const timer = setTimeout(() => {
        setShowShortcuts(true);
        announce('Screen reader shortcuts panel is now available. Press Alt+K to toggle shortcuts panel.');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowShortcuts(false);
    }
  }, [isScreenReaderMode, announce]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + K = Toggle shortcuts panel
      if (isScreenReaderMode && event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setShowShortcuts(!showShortcuts);
        announce(showShortcuts ? 'Shortcuts panel hidden' : 'Shortcuts panel visible');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isScreenReaderMode, showShortcuts, announce]);

  if (!isScreenReaderMode || !showShortcuts) return null;

  return (
    <div 
      className={styles.shortcuts}
      role="dialog"
      aria-label="Screen reader keyboard shortcuts"
      tabIndex={-1}
    >
      <div className={styles.shortcutsContent}>
        <h3 className={styles.title}>Keyboard Shortcuts</h3>
        <ul className={styles.shortcutList}>
          <li><kbd>Alt + S</kbd> - Toggle screen reader mode</li>
          <li><kbd>Alt + H</kbd> - Jump to main content</li>
          <li><kbd>Alt + K</kbd> - Toggle this shortcuts panel</li>
          <li><kbd>Tab</kbd> - Navigate between interactive elements</li>
          <li><kbd>Enter</kbd> - Activate buttons and links</li>
          <li><kbd>Escape</kbd> - Close dialogs and menus</li>
        </ul>
        <button 
          className={styles.closeButton}
          onClick={() => {
            setShowShortcuts(false);
            announce('Shortcuts panel closed');
          }}
          aria-label="Close shortcuts panel"
        >
          Close
        </button>
      </div>
    </div>
  );
}
