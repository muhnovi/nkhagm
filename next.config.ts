/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktifkan ini agar Next.js 16 tahu kamu sengaja pakai Webpack
  turbopack: {}, 
// 1. PINDAHKAN KE SINI (Top Level)
  // Jangan ditaruh di dalam 'experimental' lagi
  allowedDevOrigins: ['192.168.1.7', 'localhost:3000'],
  webpack: (config: { ignoreWarnings: { module: RegExp; }[]; }) => {
    // 1. Tambahkan konfigurasi (misal: abaikan peringatan gRPC/Protobuf)
    config.ignoreWarnings = [
      { module: /node_modules\/@protobufjs\/inquire\/index\.js/ },
    ];

    // 2. WAJIB: Kembalikan objek config yang sudah dimodifikasi
    return config; 
  },
};