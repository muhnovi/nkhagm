'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import styles from '../about/page.module.css'

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    occupation: '',
    interest: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Check if email already registered
      const q = query(collection(db, 'members'), where('email', '==', form.email))
      const existing = await getDocs(q)
      if (!existing.empty) {
        setError('Email ini sudah terdaftar.')
        setLoading(false)
        return
      }

      await addDoc(collection(db, 'members'), {
        ...form,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setSuccess(true)
      setForm({ fullName: '', email: '', phone: '', address: '', city: '', occupation: '', interest: '', message: '' })
    } catch (err) {
      setError('Pendaftaran gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>PENDAFTARAN</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Daftar Sebagai Member</h2>
            <div className={styles.infoBox}>
              Dengan mendaftar, Anda akan mendapatkan akses ke konten eksklusif, newsletter mingguan,
              dan komunitas member NIIKAHAGAMA. Pendaftaran sepenuhnya gratis.
            </div>

            {success ? (
              <div className={styles.success}>
                ✓ Pendaftaran berhasil! Kami akan meninjau data Anda dan menghubungi Anda dalam 1-3 hari kerja.
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="fullName">Nama Lengkap *</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">Email *</label>
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

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="phone">No. Telepon</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="+62 8xx-xxxx-xxxx"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="city">Kota</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Kota asal Anda"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="occupation">Pekerjaan</label>
                  <input
                    id="occupation"
                    name="occupation"
                    type="text"
                    value={form.occupation}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Profesi atau pekerjaan Anda"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="interest">Minat Konten *</label>
                  <select
                    id="interest"
                    name="interest"
                    value={form.interest}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">-- Pilih Minat --</option>
                    <option value="berita">Berita & Aktualita</option>
                    <option value="teknologi">Teknologi</option>
                    <option value="pendidikan">Pendidikan</option>
                    <option value="bisnis">Bisnis & Ekonomi</option>
                    <option value="seni">Seni & Budaya</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="message">Pesan (Opsional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Ceritakan tentang diri Anda atau alasan bergabung..."
                  />
                </div>

                {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}

                <button type="submit" disabled={loading} className={styles.btn}>
                  {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                </button>
              </form>
            )}
          </section>
        </div>

        <aside className={styles.aside}>
          <div className={styles.statBox}>
            <div className={styles.stat}>
              <span className={styles.statNum}>Gratis</span>
              <span className={styles.statLabel}>Biaya Pendaftaran</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>1-3</span>
              <span className={styles.statLabel}>Hari Proses Verifikasi</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>∞</span>
              <span className={styles.statLabel}>Akses Konten</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
