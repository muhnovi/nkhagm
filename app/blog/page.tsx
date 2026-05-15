"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import styles from "../page.module.css";

import { FaSearch } from "react-icons/fa";

/* =========================
   TYPES
========================= */

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

/* =========================
   BLOG CONTENT
========================= */

function BlogContent() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  /* =========================
     FETCH POSTS
  ========================= */

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

              publishedAt:
                d.publishedAt?.toDate() || d.createdAt?.toDate() || new Date(),

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

  /* =========================
     FILTER POSTS
  ========================= */

  const filteredPosts = allPosts.filter((p) => {
    const matchesCategory = !category || p.category === category;

    const matchesTag = !tag || (Array.isArray(p.tags) && p.tags.includes(tag));

    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTag && matchesSearch;
  });

  /* =========================
     RENDER
  ========================= */

  return (
    <div className={styles.page}>
      {/* =========================
          HERO
      ========================= */}

      <div className={styles.heroBanner}>
        <span className={styles.heroText}>
          {category
            ? category.toUpperCase()
            : tag
              ? `#${tag.toUpperCase()}`
              : "NIKAHAGAMA BLOG"}
        </span>
      </div>

      {/* =========================
          MAIN LAYOUT
      ========================= */}

      <div className={styles.layout}>
        {/* =========================
            MAIN CONTENT
        ========================= */}

        <main className={styles.main}>
          {/* =========================
              SEARCH BAR
          ========================= */}

          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <FaSearch className={styles.searchIcon} />

              <input
                type="text"
                placeholder="Cari artikel menarik..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* =========================
              LOADING STATE
          ========================= */}

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.skeleton} />
              <div className={styles.skeleton} />
              <div className={styles.skeleton} />
            </div>
          ) : filteredPosts.length === 0 ? (
            /* =========================
                EMPTY STATE
            ========================= */

            <div className={styles.emptyState}>
              <h3>Tidak ada artikel ditemukan</h3>

              <p>Coba gunakan kata kunci lain atau kategori berbeda.</p>
            </div>
          ) : (
            /* =========================
                POST LIST
            ========================= */

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

        {/* =========================
            SIDEBAR
        ========================= */}

        <aside className={styles.sidebar}>
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}

/* =========================
   PAGE EXPORT
========================= */

export default function BlogPage() {
  return (
    <Suspense fallback={<div className={styles.pageLoading}>Loading...</div>}>
      <BlogContent />
    </Suspense>
  );
}
