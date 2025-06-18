'use client'
import { useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageAnnouncements } from "@/hooks/usePageAnnouncements";

export default function Home() {
  // Add page announcements for screen reader
  usePageAnnouncements({
    pageTitle: 'Home Page',
    pageDescription: 'Personal portfolio and blog homepage showcasing engineering leadership and full stack development expertise'
  });

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(styles.featureVisible);
          }, index * 200);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const featureCards = document.querySelectorAll(`.${styles.feature}`);
    featureCards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-label="Hero section">
        <div className="container">
          <div className={styles.heroContent}>
            <AnimatedSection delay={0}>
              <div className={styles.profileImage}>
                <Image
                  src="/profile.webp"
                  alt="Profile photo of Reggie Pangilinan, Engineering Leader and Full Stack Developer"
                  width={200}
                  height={200}
                  className={styles.avatar}
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <h1 className={styles.title}>
                <span className={styles.titleText}>Hi, I&apos;m Reggie&nbsp;<span className={styles.wave} role="img" aria-label="Waving hand">👋</span></span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={400}>
              <p className={styles.subtitle}>Engineering Leadership & Full Stack Development. I build scalable solutions for the web.</p>
            </AnimatedSection>
            <AnimatedSection delay={600}>
              <div className={styles.buttonGroup}>
                <Link
                  href="/blog"
                  className={`${styles.button} ${styles.primary}`}
                >
                  Read My Blog
                </Link>
                <Link
                  href="/about"
                  className={`${styles.button} ${styles.secondary}`}
                >
                  About Me
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className={styles.features} aria-label="What I do - key areas of expertise">
        <div className="container">
          <AnimatedSection delay={800}>
            <h2 className={styles.featuresHeading}>
              <span className={styles.text}>What I Do</span>
              <span className={styles.emoji} role="img" aria-label="Handshake">🤝</span>
            </h2>
          </AnimatedSection>
          <div className={styles.featuresGrid} role="list" aria-label="Areas of expertise">
            <div className={styles.feature} role="listitem">
              <h3 className={styles.featureTitle}>Hands-on</h3>
              <p className={styles.featureText}>
                Building modern web applications with .NET Stack, React, Next.js,
                Azure and AI Tools
              </p>
            </div>
            <div className={styles.feature} role="listitem">
              <h3 className={styles.featureTitle}>Technical Leadership</h3>
              <p className={styles.featureText}>
                Leading teams to deliver high-quality, scalable software solutions
              </p>
            </div>
            <div className={styles.feature} role="listitem">
              <h3 className={styles.featureTitle}>Problem Solving</h3>
              <p className={styles.featureText}>
                Strategize and implement solutions to help businesses achieve their goals
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
