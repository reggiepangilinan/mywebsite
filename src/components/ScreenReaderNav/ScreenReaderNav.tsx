'use client';

import { useScreenReader } from '@/contexts/ScreenReaderContext';
import styles from './ScreenReaderNav.module.css';

interface ScreenReaderNavProps {
  currentPage?: string;
}

export default function ScreenReaderNav({ currentPage }: ScreenReaderNavProps) {
  const { isScreenReaderMode, announce } = useScreenReader();

  if (!isScreenReaderMode) return null;

  const handleNavClick = (section: string) => {
    announce(`Navigating to ${section}`);
  };

  return (
    <nav 
      className={styles.screenReaderNav}
      aria-label="Screen reader navigation shortcuts"
      role="navigation"
    >
      <h2 className={styles.title}>Quick Navigation</h2>
      <ul className={styles.navList}>
        <li>
          <a 
            href="#main-content" 
            className={styles.navLink}
            onClick={() => handleNavClick('main content')}
          >
            Jump to main content
          </a>
        </li>
        <li>
          <a 
            href="#navigation" 
            className={styles.navLink}
            onClick={() => handleNavClick('navigation menu')}
          >
            Jump to navigation menu
          </a>
        </li>
        {currentPage === 'blog' && (
          <li>
            <a 
              href="#blog-posts" 
              className={styles.navLink}
              onClick={() => handleNavClick('blog posts')}
            >
              Jump to blog posts
            </a>
          </li>
        )}
        {currentPage === 'about' && (
          <>
            <li>
              <a 
                href="#skills" 
                className={styles.navLink}
                onClick={() => handleNavClick('skills section')}
              >
                Jump to skills
              </a>
            </li>
            <li>
              <a 
                href="#experience" 
                className={styles.navLink}
                onClick={() => handleNavClick('experience section')}
              >
                Jump to experience
              </a>
            </li>
          </>
        )}
        <li>
          <a 
            href="#footer" 
            className={styles.navLink}
            onClick={() => handleNavClick('page footer')}
          >
            Jump to footer
          </a>
        </li>
      </ul>
      
      <div className={styles.pageInfo}>
        <p>
          <strong>Page:</strong> {currentPage || 'Home'}
        </p>
        <p>
          <strong>Navigation:</strong> Use Tab to move between links, Enter to activate
        </p>
      </div>
    </nav>
  );
}
