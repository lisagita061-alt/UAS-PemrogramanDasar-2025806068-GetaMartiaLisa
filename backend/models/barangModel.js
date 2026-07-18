const pool = require('../config/db');

// Ambil semua data barang (join dengan kategori & supplier biar nama-nya ikut tampil)
const getAllBarang = async () => {
    const [rows] = await pool.query(`
        SELECT b.*, k.nama_kategori, s.nama_supplier
        FROM barang b
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
        LEFT JOIN supplier s ON b.id_supplier = s.id_supplier
        ORDER BY b.id_barang DESC
    `);
    return rows;
};

// Ambil satu barang berdasarkan ID
const getBarangById = async (id) => {
    const [rows] = await pool.query(`
        SELECT b.*, k.nama_kategori, s.nama_supplier
        FROM barang b
        LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
        LEFT JOIN supplier s ON b.id_supplier = s.id_supplier
        WHERE b.id_barang = ?
    `, [id]);
    return rows[0]; // ambil objek pertama saja, karena ID pasti unik
};

// Tambah barang baru
const createBarang = async (data) => {
    const { nama_barang, id_kategori, id_supplier, stok, harga, satuan } = data;
    const [result] = await pool.query(
        `INSERT INTO barang (nama_barang, id_kategori, id_supplier, stok, harga, satuan)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nama_barang, id_kategori, id_supplier, stok, harga, satuan]
    );
    return result.insertId; // kembalikan ID barang yang baru dibuat
};

// Update barang berdasarkan ID
const updateBarang = async (id, data) => {
    const { nama_barang, id_kategori, id_supplier, stok, harga, satuan } = data;
    const [result] = await pool.query(
        `UPDATE barang
         SET nama_barang = ?, id_kategori = ?, id_supplier = ?, stok = ?, harga = ?, satuan = ?
         WHERE id_barang = ?`,
        [nama_barang, id_kategori, id_supplier, stok, harga, satuan, id]
    );
    return result.affectedRows; // jumlah baris yang berhasil diubah
};

// Hapus barang berdasarkan ID
const deleteBarang = async (id) => {
    const [result] = await pool.query('DELETE FROM barang WHERE id_barang = ?', [id]);
    return result.affectedRows;
};

module.exports = {
    getAllBarang,
    getBarangById,
    createBarang,
    updateBarang,
    deleteBarang
};