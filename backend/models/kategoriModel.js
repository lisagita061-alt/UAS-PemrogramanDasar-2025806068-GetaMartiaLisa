const pool = require('../config/db');

const getAllKategori = async () => {
    const [rows] = await pool.query('SELECT * FROM kategori ORDER BY id_kategori DESC');
    return rows;
};

const getKategoriById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM kategori WHERE id_kategori = ?', [id]);
    return rows[0];
};

const createKategori = async (data) => {
    const { nama_kategori, keterangan } = data;
    const [result] = await pool.query(
        'INSERT INTO kategori (nama_kategori, keterangan) VALUES (?, ?)',
        [nama_kategori, keterangan]
    );
    return result.insertId;
};

const updateKategori = async (id, data) => {
    const { nama_kategori, keterangan } = data;
    const [result] = await pool.query(
        'UPDATE kategori SET nama_kategori = ?, keterangan = ? WHERE id_kategori = ?',
        [nama_kategori, keterangan, id]
    );
    return result.affectedRows;
};

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