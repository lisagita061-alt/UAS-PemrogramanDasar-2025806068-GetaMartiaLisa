-- Membuat database
CREATE DATABASE IF NOT EXISTS mini_inventory;
USE mini_inventory;

-- Tabel kategori
CREATE TABLE kategori (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL,
    keterangan VARCHAR(255)
);

-- Tabel supplier
CREATE TABLE supplier (
    id_supplier INT AUTO_INCREMENT PRIMARY KEY,
    nama_supplier VARCHAR(100) NOT NULL,
    kontak VARCHAR(20),
    alamat VARCHAR(255)
);

-- Tabel barang (punya 2 foreign key -> relasi ke kategori & supplier)
CREATE TABLE barang (
    id_barang INT AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(100) NOT NULL,
    id_kategori INT,
    id_supplier INT,
    stok INT NOT NULL DEFAULT 0,
    harga DECIMAL(12,2) NOT NULL DEFAULT 0,
    satuan VARCHAR(20) DEFAULT 'pcs',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori)
        ON DELETE SET NULL,
    FOREIGN KEY (id_supplier) REFERENCES supplier(id_supplier)
        ON DELETE SET NULL
);

-- Data contoh
INSERT INTO kategori (nama_kategori, keterangan) VALUES
('Elektronik', 'Barang-barang elektronik kantor'),
('ATK', 'Alat Tulis Kantor'),
('Furniture', 'Perabotan kantor');

INSERT INTO supplier (nama_supplier, kontak, alamat) VALUES
('CV Sumber Makmur', '081234567890', 'Jl. Merdeka No. 10, Tangerang'),
('PT Alat Jaya', '081298765432', 'Jl. Sudirman No. 5, Jakarta');

INSERT INTO barang (nama_barang, id_kategori, id_supplier, stok, harga, satuan) VALUES
('Laptop Asus X441', 1, 2, 15, 6500000, 'unit'),
('Pulpen Standard', 2, 1, 200, 2500, 'pcs'),
('Kursi Kantor', 3, 1, 30, 350000, 'unit');