const pool = require('../config/db');

// Ambil semua pesanan, join dengan nama barang
const getAllPesanan = async () => {
    const [rows] = await pool.query(`
        SELECT p.*, b.nama_barang, b.stok AS stok_tersedia, b.harga
        FROM pesanan p
        LEFT JOIN barang b ON p.id_barang = b.id_barang
        ORDER BY p.id_pesanan DESC
    `);
    return rows;
};

const getPesananById = async (id) => {
    const [rows] = await pool.query(`
        SELECT p.*, b.nama_barang, b.stok AS stok_tersedia, b.harga
        FROM pesanan p
        LEFT JOIN barang b ON p.id_barang = b.id_barang
        WHERE p.id_pesanan = ?
    `, [id]);
    return rows[0];
};

// Ambil harga barang, dipakai buat hitung total_bayar
const getHargaBarang = async (id_barang) => {
    const [rows] = await pool.query('SELECT harga FROM barang WHERE id_barang = ?', [id_barang]);
    return rows[0] ? rows[0].harga : 0;
};

// Buat pesanan baru (status otomatis 'Pending', status_pembayaran 'Belum Bayar')
const createPesanan = async (data) => {
    const { id_barang, jumlah, total_bayar, kode_pembayaran } = data;
    const [result] = await pool.query(
        `INSERT INTO pesanan (id_barang, jumlah, status, total_bayar, status_pembayaran, kode_pembayaran)
         VALUES (?, ?, 'Pending', ?, 'Belum Bayar', ?)`,
        [id_barang, jumlah, total_bayar, kode_pembayaran]
    );
    return result.insertId;
};

// Update status pesanan (Pending / Selesai)
const updateStatusPesanan = async (id, status) => {
    const [result] = await pool.query(
        'UPDATE pesanan SET status = ? WHERE id_pesanan = ?',
        [status, id]
    );
    return result.affectedRows;
};

// Tandai pesanan sudah dibayar (dipanggil setelah scan/konfirmasi QR)
const konfirmasiPembayaran = async (id, metode_pembayaran) => {
    const [result] = await pool.query(
        `UPDATE pesanan
         SET status_pembayaran = 'Lunas', metode_pembayaran = ?, tanggal_bayar = NOW()
         WHERE id_pesanan = ?`,
        [metode_pembayaran || 'QRIS', id]
    );
    return result.affectedRows;
};

// Kurangi stok barang (dipanggil saat pesanan ditandai Selesai)
const kurangiStokBarang = async (id_barang, jumlah) => {
    const [result] = await pool.query(
        'UPDATE barang SET stok = stok - ? WHERE id_barang = ? AND stok >= ?',
        [jumlah, id_barang, jumlah]
    );
    return result.affectedRows;
};

const deletePesanan = async (id) => {
    const [result] = await pool.query('DELETE FROM pesanan WHERE id_pesanan = ?', [id]);
    return result.affectedRows;
};

module.exports = {
    getAllPesanan,
    getPesananById,
    getHargaBarang,
    createPesanan,
    updateStatusPesanan,
    konfirmasiPembayaran,
    kurangiStokBarang,
    deletePesanan
};