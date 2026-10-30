# KNOWLEDGE TEST SOFTWARE ENGINEER PT WIDYA INFORMASI NUSANTARA

REST API untuk portal autentikasi. Pengguna bisa membuat akun, login, lalu mengakses profil mereka menggunakan token JWT.

## Tech Stack

- Node.js dan Express 5
- TypeScript
- PostgreSQL dengan Prisma 7
- JWT (`jsonwebtoken`) dan `bcrypt` untuk hash password
- `zod` untuk validasi input
- Swagger UI untuk dokumentasi API

## Endpoint

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| GET | `/health` | Tidak | Cek server berjalan |
| POST | `/auth/register` | Tidak | Membuat akun baru |
| POST | `/auth/login` | Tidak | Login dan mendapatkan access token |
| GET | `/users/profile` | Bearer token | Mengambil profil user yang sedang login |

Dokumentasi lengkap dan interaktif ada di `http://localhost:8000/docs` setelah aplikasi berjalan.

## Prasyarat

- Node.js 22.9 atau lebih baru (dites di 22.16)
- npm
- Database PostgreSQL, bisa dipilih salah satu:
  - PostgreSQL yang terpasang di komputer sendiri
  - PostgreSQL gratis di cloud, misalnya Neon, Supabase, atau Prisma Postgres

File `.env` tidak ikut di repo, jadi database harus disiapkan sendiri dan connection string-nya diisi di langkah 3.

## Cara Menjalankan di Local

1. Clone repo dan masuk ke foldernya.

   ```bash
   git clone <url-repo>
   cd pt-widya
   ```

2. Install dependency. Perintah ini juga membuat Prisma Client secara otomatis.

   ```bash
   npm install
   ```

3. Buat file `.env` dari contoh, lalu isi nilainya.

   ```bash
   cp .env.example .env
   ```

   | Variabel | Wajib | Keterangan |
   |----------|-------|------------|
   | `DATABASE_URL` | Ya | Connection string PostgreSQL, contoh `postgres://user:password@localhost:5432/nama_db` |
   | `JWT_SECRET` | Ya | String acak yang panjang untuk menandatangani token |
   | `JWT_EXPIRES_IN` | Tidak | Masa berlaku token, default `1d` |
   | `PORT` | Tidak | Port server, default `8000` |

   Cara membuat `JWT_SECRET` acak:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. Buat tabel di database.

   ```bash
   npx prisma migrate deploy
   ```

5. Jalankan server dalam mode development (restart otomatis saat kode berubah).

   ```bash
   npm run dev
   ```

6. Pastikan berjalan. Buka `http://localhost:8000/health`, hasilnya harus `{"status":"ok"}`. Dokumentasi API ada di `http://localhost:8000/docs`.

## Mencoba API

Lewat curl:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi Santoso","email":"budi@mail.com","gender":"MALE","password":"rahasia123","confirmPassword":"rahasia123"}'
```

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"budi@mail.com","password":"rahasia123"}'
```

Salin nilai `accessToken` dari response login, lalu pakai di header `Authorization`:

```bash
curl http://localhost:8000/users/profile \
  -H "Authorization: Bearer <accessToken>"
```

Lewat Swagger UI: buka `http://localhost:8000/docs`, jalankan register dan login, klik tombol **Authorize** di kanan atas, tempel `accessToken`, lalu coba `GET /users/profile`.

## Script npm

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Menjalankan server dengan nodemon dan tsx |
| `npm run build` | Generate Prisma Client dan compile TypeScript ke `dist/` |
| `npm start` | Menjalankan hasil build dari `dist/` |

Untuk menjalankan versi production di local:

```bash
npm run build
npm start
```

## Struktur Folder

```
src/
  config/        pembacaan environment variable
  features/
    auth/        register dan login (routes, controller, service, validator)
    users/       profile (routes, controller, service)
  lib/           Prisma client
  middlewares/   autentikasi token dan error handler
  server.ts      setup Express dan start server
prisma/          schema dan migrasi database
docs/            spesifikasi OpenAPI untuk Swagger UI
```

## Asumsi dan Keputusan Desain

- Data akun: nama, email, jenis kelamin (`MALE` atau `FEMALE`), dan password. Password ditambahkan karena login membutuhkannya.
- Password disimpan sebagai hash bcrypt, tidak pernah dikembalikan di response.
- `confirmPassword` hanya dipakai untuk validasi saat register dan tidak disimpan.
- Email disimpan dalam huruf kecil dan harus unik.
- Autentikasi memakai satu access token JWT yang dikirim lewat header `Authorization: Bearer <token>`, berlaku 1 hari. Refresh token tidak dibuat karena tidak diminta.
- Logout tidak ada di endpoint. Logout dilakukan di sisi client dengan membuang token.
- Pesan error login sama untuk email tidak terdaftar maupun password salah, agar email yang terdaftar tidak bisa ditebak.

## Troubleshooting

- **`JWT_SECRET is not set`**: isi `JWT_SECRET` di `.env`.
- **Error koneksi database atau `P1001`**: periksa `DATABASE_URL`, pastikan database aktif dan bisa diakses.
- **Tabel `users` tidak ditemukan**: jalankan `npx prisma migrate deploy`.
- **Port sudah dipakai**: ubah `PORT` di `.env`. Di macOS, port 5000 sering dipakai AirPlay Receiver.
