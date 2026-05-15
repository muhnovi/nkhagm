'use client'
import { useEffect, useState, Suspense } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import styles from './page.module.css'

interface Post {
  id: string
  title: string
  published: boolean
  publishedAt: Date
  category?: string
  tags?: string[]
  slug?: string
  excerpt?: string
  coverImage?: string
  _sortTime: number
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snap = await getDocs(collection(db, 'posts'))
        const data = snap.docs
          .map(doc => {
            const d = doc.data()
            return {
              ...d,
              id: doc.id,
              publishedAt: d.publishedAt?.toDate() || d.createdAt?.toDate() || new Date(),
              _sortTime: d.publishedAt?.seconds || d.createdAt?.seconds || 0,
            } as Post
          })
          .filter(p => p.published === true)
          .sort((a, b) => b._sortTime - a._sortTime)
          .slice(0, 10)
        setPosts(data)
      } catch (err: any) {
        console.error('Fetch posts error:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className={styles.page}>
      <div className={styles.heroBanner}>
        <span className={styles.heroText}>BLOG &amp; BERITA TERKINI</span>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.skeleton} style={{ height: '280px' }} />
              <div className={styles.skeleton} style={{ height: '90px', marginTop: '1rem' }} />
              <div className={styles.skeleton} style={{ height: '90px', marginTop: '0.75rem' }} />
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Belum ada artikel yang dipublikasikan.</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>
                Tambahkan artikel dari admin dan pastikan status sudah LIVE (published: true).
              </p>
            </div>
          ) : (
            <>
              {featured && (
                <PostCard
                  slug={featured.slug || featured.id}
                  title={featured.title}
                  excerpt={featured.excerpt || ''}
                  coverImage={featured.coverImage}
                  publishedAt={featured.publishedAt}
                  category={featured.category || 'Berita'}
                  tags={featured.tags}
                  featured
                />
              )}
              <div className={styles.postList}>
                {rest.map((post) => (
                  <PostCard
                    key={post.id}
                    slug={post.slug || post.id}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    coverImage={post.coverImage}
                    publishedAt={post.publishedAt}
                    category={post.category || 'Berita'}
                    tags={post.tags}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <Suspense fallback={<div className={styles.loadingSidebar}>Memuat Sidebar...</div>}>
          <Sidebar />
        </Suspense>
      </div>
    </div>
  )
}
