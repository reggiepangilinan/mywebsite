import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Reggie Pangilinan",
  description: "Explore my portfolio of web applications and software projects. See examples of my work with React, Next.js, TypeScript, and modern web technologies.",
  
  openGraph: {
    title: "Projects Portfolio - Reggie Pangilinan",
    description: "Explore my portfolio of web applications and software projects. See examples of my work with React, Next.js, TypeScript, and modern web technologies.",
    url: "https://reggiepangilinan.com/projects",
    images: [
      {
        url: "https://reggiepangilinan.com/profile.webp",
        width: 400,
        height: 400,
        alt: "Reggie Pangilinan - Projects Portfolio",
        type: "image/webp",
      },
    ],
  },

  twitter: {
    title: "Projects Portfolio - Reggie Pangilinan",
    description: "Explore my portfolio of web applications and software projects built with React, Next.js, TypeScript, and modern web technologies.",
    images: ["https://reggiepangilinan.com/profile.webp"],
  },

  alternates: {
    canonical: "https://reggiepangilinan.com/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
