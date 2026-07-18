const pool = require('../config/db');

// Ambil semua data kategori
const getAllKategori = async () => {
    const [rows] = await pool.query('SELECT * FROM kategori ORDER BY id_kategori DESC');
    return rows;
};

// Ambil satu kategori berdasarkan ID
const getKategoriById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM kategori WHERE id_kategori = ?', [id]);
    return rows[0];
};

// Tambah kategori baru
const createKategori = async (data) => {
    const { nama_kategori, keterangan } = data;
    const [result] = await pool.query(
        'INSERT INTO kategori (nama_kategori, keterangan) VALUES (?, ?)',
        [nama_kategori, keterangan]
    );
    return result.insertId;
};

// Update kategori berdasarkan ID
const updateKategori = async (id, data) => {
    const { nama_kategori, keterangan } = data;
    const [result] = await pool.query(
        'UPDATE kategori SET nama_kategori = ?, keterangan = ? WHERE id_kategori = ?',
        [nama_kategori, keterangan, id]
    );
    return result.affectedRows;
};

// Hapus kategori berdasarkan ID
const deleteKategori = async (id) => {
    const [result] = await pool.query('DELETE FROM kategori WHERE id_kategori = ?', [id]);
    return result.affectedRows;
};

module.exports = {
    getAllKategori,
    getKategoriById,
    createKategori,
    updateKategori,
    deleteKategori
};