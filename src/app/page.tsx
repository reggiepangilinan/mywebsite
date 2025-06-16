import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.profileImage}>
              <Image
                src="/profile.jpeg"
                alt="Profile"
                width={200}
                height={200}
                className={styles.avatar}
              />
            </div>
            <h1 className={styles.title}>
              <span className={styles.titleText}>Hi, I&apos;m Reggie&nbsp;<span className={styles.wave}>👋</span></span>
            </h1>
            <p className={styles.subtitle}>Full Stack Developer & Designer</p>
            <div className={styles.buttonGroup}>
              <Link
                href="/projects"
                className={`${styles.button} ${styles.primary}`}
              >
                View My Work
              </Link>
              <Link
                href="/about"
                className={`${styles.button} ${styles.secondary}`}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Development</h3>
              <p className={styles.featureText}>
                Building modern web applications with React, Next.js, and
                TypeScript
              </p>
            </div>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Design</h3>
              <p className={styles.featureText}>
                Creating beautiful and intuitive user experiences
              </p>
            </div>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Problem Solving</h3>
              <p className={styles.featureText}>
                Turning complex challenges into elegant solutions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
