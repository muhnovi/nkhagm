import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>NIKAHAGAMA</div>
        <div className={styles.links}>
          <Link href="/about">Tentang</Link>
          <Link href="/address">Alamat</Link>
          <Link href="/contact">Kontak</Link>
          <Link href="/register">Pendaftaran</Link>
        </div>
        <div className={styles.copy}>
          © {new Date().getFullYear()} NIKAHAGAMA. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  )
}
