# Setup Google Sheets sebagai "database" (gratis, tanpa server)

Website ini sekarang membaca & menulis data lewat Google Sheets, jadi tetap bisa
di-deploy sebagai situs statis biasa ke Vercel — tidak perlu backend/database
sungguhan. Ikuti langkah ini SEKALI di awal.

## 1. Buat spreadsheet

1. Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru,
   beri nama misalnya **"KKN-T 34 - Data"**.
2. Di dalam satu spreadsheet ini, buat beberapa **sheet/tab** (klik `+` di
   pojok kiri bawah), lalu isi baris pertama tiap tab dengan nama kolom
   persis seperti di bawah (huruf kecil semua, tanpa spasi):

### Tab `Villa` (dipakai oleh Direktori, Data Villa, dan Laporan)
```
nama | desa | kec | kamar | harga | kontak | nib | sert | pbg | link_maps | tanggal_survei
```
- `nib`, `sert`, `pbg` isinya salah satu: `belum`, `proses`, `terbit`
- `link_maps` diisi link Google Maps lokasi unit tersebut. Caranya: buka lokasi
  di Google Maps → tombol **Bagikan** → **Salin link** → tempel ke kolom ini.
  Boleh dikosongkan kalau belum tahu lokasinya (tombol di Direktori nanti
  otomatis muncul "Lokasi belum ditautkan")
- `tanggal_survei` format `2026-07-03` (dipakai untuk grafik tren bulanan)

### Tab `Tamu` (dipakai oleh Operasional)
```
nama | asal | unit | in | out
```
- `in`, `out` format tanggal `2026-07-01`

### Tab `Album` (dipakai oleh Media — opsional)
```
title | tag | date | seed | n
```

### Tab `Artikel` (dipakai oleh Media — opsional)
```
tag | title | excerpt | isi | gambar1 | gambar2 | gambar3 | gambar4 | gambar5 | date | read | seed
```
- `excerpt` = ringkasan pendek yang muncul di kartu daftar artikel
- `isi` = isi lengkap artikel yang muncul saat artikel diklik. Tiap Enter
  (baris baru) di dalam satu sel jadi 1 paragraf baru otomatis. Bisa juga
  pakai format sederhana di awal baris:
  - `## teks` → jadi sub-judul
  - `- teks` → jadi poin daftar (baris `- ` berurutan otomatis digabung jadi satu list)
  - `> teks` → jadi kutipan
  - baris biasa → jadi paragraf
- `gambar1` sampai `gambar5` = opsional, isi link gambar langsung (dari Google
  Drive/Imgur, harus bisa dibuka publik). Boleh isi 1 sampai 5, boleh kosong
  semua. `gambar1` dipakai sebagai foto sampul (di kartu daftar & atas artikel),
  `gambar2`-`gambar5` otomatis disisipkan rata di antara paragraf isi artikel.

### Tab `Forum` (dipakai oleh Forum)
```
kategori | name | team | time | text
```
- `kategori` isinya salah satu: `izin`, `umum`, `pengumuman`
- `team` isinya `TRUE` atau `FALSE`

### Tab `Laporan` (otomatis — dari form "Lapor Usaha Tak Berizin" di Villa & Homestay)
```
id | waktu | nama_lokasi | keterangan | kontak_pelapor | status
```
- Terisi otomatis, tidak perlu diisi manual.
- `id` jangan diubah/dihapus — dipakai sistem untuk mencocokkan baris.
- `status` otomatis terisi `Sudah Ditangani` saat tim klik tombol "✓ Tandai Selesai" di
  halaman Laporan (Dashboard Tim). Baris yang sudah ditangani otomatis tersembunyi dari
  daftar aktif di website (data tetap ada di spreadsheet, hanya disembunyikan/ditandai).

### Tab `Kontak` (otomatis — dari form "Kirim Pesan" di Tentang Kami)
```
id | waktu | nama | hp | pesan | status
```
- Sama seperti tab `Laporan` — otomatis, ada sistem checklist "✓ Tandai Selesai" yang sama.

## 2. Bagikan spreadsheet supaya bisa dibaca website

Klik **Share** (kanan atas) → ubah akses jadi **"Anyone with the link"** →
role **Viewer**. Tanpa ini, website tidak bisa membaca datanya sama sekali.

## 3. Ambil Sheet ID

Lihat URL spreadsheet kalian, formatnya:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_ADA_DISINI/edit
```
Copy bagian `SHEET_ID_ADA_DISINI` itu.

Lalu buka tiap file berikut dan ganti `GANTI_DENGAN_ID_SPREADSHEET` dengan
Sheet ID kalian:
- `direktori.html`
- `data-villa.html`
- `operasional.html`
- `laporan.html`
- `media.html`
- `forum.html`

## 4. Setup Apps Script (supaya form "Tambah Data" di website bisa nulis balik ke Sheet)

1. Di spreadsheet kalian, klik **Extensions → Apps Script**.
2. Hapus kode default, ganti dengan isi file `Code.gs` yang ada satu folder
   dengan file ini.
3. Klik **Deploy → New deployment**.
4. Pilih tipe **Web app**.
5. Isi:
   - **Execute as**: Me (akun Google kalian)
   - **Who has access**: Anyone
6. Klik **Deploy**, lalu **Authorize access** (izinkan Google Script mengakses
   spreadsheet kalian — ini akun kalian sendiri, aman).
7. Copy **Web app URL** yang muncul (bentuknya
   `https://script.google.com/macros/s/xxxxx/exec`).
8. Buka file berikut dan ganti `GANTI_DENGAN_URL_APPS_SCRIPT` dengan URL itu:
   - `data-villa.html`
   - `operasional.html`
   - `forum.html`

> Kalau nanti kode di Apps Script diubah, kalian harus **Deploy → Manage
> deployments → edit (ikon pensil) → New version → Deploy** lagi supaya
> perubahan aktif.

## 5. Ganti password halaman internal

Buka `data-villa.html`, `operasional.html`, `laporan.html` — cari baris:
```js
const PASSWORD = "kknt34batu";
```
Ganti `"kknt34batu"` dengan password pilihan tim kalian (harus sama persis
di ketiga file). Bagikan password ini hanya ke tim & DPMPTSP lewat WA/email,
jangan disebar publik.

**Catatan:** ini proteksi sederhana di sisi browser, bukan login sungguhan —
cukup untuk mencegah orang iseng, tapi bukan tingkat keamanan data sensitif.

## 6. Push ke GitHub & deploy ke Vercel seperti biasa

Setelah semua `GANTI_DENGAN_...` di atas sudah diganti, push folder ini ke
GitHub lalu deploy ke Vercel (lihat README.md). Selesai — data yang diisi
tim lewat form di website akan otomatis masuk ke Google Sheets dan langsung
tampil lagi di semua halaman terkait.

## Catatan penting

- **Delay update**: Google Sheets butuh sampai ±1 menit untuk meng-update
  hasil publish setelah ada baris baru. Jadi kalau baru submit data, data
  itu langsung tampil di layar kalian sendiri (sementara), tapi orang lain
  yang buka website beberapa detik setelahnya mungkin belum lihat — tunggu
  sebentar dan refresh.
- **Bukan pengganti database sungguhan** untuk skala besar/traffic tinggi,
  tapi lebih dari cukup untuk kebutuhan pendataan KKN dan operasional harian
  DPMPTSP skala Kota Batu.
- Data tim tetap bisa diedit langsung dari Google Sheets-nya (tanpa lewat
  website) kapan saja — perubahan otomatis ikut tampil di web.
