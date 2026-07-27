const pool = require('../config/db');

const getAllSupplier = async () => {
    const [rows] = await pool.query('SELECT * FROM supplier ORDER BY id_supplier DESC');
    return rows;
};

const getSupplierById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM supplier WHERE id_supplier = ?', [id]);
    return rows[0];
};

const createSupplier = async (data) => {
    const { nama_supplier, kontak, alamat } = data;
    const [result] = await pool.query(
        'INSERT INTO supplier (nama_supplier, kontak, alamat) VALUES (?, ?, ?)',
        [nama_supplier, kontak, alamat]
    );
    return result.insertId;
};

const updateSupplier = async (id, data) => {
    const { nama_supplier, kontak, alamat } = data;
    const [result] = await pool.query(
        'UPDATE supplier SET nama_supplier = ?, kontak = ?, alamat = ? WHERE id_supplier = ?',
        [nama_supplier, kontak, alamat, id]
    );
    return result.affectedRows;
};

const deleteSupplier = async (id) => {
    const [result] = await pool.query('DELETE FROM supplier WHERE id_supplier = ?', [id]);
    return result.affectedRows;
};

module.exports = {
    getAllSupplier,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};