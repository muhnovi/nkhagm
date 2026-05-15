import type { Metadata } from 'next'
import { FontProvider } from '@/lib/FontContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nikah Agama - Informasi Pernikahan, Agama, dan Budaya',
  description: 'Nikah Agama adalah platform yang menyediakan informasi seputar pernikahan, agama, dan budaya.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" data-font="grotesk">
      <head>
        {/* Preconnect — buka koneksi ke domain eksternal lebih awal */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* DIHAPUS: preload font TTF — justru menambah blocking request */}
      </head>
      <body>
        <FontProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </FontProvider>
      </body>
    </html>
  )
}
