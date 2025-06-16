'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Header.module.css'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navContent}>
            <Link href="/" className={styles.logo} onClick={closeMenu}>
              Reggie Pangilinan
            </Link>
            
            {/* Hamburger Menu Button */}
            <button 
              className={styles.hamburger}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
              <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
              <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
            </button>
            
            <div className={`${styles.navRight} ${isMenuOpen ? styles.navRightOpen : ''}`}>
              <div className={styles.navLinks}>
                <Link 
                  href="/" 
                  className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link 
                  href="/projects" 
                  className={`${styles.navLink} ${isActive('/projects') ? styles.active : ''}`}
                  onClick={closeMenu}
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
