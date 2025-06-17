import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me - Reggie Pangilinan",
  description: "Learn about my engineering leadership journey, technical skills, and professional experience across enterprise environments. Specializing in React, Next.js, TypeScript, and Azure.",
  
  openGraph: {
    title: "About Reggie Pangilinan - Engineering Leader & Technical Architect",
    description: "Seasoned engineering leader delivering performant, scalable, and user-centric digital platforms across enterprise environments. Expert in React, Next.js, TypeScript, and Azure.",
    url: "https://reggiepangilinan.com/about",
    images: [
      {
        url: "https://reggiepangilinan.com/profile.webp",
        width: 400,
        height: 400,
        alt: "Reggie Pangilinan - About Me",
        type: "image/webp",
      },
    ],
  },

  twitter: {
    title: "About Reggie Pangilinan - Engineering Leader & Technical Architect",
    description: "Seasoned engineering leader delivering performant, scalable, and user-centric digital platforms across enterprise environments.",
    images: ["https://reggiepangilinan.com/profile.webp"],
  },

  alternates: {
    canonical: "https://reggiepangilinan.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
