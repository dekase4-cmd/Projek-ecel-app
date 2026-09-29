# Excel LearnHub - Modul & Latihan Interaktif

Aplikasi web interaktif pembelajaran Microsoft Excel dengan kamus fungsi lengkap, spreadsheet interaktif langsung (*live formula evaluation*), dan 10 latihan berbasis evaluasi otomatis.

---

## 🚀 Cara Menjalankan di Komputer Lokal (Local Development)

Jika Anda mengunduh (*download*) atau clone repositori ini ke komputer Anda, proyek ini **tidak bisa dibuka langsung dengan klik dua kali file `index.html`** karena menggunakan framework modern React + Vite + TypeScript. 

Ikuti 3 langkah berikut untuk menjalankannya:

### 1. Prasyarat
Pastikan komputer Anda sudah terpasang [Node.js](https://nodejs.org/) (versi 18 atau lebih baru).

### 2. Install Dependensi
Buka terminal / CMD di folder proyek ini, lalu jalankan:
```bash
npm install
```

### 3. Jalankan Server Lokal
```bash
npm run dev
```
Setelah itu, buka browser dan akses alamat:
```
http://localhost:3000
```

---

## 🌐 Cara Deploy Gratis agar Website Bisa Dibuka Siapa Saja

### Opsi 1: GitHub Pages (Otomatis via GitHub Actions)
File workflow `.github/workflows/deploy.yml` sudah disiapkan di repositori ini:

1. Buka repositori proyek Anda di web GitHub.
2. Klik tab **Settings** di bagian atas repositori.
3. Di menu sebelah kiri, klik **Pages**.
4. Pada bagian **Build and deployment** -> **Source**, ubah dari *Deploy from a branch* menjadi **GitHub Actions**.
5. Lakukan commit / push perubahan ke branch `main` atau `master`.
6. GitHub akan otomatis melakukan build dan website Anda langsung online di URL:
   `https://<username>.github.io/<nama-repo>/`

---

### Opsi 2: Deploy ke Vercel (Paling Cepat & Populer)
1. Buka [Vercel.com](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2. Klik **Add New...** -> **Project**.
3. Pilih repositori GitHub ini.
4. Klik **Deploy**.
5. Selesai! Dalam waktu kurang dari 1 menit, Vercel akan memberikan link web aktif gratis (`https://nama-proyek.vercel.app`).

---

### Opsi 3: Deploy ke Netlify
1. Buka [Netlify.com](https://www.netlify.com/) dan login dengan GitHub.
2. Pilih **Add new site** -> **Import an existing project** -> **GitHub**.
3. Pilih repositori ini, biarkan pengaturan build standar (`Build command: npm run build`, `Publish directory: dist`), lalu klik **Deploy**.

---

## 🛠️ Build Manual
Untuk menghasilkan file statis siap upload:
```bash
npm run build
```
File hasil kompilasi akan berada di folder `dist/`.
