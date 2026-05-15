import Link from 'next/link'
import Image from 'next/image'
import styles from './PostCard.module.css'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface PostCardProps {
  slug: string
  title: string
  excerpt: string
  coverImage?: string
  publishedAt: Date
  category: string
  tags?: string[]
  featured?: boolean
}

export default function PostCard({
  slug, title, excerpt, coverImage, publishedAt, category, tags = [], featured
}: PostCardProps) {
  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      {coverImage && (
        <Link href={`/blog/${slug}`} className={styles.imageWrap}>
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes={featured
              ? '(max-width: 768px) 100vw, 700px'
              : '(max-width: 768px) 100vw, 260px'}
            className={styles.image}
            priority={featured}   /* LCP image di-load lebih awal */
            style={{ objectFit: 'cover' }}
          />
        </Link>
      )}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{category}</span>
          <time className={styles.date}>
            {format(publishedAt, 'd MMM yyyy', { locale: id })}
          </time>
        </div>
        <Link href={`/blog/${slug}`}>
          <h2 className={styles.title}>{title}</h2>
        </Link>
        <p className={styles.excerpt}>{excerpt}</p>
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        <Link href={`/blog/${slug}`} className={styles.readMore}>
          Baca Selengkapnya →
        </Link>
      </div>
    </article>
  )
}
