import { useEffect } from 'react';
import { useScreenReader } from '@/contexts/ScreenReaderContext';
import { usePathname } from 'next/navigation';

interface UsePageAnnouncementsOptions {
  pageTitle?: string;
  pageDescription?: string;
  announceNavigation?: boolean;
}

export function usePageAnnouncements({
  pageTitle,
  pageDescription,
  announceNavigation = true
}: UsePageAnnouncementsOptions = {}) {
  const { announce, isScreenReaderMode } = useScreenReader();
  const pathname = usePathname();

  useEffect(() => {
    if (!isScreenReaderMode || !announceNavigation) return;

    const getPageInfo = () => {
      switch (pathname) {
        case '/':
          return {
            title: pageTitle || 'Home Page',
            description: pageDescription || 'Personal portfolio and blog homepage'
          };
        case '/about':
          return {
            title: pageTitle || 'About Page',
            description: pageDescription || 'Information about Reggie Pangilinan, skills and experience'
          };
        case '/blog':
          return {
            title: pageTitle || 'Blog Page',
            description: pageDescription || 'Technical articles and blog posts'
          };
        default:
          if (pathname.startsWith('/blog/')) {
            return {
              title: pageTitle || 'Blog Post',
              description: pageDescription || 'Individual blog post article'
            };
          }
          return {
            title: pageTitle || 'Page',
            description: pageDescription || 'Website page'
          };
      }
    };

    const { title, description } = getPageInfo();
    
    // Announce page navigation
    const announcement = `Navigated to ${title}. ${description}`;
    announce(announcement);

  }, [pathname, pageTitle, pageDescription, announce, isScreenReaderMode, announceNavigation]);

  // Return functions for manual announcements
  return {
    announceAction: (action: string) => {
      if (isScreenReaderMode) {
        announce(action);
      }
    },
    announceError: (error: string) => {
      if (isScreenReaderMode) {
        announce(`Error: ${error}`);
      }
    },
    announceSuccess: (message: string) => {
      if (isScreenReaderMode) {
        announce(`Success: ${message}`);
      }
    },
    announceLoading: (message: string = 'Loading content') => {
      if (isScreenReaderMode) {
        announce(message);
      }
    }
  };
}
