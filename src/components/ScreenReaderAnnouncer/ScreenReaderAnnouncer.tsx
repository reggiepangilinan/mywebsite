'use client';

import { useScreenReader } from '@/contexts/ScreenReaderContext';
import styles from './ScreenReaderAnnouncer.module.css';

export default function ScreenReaderAnnouncer() {
  const { announcements } = useScreenReader();

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true"
      className={styles.announcer}
    >
      {announcements.map((announcement, index) => (
        <div key={index} className={styles.announcement}>
          {announcement}
        </div>
      ))}
    </div>
  );
}
