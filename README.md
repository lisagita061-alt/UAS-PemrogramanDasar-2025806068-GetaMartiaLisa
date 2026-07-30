# 📦 Mini Inventory System

Aplikasi manajemen inventaris sederhana berbasis web untuk mengelola data barang, kategori, dan supplier.

## 👤 Identitas

- **Nama**: [Geta Martia Lisa]
- **NIM**: 2025806068
- **Kelas**: Teknologi Informasi / 2 Pagi
- **Mata Kuliah**: Pemrograman Dasar
- **Dosen**: Rintis Mardika Sunarto

## 📋 Tema Proyek

**Mini Inventory System** — aplikasi untuk mengelola data barang beserta kategori dan supplier-nya, lengkap dengan fitur pencatatan stok dan harga.

## 📝 Deskripsi Aplikasi

Aplikasi ini memungkinkan pengguna untuk melakukan pencatatan barang inventaris secara digital, meliputi penambahan, pengeditan, penghapusan, dan penampilan data barang yang terhubung dengan kategori melalui relasi database. Data tersimpan secara real-time menggunakan REST API dan database MySQL.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (Fetch API, Async/Await, DOM Manipulation), [qrcodejs] untuk generate QR code CDN
- **Backend**: Node.js, Express.js, 
- Multer (upload file/foto)
- dotenv, cors
- **Database**: MySQL
- **Tools**: XAMPP, phpMyAdmin, VS Code, Thunder Client

## ✨ Fitur Utama

- CRUD lengkap untuk Barang dan Kategori (Create, Read, Update, Delete)
- Validasi input (field wajib diisi)
- Tampilan responsive (desktop & mobile)

## 🎁 Fitur Tambahan (Bonus)

- 📊 Dashboard statistik dengan animasi counter (total barang, total stok, total nilai inventaris)
- ⚠️ Banner peringatan otomatis untuk barang dengan stok menipis (< 10)
- 🔍 Search/filter barang secara real-time
- 🌙 Dark mode
- 🔔 Toast notification (pengganti alert bawaan browser)
- 🏷️ Badge status stok (Menipis / Aman)
- 🪟 Modal konfirmasi custom untuk aksi hapus
- 💸Pesanan & Pembayaran QRIS** — buat pesanan, bayar via simulasi QR code, cetak nota setelah pembayaran lunas, lalu tandai pesanan selesai (otomatis mengurangi stok)
- 🧾cetak nota, bukti pembayaran 
-🧾export & laporan csv inventaris 


## 📁 Struktur Project
UAS-PEMROGRAMANDASAR/2025806068/GetaMartiaLisa
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── barangController.js
│   │   ├── kategoriController.js
│   │   ├── pesananController.js
│   │   └── supplierController.js
│   ├── middleware/
│   │   └── upload.js
│   ├── models/
│   │   ├── barangModel.js
│   │   ├── kategoriModel.js
│   │   ├── pesananModel.js
│   │   └── supplierModel.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── barangRoutes.js
│   │   ├── kategoriRoutes.js
│   │   ├── pesananRoutes.js
│   │   └── supplierRoutes.js
│   ├── uploads/
│   │   ├── .gitkeep
│   │   ├── 1785148453796-835260244.jpg
│   │   ├── 1785148474390-527374257.jpg
│   │   ├── 1785148512622-834389988.jpg
│   │   ├── 1785148576132-852555339.jpg
│   │   ├── 1785148624933-129365704.jpg
│   │   ├── 1785148671575-649868293.jpg
│   │   ├── 1785148706612-396588550.jpg
│   │   ├── 1785148724584-676848582.jpg
│   │   └── 1785148750067-479006016.jpg
│   ├── .env
│   ├── .env.example
│   ├── app.js
│   ├── package-lock.json
│   └── package.json
├── database/
│   └── database.sql
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── barang.js
│   │   ├── kategori.js
│   │   ├── nav.js
│   │   ├── pesanan.js
│   │   └── supplier.js
│   └── index.html
├── screenshots/
│   ├── dashboard.png
│   ├── database.png
│   └── form.png
├── .gitignore
├── LICENSE
└── README.md

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone https://github.com/username/UAS-PemrogramanDasar-2025806068-GetaMartiaLisa.git
cd UAS-PemrogramanDasar-2025806068-GetaMartiaLisa
```

### 2. Setup Database
- Buka XAMPP, jalankan **Apache** dan **MySQL**
- Buka `http://localhost/phpmyadmin`
- Import file `database/database.sql`

### 3. Setup Backend
```bash
cd backend
npm install
```
- Copy file `.env.example` menjadi `.env`
- Sesuaikan isi `.env` dengan konfigurasi database lokal Anda
```bash
npx nodemon app.js
```
- Server akan berjalan di `http://localhost:5000`

### 4. Jalankan Frontend
- Buka file `frontend/index.html` langsung di browser, atau
- Gunakan ekstensi **Live Server** di VS Code untuk hasil terbaik

## 🔌 Daftar API Endpoint

### Barang — `/api/barang`
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET    | `/api/barang` | Ambil semua data barang |
| GET    | `/api/barang/:id` | Ambil satu data barang |
| POST   | `/api/barang` | Tambah barang baru (multipart/form-data, field foto: `foto`) |
| PUT    | `/api/barang/:id` | Update barang (multipart/form-data) |
| DELETE | `/api/barang/:id` | Hapus barang |

### Kategori — `/api/kategori`
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET    | `/api/kategori` | Ambil semua kategori |
| GET    | `/api/kategori/:id` | Ambil satu kategori |
| POST   | `/api/kategori` | Tambah kategori |
| PUT    | `/api/kategori/:id` | Update kategori |
| DELETE | `/api/kategori/:id` | Hapus kategori |

### Supplier — `/api/supplier`
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET    | `/api/supplier` | Ambil semua supplier |
| GET    | `/api/supplier/:id` | Ambil satu supplier |
| POST   | `/api/supplier` | Tambah supplier |
| PUT    | `/api/supplier/:id` | Update supplier |
| DELETE | `/api/supplier/:id` | Hapus supplier |

### Pesanan & Pembayaran — `/api/pesanan`
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET    | `/api/pesanan` | Ambil semua pesanan |
| POST   | `/api/pesanan` | Buat pesanan baru (total bayar dihitung otomatis) |
| GET    | `/api/pesanan/:id/qr` | Ambil data untuk generate QR pembayaran |
| PUT    | `/api/pesanan/:id/bayar` | Konfirmasi pembayaran (tandai lunas) |
| PUT    | `/api/pesanan/:id/selesai` | Tandai pesanan selesai (mengurangi stok, hanya bisa jika sudah lunas) |
| DELETE | `/api/pesanan/:id` | Hapus pesanan |

## 📸 Screenshot Aplikasi

![Dashboard](screenshots/dashboard.png)
![Form Tambah Barang](screenshots/form.png)
![Database](screenshots/database.png)

## 🔗 Link Repository

[https://github.com/username/UAS-PemrogramanDasar-2025806068-GetaMartiaLisa]