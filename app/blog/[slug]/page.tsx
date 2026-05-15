'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Sidebar from '@/components/Sidebar'
import styles from './page.module.css'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound404, setNotFound404] = useState(false)

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        // Cari berdasarkan slug
        const q = query(
          collection(db, 'posts'),
          where('slug', '==', slug),
          limit(1)
        )

        const snap = await getDocs(q)

        if (!snap.empty) {
          const doc = snap.docs[0]

          setPost({
            id: doc.id,
            ...doc.data(),
            publishedAt:
              doc.data().publishedAt?.toDate() ||
              doc.data().createdAt?.toDate() ||
              new Date(),
          })
        } else {
          // Fallback cari berdasarkan doc ID
          const q2 = query(collection(db, 'posts'))
          const snap2 = await getDocs(q2)

          const found = snap2.docs.find((d) => d.id === slug)

          if (found) {
            setPost({
              id: found.id,
              ...found.data(),
              publishedAt:
                found.data().publishedAt?.toDate() ||
                found.data().createdAt?.toDate() ||
                new Date(),
            })
          } else {
            setNotFound404(true)
          }
        }
      } catch (err: any) {
        console.error('Post fetch error:', err.message)
        setNotFound404(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
        }}
      >
        <div
          style={{
            height: '360px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem',
          }}
        />

        <div
          style={{
            height: '2rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            marginBottom: '1rem',
            width: '60%',
          }}
        />

        <div
          style={{
            height: '1rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            marginBottom: '0.5rem',
          }}
        />

        <div
          style={{
            height: '1rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            marginBottom: '0.5rem',
            width: '80%',
          }}
        />
      </div>
    )
  }

  if (notFound404 || !post) {
    return (
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404</h1>

        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
          Artikel tidak ditemukan.
        </p>

        <Link href="/blog" style={{ textDecoration: 'underline' }}>
          ← Kembali ke Blog
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <article className={styles.article}>
          {post.coverImage && (
            <div className={styles.coverWrap}>
              <img
                src={post.coverImage}
                alt={post.title}
                className={styles.cover}
              />
            </div>
          )}

          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.category}>
                {post.category || 'Berita'}
              </span>

              <time className={styles.date}>
                {format(post.publishedAt, 'EEEE, d MMMM yyyy', {
                  locale: id,
                })}
              </time>
            </div>

            <h1 className={styles.title}>{post.title}</h1>

            {post.excerpt && (
              <p className={styles.excerpt}>{post.excerpt}</p>
            )}

            {post.author && (
              <div className={styles.author}>
                Oleh <strong>{post.author}</strong>
              </div>
            )}
          </header>

          <div
            className={styles.body}
            dangerouslySetInnerHTML={{
              __html: post.content || '<p>Konten belum tersedia.</p>',
            }}
          />

          {post.tags?.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={styles.tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <div className={styles.backLink}>
            <Link href="/blog">← Kembali ke Blog</Link>
          </div>
        </article>

        <Sidebar />
      </div>
    </div>
  )
}