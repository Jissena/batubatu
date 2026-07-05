# KKN-T 34

Website pendataan & pendampingan perizinan usaha villa/homestay di Kota Batu — KKN-T 34 FIA UB × DPMPTSP Kota Batu.

Semua halaman berupa file **HTML statis** (HTML+CSS+JS dalam satu file per halaman), tidak butuh proses build apapun. Bisa langsung dibuka di browser atau di-deploy ke Vercel. Data disimpan & dibaca lewat **Google Sheets** (gratis, tanpa server/database sungguhan) — lihat `SETUP_GOOGLE_SHEETS.md`.

## ⚠️ Wajib dilakukan dulu sebelum deploy

Website ini butuh setup Google Sheets sekali di awal supaya data (villa, tamu, forum, dll) benar-benar tersimpan permanen, bukan cuma di layar. **Baca dan ikuti `SETUP_GOOGLE_SHEETS.md`** sebelum push ke GitHub/Vercel. Kalau belum di-setup, website tetap jalan tapi semua data akan tampil kosong.

## Struktur Halaman

**Publik** (bisa diakses siapa saja):
- `index.html` — Beranda
- `direktori.html` — Peta & daftar villa/homestay (data dari Google Sheets)
- `media.html` — Galeri foto & artikel (data dari Google Sheets)
- `forum.html` — Forum diskusi (baca & kirim pesan tersimpan ke Google Sheets)
- `tentang.html` — Profil tim, DPL, kontak

**Internal** (untuk tim & dinas, sidebar khusus, **dilindungi password**):
- `data-villa.html` — Input data unit + checklist perizinan (tersimpan ke Google Sheets)
- `operasional.html` — Kalender booking + buku tamu digital (tersimpan ke Google Sheets)
- `laporan.html` — Rekap laporan (dihitung otomatis dari data villa) + kalkulator pajak

> Halaman internal dilindungi password sederhana di sisi browser (lihat
> `SETUP_GOOGLE_SHEETS.md` bagian 5 untuk mengganti passwordnya). Ini bukan
> sistem login sungguhan — cukup untuk mencegah orang iseng buka lewat URL,
> tapi bukan tingkat keamanan untuk data yang sangat sensitif.

## File pendukung

- `SETUP_GOOGLE_SHEETS.md` — panduan lengkap setup spreadsheet + Apps Script (wajib dibaca dulu)
- `Code.gs` — kode Apps Script yang ditempel ke Google Sheets kalian, supaya form di website bisa nulis data balik ke sheet

## Cara Deploy ke Vercel

1. Selesaikan setup di `SETUP_GOOGLE_SHEETS.md` (ganti semua `GANTI_DENGAN_...` di file HTML dengan Sheet ID / URL Apps Script kalian, dan ganti password default).
2. Push folder ini ke repository GitHub baru (root repo = isi folder ini langsung, bukan di dalam subfolder).
3. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo GitHub tadi.
4. Framework Preset: pilih **Other** (karena ini static HTML biasa, tidak ada build step).
5. Build Command: kosongkan. Output Directory: kosongkan / biarkan default (`.`).
6. Klik **Deploy**.

Setelah deploy, URL utama otomatis membuka `index.html`. Halaman lain diakses lewat path biasa, misal `namadomain.vercel.app/direktori.html`.

## Yang masih perlu dikerjakan sebelum dipakai serius

- Isi data hasil survei asli ke tab `Villa` di Google Sheets (lihat format kolom di `SETUP_GOOGLE_SHEETS.md`).
- Direktori di `direktori.html` otomatis menampilkan peta mini tiap unit — dicari sendiri oleh Google Maps dari kombinasi nama + desa + kecamatan di tab Villa, tanpa perlu isi koordinat atau link apapun. Kolom `link_maps` sifatnya opsional, cuma dipakai kalau tim mau override dengan link yang lebih presisi.
- Beranda (`index.html`) juga menampilkan peta lokasi Kantor DPMPTSP Kota Batu.
- Tarif Pajak Hotel (PB1) di `laporan.html` masih placeholder — konfirmasi angka resmi ke DPMPTSP/Bapenda Kota Batu.
- Gambar galeri masih pakai placeholder dari picsum.photos — kalau mau foto asli, perlu diunggah ke layanan hosting gambar (misal Google Drive/Imgur) lalu link-nya dimasukkan ke kolom `seed`/URL di tab `Album`.
- Fitur "Scan dokumen auto-isi" di `data-villa.html` saat ini masih mockup tampilan saja (belum OCR sungguhan).
- Lampiran foto di Forum saat ini cuma tampil sementara di browser pengirim, belum ikut tersimpan ke Google Sheets (perlu layanan hosting gambar terpisah kalau mau permanen).
