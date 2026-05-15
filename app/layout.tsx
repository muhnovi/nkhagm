import type { Metadata } from 'next'
import { FontProvider } from '@/lib/FontContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nikah Agama - Informasi Pernikahan, Agama, dan Budaya',
  description: 'Nikah Agama adalah platform yang menyediakan informasi seputar pernikahan, agama, dan budaya. Temukan artikel menarik, tips, dan panduan untuk merencanakan pernikahan yang sesuai dengan nilai-nilai agama dan budaya Anda.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" data-font="grotesk">
      <head>
        {/* Preconnect ke domain eksternal — browser buka koneksi lebih awal
            sehingga gambar & API tidak nunggu DNS + TCP + TLS handshake */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Preload hanya font utama yang pasti dipakai */}
        <link
          rel="preload"
          href="/fonts/SpaceGrotesk-Regular.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SpaceGrotesk-Bold.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
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
