import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700', '900'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-roboto'
});

export const metadata: Metadata = {
  title: "Reggie Pangilinan - Welcome to my portfolio and blog",
  description: "Engineering Leadership & Full Stack Development. I build scalable solutions for the web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  const html = document.documentElement;
                  html.setAttribute('data-theme', theme);
                  html.style.colorScheme = theme;
                  html.style.visibility = 'visible';
                  // Apply critical styles immediately
                  html.style.backgroundColor = theme === 'dark' ? '#0a0a0a' : '#ffffff';
                  html.style.color = theme === 'dark' ? '#ededed' : '#333333';
                } catch (e) {
                  const html = document.documentElement;
                  html.setAttribute('data-theme', 'dark');
                  html.style.colorScheme = 'dark';
                  html.style.visibility = 'visible';
                  html.style.backgroundColor = '#0a0a0a';
                  html.style.color = '#ededed';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${roboto.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <div className="page-wrapper">
            <Header />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
