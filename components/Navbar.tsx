'use client'

import Link from 'next/link'
import { useFont } from '@/lib/FontContext'
import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { font, toggleFont } = useFont()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'Tentang' },
    { href: '/address', label: 'Alamat' },
    { href: '/contact', label: 'Kontak' },
    { href: '/register', label: 'Pendaftaran' },
  ]

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          NikahAgama
        </Link>

        {/* Desktop Nav */}
        <div className={styles.desktopLinks}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.controls}>
          {/* Font Toggle */}
          <button
            onClick={toggleFont}
            className={styles.fontToggle}
            title={`Switch to ${font === 'grotesk' ? 'Mono' : 'Grotesk'}`}
          >
            <span className={font === 'grotesk' ? styles.fontActive : ''}>Aa</span>
            <span className={styles.separator}>/</span>
            <span className={font === 'mono' ? styles.fontActive : styles.fontMono}>Aa</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? styles.barOpen : styles.bar} />
            <span className={menuOpen ? styles.barHideOpen : styles.bar} />
            <span className={menuOpen ? styles.barOpenReverse : styles.bar} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
