// Global TypeScript interfaces and types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AnimatedSectionProps extends BaseComponentProps {
  delay?: number;
}

export interface MetaData {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  publishDate?: string;
  lastModified?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
  label: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string;
}

// Theme types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ISRStatus {
  enabled: boolean;
  revalidateTime: number;
  lastRevalidation?: string;
}
