import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>TENTANG KAMI</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Apa itu NIIKAHAGAMA?</h2>
            <p>
              NIIKAHAGAMA adalah platform blog dan berita digital yang lahir dari semangat berbagi
              pengetahuan. Kami percaya bahwa setiap ide layak diceritakan, setiap pengalaman
              layak dibagikan, dan setiap suara layak didengar.
            </p>
            <p>
              Dengan tampilan hitam-putih yang bersih dan tipografi yang kuat, NIIKAHAGAMA
              menempatkan konten sebagai bintang utama — tanpa gangguan, tanpa distraksi.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Misi Kami</h2>
            <p>
              Menyediakan ruang bagi para penulis, jurnalis, dan pemikir untuk berbagi
              perspektif mereka dengan dunia. Kami berkomitmen pada kualitas konten,
              kejujuran editorial, dan inklusivitas suara.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tim Kami</h2>
            <div className={styles.team}>
              {[
                { name: 'Editor Utama', role: 'Pemimpin Redaksi' },
                { name: 'Tim Teknologi', role: 'Pengembang Platform' },
                { name: 'Tim Konten', role: 'Kurator & Penulis' },
              ].map((member, i) => (
                <div key={i} className={styles.member}>
                  <div className={styles.avatar}>{member.name[0]}</div>
                  <div>
                    <div className={styles.memberName}>{member.name}</div>
                    <div className={styles.memberRole}>{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.aside}>
          <div className={styles.statBox}>
            <div className={styles.stat}>
              <span className={styles.statNum}>100+</span>
              <span className={styles.statLabel}>Artikel Diterbitkan</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>50+</span>
              <span className={styles.statLabel}>Penulis Aktif</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>10K+</span>
              <span className={styles.statLabel}>Pembaca Setia</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
