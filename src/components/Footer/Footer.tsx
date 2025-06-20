import styles from './Footer.module.css'
import { SITE_CONFIG } from '@/config/site'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            © 2025 {new URL(SITE_CONFIG.url).hostname} All rights reserved.
          </p>
          <div className={styles.socialLinks}>
            <a
              href={SITE_CONFIG.social.github}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href={SITE_CONFIG.social.linkedin}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
