'use client';

import { ReactNode } from 'react';
import styles from './SkipLink.module.css';

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

export default function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a 
      href={href} 
      className={styles.skipLink}
      onFocus={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.opacity = '1';
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = 'translateY(-100%)';
        e.currentTarget.style.opacity = '0';
      }}
    >
      {children}
    </a>
  );
}
