# Aplikasi Manajemen Barang

Aplikasi manajemen barang berbasis web untuk membantu pengelolaan data barang dan transaksi secara terstruktur.

## 1. Link Deployment

- **Live App:** [URL Aplikasi](https://laravel-jmc-production.up.railway.app)
- **Video Demo:** [URL Video Demo](https://drive.google.com/file/d/12eL0WPs6yoW43MU8N3x8nbvF2kU0Uz8P/view?usp=sharing)

## 2. Tech Stack

Teknologi yang digunakan dalam pengembangan aplikasi:

- **Frontend:** React, TypeScript, Inertia.js, Tailwind CSS
- **Backend:** PHP, Laravel 13
- **Database:** MySQL
- **Package Manager:** npm dan Composer

## 3. Petunjuk Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal.

### Prasyarat

Pastikan perangkat sudah memiliki:

- PHP sesuai versi yang didukung aplikasi
- Composer
- Node.js dan npm
- MySQL
- Git

### Langkah Instalasi

**1. Clone repository**

```bash
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER_REPOSITORY>
```

**2. Install dependency frontend**

```bash
npm install
```

**3. Install dependency backend**

```bash
composer install
```

**4. Buat Database**

Buat database anda di lokal Mysql

**5. Generate application key**

```bash
php artisan key:generate
```

**6. Jalankan instalasi aplikasi**

```bash
php artisan app:install
```

Perintah tersebut digunakan untuk menjalankan proses instalasi aplikasi yang telah dikonfigurasi di dalam proyek.

### 7. Jalankan Aplikasi

Aplikasi dapat dijalankan menggunakan **Laragon** atau **Laravel Herd**.

**1. Jalankan web server**

Pastikan Laragon atau Laravel Herd sudah aktif dan repository berada di direktori yang terdeteksi oleh web server.

**2. Jalankan frontend**

Buka terminal pada direktori proyek, lalu jalankan:

```bash
npm run dev
```

**3. Akses aplikasi**

Buka aplikasi melalui domain lokal `.test` yang telah dikonfigurasi pada Laragon atau Laravel Herd.

Contoh:

http://nama-proyek.test

Ganti `nama-proyek` dengan nama domain lokal yang dikonfigurasi untuk proyek tersebut.

**Catatan:** Pastikan document root domain diarahkan ke direktori `public` milik Laravel agar aplikasi dapat diakses dengan benar.

### Konfigurasi Database

Sebelum menjalankan aplikasi, pastikan konfigurasi database pada file `.env` sesuai dengan lingkungan lokal.

Sesuaikan variabel berikut:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=
```

Pastikan database MySQL sudah tersedia dan dapat diakses oleh aplikasi.

## 4. Akun Pengujian

Gunakan kredensial berikut untuk login dan menguji aplikasi.

| Role       | Email                 | Password   |
| ---------- | --------------------- | ---------- |
| Admin      | admin@example.com     | `password` |
| Operator 1 | operator1@example.com | `password` |
| Operator 2 | operator2@example.com | `password` |
| Operator 3 | operator3@example.com | `password` |

**Catatan:** Pastikan akun pengujian sudah dibuat melalui seeder atau proses instalasi aplikasi sebelum login.

## 5. Catatan

- Pastikan seluruh dependency berhasil diinstal sebelum menjalankan aplikasi.
- Jika aplikasi menggunakan layanan eksternal, sesuaikan konfigurasi `.env` berdasarkan kebutuhan proyek.
