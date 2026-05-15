'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import styles from '../about/page.module.css'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: serverTimestamp(),
        read: false,
      })
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      alert('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>KONTAK</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Informasi Kontak</h2>
            <div className={styles.contactGrid}>
              {[
                ['Email', '-'],
                ['Telepon', '-'],
                ['WhatsApp', '-'],
                ['Fax', '-'],
              ].map(([label, val]) => (
                <div key={label} className={styles.contactItem}>
                  <div className={styles.contactLabel}>{label}</div>
                  <div className={styles.contactValue}>{val}</div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kirim Pesan</h2>
            {sent ? (
              <div className={styles.success}>
                ✓ Pesan Anda berhasil dikirim. Kami akan merespons dalam 1×24 jam.
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="name">Nama Lengkap</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="email@anda.com"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="subject">Subjek</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Topik pesan Anda"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="message">Pesan</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
                <button type="submit" disabled={loading} className={styles.btn}>
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            )}
          </section>
        </div>

        <aside className={styles.aside}>
          <div className={styles.statBox}>
            <div className={styles.stat}>
              <span className={styles.statNum}>24J</span>
              <span className={styles.statLabel}>Waktu Respons</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Pesan Dibalas</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
