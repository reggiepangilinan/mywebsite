import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            © 2025 reggiepangilinan.com All rights reserved.
          </p>
          <div className={styles.socialLinks}>
            <a 
              href="https://github.com/reggiepangilinan" 
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/reggiepangilinan" 
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
