"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import styles from "../page.module.css";

// Ganti FaSearch dari react-icons dengan SVG inline kecil — hemat ~150KB
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

interface Post {
  id: string;
  title: string;
  published: boolean;
  publishedAt: Date;
  category?: string;
  tags?: string[];
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  _sortTime: number;
}

function BlogContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "posts"));
        const data = snap.docs
          .map((doc) => {
            const d = doc.data();
            return {
              ...d,
              id: doc.id,
              publishedAt: d.publishedAt?.toDate() || d.createdAt?.toDate() || new Date(),
              _sortTime: d.publishedAt?.seconds || d.createdAt?.seconds || 0,
            } as Post;
          })
          .filter((p) => p.published === true)
          .sort((a, b) => b._sortTime - a._sortTime);
        setAllPosts(data);
      } catch (err: any) {
        console.error("Blog fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = allPosts.filter((p) => {
    const matchesCategory = !category || p.category === category;
    const matchesTag = !tag || (Array.isArray(p.tags) && p.tags.includes(tag));
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.heroBanner}>
        <span className={styles.heroText}>
          {category ? category.toUpperCase() : tag ? `#${tag.toUpperCase()}` : "NIKAHAGAMA BLOG"}
        </span>
      </div>

      <div className={styles.layout}>
        <main className={styles.main}>
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <IconSearch />
              <input
                type="text"
                placeholder="Cari artikel menarik..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.skeleton} />
              <div className={styles.skeleton} />
              <div className={styles.skeleton} />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Tidak ada artikel ditemukan</h3>
              <p>Coba gunakan kata kunci lain atau kategori berbeda.</p>
            </div>
          ) : (
            <div className={styles.postList}>
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  slug={post.slug || post.id}
                  title={post.title}
                  excerpt={post.excerpt || ""}
                  coverImage={post.coverImage}
                  publishedAt={post.publishedAt}
                  category={post.category || "Berita"}
                  tags={post.tags}
                />
              ))}
            </div>
          )}
        </main>

        <aside className={styles.sidebar}>
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className={styles.pageLoading}>Loading...</div>}>
      <BlogContent />
    </Suspense>
  );
}
