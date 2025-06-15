import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            © 2025 Your Name. All rights reserved.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://github.com/yourusername" className={styles.socialLink}>
              GitHub
            </a>
            <a href="https://linkedin.com/in/yourusername" className={styles.socialLink}>
              LinkedIn
            </a>
            <a href="mailto:your.email@example.com" className={styles.socialLink}>
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
