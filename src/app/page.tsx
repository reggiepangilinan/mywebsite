'use client'
import { useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
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
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <AnimatedSection delay={0}>
              <div className={styles.profileImage}>
                <Image
                  src="/profile.webp"
                  alt="Profile"
                  width={200}
                  height={200}
                  className={styles.avatar}
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <h1 className={styles.title}>
                <span className={styles.titleText}>Hi, I&apos;m Reggie&nbsp;<span className={styles.wave}>👋</span></span>
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

      <section className={styles.features}>
        <div className="container">
          <AnimatedSection delay={800}>
            <h2 className={styles.featuresHeading}>

              <span className={styles.text}>What I Do</span>
                            <span className={styles.emoji}>🤝</span>
            </h2>
          </AnimatedSection>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Hands-on</h3>
              <p className={styles.featureText}>
                Building modern web applications with .NET Stack, React, Next.js,
                Azure and AI Tools
              </p>
            </div>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Technical Leadership</h3>
              <p className={styles.featureText}>
                Leading teams to deliver high-quality, scalable software solutions
              </p>
            </div>
            <div className={styles.feature}>
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
