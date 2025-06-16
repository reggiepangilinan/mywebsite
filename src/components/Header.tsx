'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './Header.module.css'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState('/')

  useEffect(() => {
    // Set initial route based on current location
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      setActiveRoute(currentPath || '/')
    }
  }, [])

  const isActive = (path: string) => activeRoute === path

  const handleLinkClick = (path: string) => {
    setActiveRoute(path)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navContent}>
            <Link href="/" className={styles.logo} onClick={() => handleLinkClick('/')}>
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
                  onClick={() => handleLinkClick('/')}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                  onClick={() => handleLinkClick('/about')}
                >
                  About
                </Link>
                <Link 
                  href="/projects" 
                  className={`${styles.navLink} ${isActive('/projects') ? styles.active : ''}`}
                  onClick={() => handleLinkClick('/projects')}
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
