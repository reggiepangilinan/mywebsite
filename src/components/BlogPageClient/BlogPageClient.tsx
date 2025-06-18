'use client';

import { usePageAnnouncements } from '@/hooks/usePageAnnouncements';

interface BlogPageClientProps {
  children: React.ReactNode;
  postCount: number;
}

export default function BlogPageClient({ children, postCount }: BlogPageClientProps) {
  // Add page announcements for screen reader
  usePageAnnouncements({
    pageTitle: 'Blog Page',
    pageDescription: `Technical articles and blog posts. ${postCount} posts available covering software engineering, leadership, and technology insights`
  });

  return <>{children}</>;
}
