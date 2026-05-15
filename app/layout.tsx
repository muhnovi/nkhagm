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
        {/* Preload font utama agar tidak blocking render */}
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
