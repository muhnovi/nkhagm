'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './Sidebar.module.css'

// SVG inline — tidak perlu import react-icons sama sekali (hemat ~150KB JS)
const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)
const IconTwitter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const IconTiktok = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
)
const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export default function Sidebar() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [recentPosts, setRecentPosts] = useState<{ slug: string; title: string; id: string }[]>([])

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')
  const activeTag = searchParams.get('tag')

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const snap = await getDocs(collection(db, 'posts'))
        const allPosts = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as any))
          .filter(p => p.published === true)

        const cats = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean))) as string[]
        setCategories(cats)

        const allTags = allPosts.flatMap(p => Array.isArray(p.tags) ? p.tags : [])
        const uniqueTags = Array.from(new Set(allTags)) as string[]
        setTags(uniqueTags)

        const sorted = allPosts
          .sort((a, b) => {
            const ta = a.publishedAt?.seconds || a.createdAt?.seconds || 0
            const tb = b.publishedAt?.seconds || b.createdAt?.seconds || 0
            return tb - ta
          })
          .slice(0, 5)
        setRecentPosts(sorted.map(p => ({ id: p.id, slug: p.slug || p.id, title: p.title })))
      } catch (err) {
        console.error('Sidebar fetch error:', err)
      }
    }
    fetchMeta()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
  }

  const defaultCategories = ['Berita', 'Tutorial', 'Panduan', 'Tips', 'Opini', 'Pendidikan', 'Lainnya']
  const defaultTags = ['Tutorial', 'Berita']
  const displayCategories = categories.length > 0 ? categories : defaultCategories
  const displayTags = tags.length > 0 ? tags : defaultTags

  return (
    <aside className={styles.sidebar}>
      {/* About */}
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>HEY!</h3>
        <p className={styles.bio}>Selamat datang di blog NIKAHAGAMA.</p>
        <div className={styles.socials}>
          <a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <IconInstagram />
          </a>
          <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <IconTwitter />
          </a>
          <a href="https://tiktok.com/@username" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <IconTiktok />
          </a>
          <a href="https://facebook.com/username" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <IconFacebook />
          </a>
        </div>
      </div>

      {/* Newsletter */}
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>BERGABUNG</h3>
        <p className={styles.bio}>Dapatkan artikel terbaru langsung di inbox kamu.</p>
        {subscribed ? (
          <p className={styles.success}>✓ Terima kasih telah berlangganan!</p>
        ) : (
          <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@kamu.com"
              required
              className={styles.emailInput}
            />
            <button type="submit" className={styles.subscribeBtn}>→</button>
          </form>
        )}
      </div>

      {/* Categories */}
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>KATEGORI</h3>
        <ul className={styles.catList}>
          <li>
            <Link
              href="/blog"
              className={`${styles.catLink} ${!activeCategory && pathname === '/blog' ? styles.catActive : ''}`}
            >
              Semua Artikel
            </Link>
          </li>
          {displayCategories.map(cat => (
            <li key={cat}>
              <Link
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={`${styles.catLink} ${activeCategory === cat ? styles.catActive : ''}`}
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>TAGS</h3>
        <div className={styles.tagCloud}>
          {displayTags.map(tag => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={`${styles.tagBadge} ${activeTag === tag ? styles.tagActive : ''}`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>ARTIKEL TERBARU</h3>
          <ul className={styles.recentList}>
            {recentPosts.map(post => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className={styles.recentLink}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
