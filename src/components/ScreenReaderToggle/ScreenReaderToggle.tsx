'use client';

import { useScreenReader } from '@/contexts/ScreenReaderContext';
import styles from './ScreenReaderToggle.module.css';

export default function ScreenReaderToggle() {
  const { isScreenReaderMode, toggleScreenReaderMode } = useScreenReader();

  return (
    <button
      onClick={toggleScreenReaderMode}
      className={`${styles.toggle} ${isScreenReaderMode ? styles.active : ''}`}
      aria-label={`${isScreenReaderMode ? 'Disable' : 'Enable'} screen reader optimizations`}
      title={`${isScreenReaderMode ? 'Disable' : 'Enable'} screen reader mode`}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        {isScreenReaderMode && (
          <path d="m9 9 3 3-3 3" strokeWidth="3" />
        )}
      </svg>
      <span className={styles.label}>
        {isScreenReaderMode ? 'SR Mode On' : 'SR Mode'}
      </span>
    </button>
  );
}
