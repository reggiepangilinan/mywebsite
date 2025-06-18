'use client';

import { usePathname } from 'next/navigation';
import ScreenReaderNav from '@/components/ScreenReaderNav';

export default function ScreenReaderNavClient() {
  const pathname = usePathname();
  
  const getCurrentPage = () => {
    switch (pathname) {
      case '/':
        return 'home';
      case '/about':
        return 'about';
      case '/blog':
        return 'blog';
      default:
        if (pathname.startsWith('/blog/')) {
          return 'blog-post';
        }
        return undefined;
    }
  };

  return <ScreenReaderNav currentPage={getCurrentPage()} />;
}
