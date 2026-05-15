import styles from '../about/page.module.css'

export default function AddressPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>ALAMAT</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kantor Pusat</h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Jalan</div>
                <div className={styles.contactValue}>Jl. Kedungsono No. 123</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Kota</div>
                <div className={styles.contactValue}>Sukoharjo</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Provinsi</div>
                <div className={styles.contactValue}>Jawa Tengah</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Kode Pos</div>
                <div className={styles.contactValue}>57563</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Negara</div>
                <div className={styles.contactValue}>Indonesia</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Telepon</div>
                <div className={styles.contactValue}>-</div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Peta Lokasi</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.9415539223714!2d110.84759047400816!3d-7.796013092224061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a31a36e8f73ff%3A0x2fd9d189bf74efbc!2sPondok%20Pesantren%20ISMAKA!5e0!3m2!1sid!2sid!4v1778832462859!5m2!1sid!2sid"
              className={styles.mapFrame}
              loading="lazy"
              title="Lokasi NIIKAHAGAMA"
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Jam Operasional</h2>
            <div className={styles.contactGrid}>
              {[
                ['Senin – Jumat', '08:00 – 17:00 WIB'],
                ['Sabtu', '09:00 – 14:00 WIB'],
                ['Minggu', 'Tutup'],
                ['Hari Libur Nasional', 'Tutup'],
              ].map(([day, time]) => (
                <div key={day} className={styles.contactItem}>
                  <div className={styles.contactLabel}>{day}</div>
                  <div className={styles.contactValue}>{time}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.aside}>
          <div className={styles.statBox}>
            <div className={styles.stat}>
              <span className={styles.statNum}>1</span>
              <span className={styles.statLabel}>Kantor Pusat</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>Sukoharjo</span>
              <span className={styles.statLabel}>Kota Operasional</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>5+</span>
              <span className={styles.statLabel}>Tahun Beroperasi</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
