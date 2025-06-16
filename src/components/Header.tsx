'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navContent}>
            <Link href="/" className={styles.logo}>
              Reggie Pangilinan
            </Link>
            
            <div className={styles.navRight}>
              <div className={styles.navLinks}>
                <Link 
                  href="/" 
                  className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                >
                  About
                </Link>
                <Link 
                  href="/projects" 
                  className={`${styles.navLink} ${isActive('/projects') ? styles.active : ''}`}
                >
                  Projects
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
