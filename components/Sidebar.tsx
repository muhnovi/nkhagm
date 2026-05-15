'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './Sidebar.module.css'
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6'

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

        // 1. FIX: Gunakan Array.from untuk kategori unik (Tanpa DownlevelIteration)
        const cats = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean))) as string[]
        setCategories(cats)

        // 2. FIX: Gunakan Array.from untuk tags unik
        const allTags = allPosts.flatMap(p => Array.isArray(p.tags) ? p.tags : [])
        const uniqueTags = Array.from(new Set(allTags)) as string[]
        setTags(uniqueTags)

        // 5 artikel terbaru
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

  const defaultCategories = ['Berita', 'Tutorial', 'Panduan', 'Tips', 'Opini']
  const defaultTags = ['Teknologi', 'Pendidikan', 'Bisnis', 'Sains', 'Budaya']

  const displayCategories = categories.length > 0 ? categories : defaultCategories
  const displayTags = tags.length > 0 ? tags : defaultTags

  return (
    <aside className={styles.sidebar}>
      {/* About */}
<div className={styles.widget}>
        <h3 className={styles.widgetTitle}>HEY!</h3>
        <p className={styles.bio}>
          Selamat datang di blog NIKAHAGAMA.
        </p>
        
        <div className={styles.socials}>
          {/* 2. Ganti karakter kotak dengan komponen Icon */}
          <a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaXTwitter />
          </a>
          <a href="https://tiktok.com/@username" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok />
          </a>
          <a href="https://facebook.com/username" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
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