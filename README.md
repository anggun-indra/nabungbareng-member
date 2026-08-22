# 📱 NabungBareng Member (PWA)

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

> **Aplikasi Progressive Web App (PWA) Transparan untuk Anggota & Wali Murid dalam Pengelolaan Tabungan & Iuran Komunitas / Sekolah / Paguyuban.**

---

## 🔗 Akses & Hubungan Repositori (Quick Links)

| Aplikasi | Tautan Live | Repositori GitHub |
|---|---|---|
| 📱 **Member PWA** | [👉 Buka Aplikasi Member (Live)](https://nabungbareng.web.app) | [GitHub: `nabungbareng-member`](https://github.com/anggun-indra/nabungbareng-member) |
| 🛡️ **Admin Portal** | [👉 Buka Portal Admin (Live)](https://nabungbareng-admin.web.app) | [GitHub: `nabungbareng-admin`](https://github.com/anggun-indra/nabungbareng-admin) |

---

## 🌟 Fitur Utama

- 💳 **Kartu Iuran Digital (Dual View)**:
  - **Tampilan Kartu (Grid)**: Kartu visual dengan stempel lunas interaktif dan ringkasan progres kelancaran iuran tahunan.
  - **Tampilan Tabel (List)**: Daftar terstruktur nomor urut bulan, nominal, status, dan tanggal pembayaran.
  - **Otomatisasi Bulan Mulai**: Bulan sebelum awal periode grup disembunyikan secara otomatis.
  - **Paging Tahunan**: Paging iuran per tahun kalender dengan filter valid.
- 📤 **Setor Iuran & Upload Bukti Otomatis**:
  - Pilihan periode bulan fleksibel (dapat memilih bulan spesifik langsung dari kartu iuran).
  - Kompresi gambar bukti transfer sisi klien (WebP/JPEG < 600KB) sebelum diunggah ke storage aman.
- 📊 **Transparansi Saldo & Jurnal Mutasi**:
  - Saldo aktif terverifikasi real-time.
  - Rincian debit/kredit setiap setoran dan potongan pengeluaran kas bersama.
- 🏢 **Multi-Grup Multi-Akun**:
  - Satu akun Google dapat terhubung ke beberapa grup (misal: Komite Kelas 1A, Arisan Paguyuban, dll).
- 📲 **Installable PWA & Offline Support**:
  - Dapat di-install langsung di Android, iOS (Add to Home Screen), dan Desktop PC.
  - Notifikasi update otomatis saat versi baru dirilis.
- 💬 **Integrasi WhatsApp**:
  - Bagikan status kelancaran kartu iuran digital langsung ke grup WA dengan format teks rapi.

---

## 🏗️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React + Canvas Confetti
- **Authentication**: Firebase Authentication (Google Sign-In) & Supabase JWT Integration
- **Database & Storage**: Supabase PostgreSQL (Row Level Security / RLS) & Supabase Private Storage
- **PWA**: Service Worker dengan Cache-Busting & Auto-Update Engine
- **Hosting**: Firebase Hosting

---

## 🚀 Panduan Memulai (Local Development)

### 1. Prasyarat
- Node.js >= 18.x
- Package Manager: `npm`, `pnpm`, atau `yarn`

### 2. Clone Repositori
```bash
git clone https://github.com/anggun-indra/nabungbareng-member.git
cd nabungbareng-member
```

### 3. Install Dependensi
```bash
npm install
# atau
pnpm install
```

### 4. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel pada `.env.local`:
```env
# Supabase Backend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Firebase Auth & Hosting
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=1:your-sender-id:web:your-app-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
# atau
pnpm dev
```
Buka browser di `http://localhost:5173`.

---

## 📦 Panduan Build & Deploy ke Firebase Hosting

### Build untuk Produksi
```bash
npm run build
```

### Deploy Otomatis dengan Version Bump
Proyek ini dilengkapi skrip otomatisasi build versioning:
```bash
node scripts/deploy.js patch
```
Skrip ini akan secara otomatis:
1. Menaikkan versi patch pada `package.json` dan `src/version.ts`.
2. Memperbarui `public/version.json` dan `sw.js` cache name.
3. Melakukan build bundle (`pnpm build`).
4. Mengunggah bundle ke Firebase Hosting via Firebase CLI.

---

## 📖 Panduan Penggunaan Aplikasi (User Guide)

1. **Masuk ke Aplikasi**:
   - Buka aplikasi dan klik **Masuk dengan Google**.
   - Sistem akan otomatis mendeteksi grup tempat Anda terdaftar.
2. **Memilih Grup Tabungan**:
   - Jika terdaftar di lebih dari satu grup, pilih grup aktif dari menu switch grup di pojok atas.
3. **Melihat Kartu Iuran Digital**:
   - Buka tab **Laporan** atau klik banner **Kartu Iuran Digital**.
   - Beralih tampilan antara mode **Kartu** (Grid) atau **Tabel** (List) sesuai kenyamanan Anda.
   - Gunakan navigasi tahun untuk melihat riwayat iuran tahun sebelumnya.
4. **Menyetor Iuran**:
   - Klik tombol **Setor Iuran** pada bulan yang diinginkan di Kartu Iuran, atau klik tombol **+ Setor Iuran** di halaman utama.
   - Upload foto bukti transfer bank/e-wallet.
   - Form akan otomatis mengompres foto dan mengirimkan pengajuan ke sistem untuk diverifikasi bendahara.
5. **Memantau Mutasi & Saldo**:
   - Tab **Aktivitas** menampilkan seluruh mutasi setoran terverifikasi dan potongan pengeluaran bersama secara transparan.

---

## 🤝 Kontribusi & Lisensi

Proyek ini bersifat open-source di bawah lisensi [MIT](LICENSE). Kontribusi berupa Pull Request, perbaikan bug, dan masukan fitur baru sangat diterima.

Dibuat dengan ❤️ untuk transparansi keuangan komunitas di Indonesia.
