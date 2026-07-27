const supplierModel = require('../models/supplierModel');

const getSupplier = async (req, res) => {
    try {
        const data = await supplierModel.getAllSupplier();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data supplier', error: error.message });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await supplierModel.getSupplierById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: `Supplier dengan ID ${id} tidak ditemukan` });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data supplier', error: error.message });
    }
};

const createSupplier = async (req, res) => {
    try {
        const { nama_supplier, kontak, alamat } = req.body;

        if (!nama_supplier) {
            return res.status(400).json({ success: false, message: 'Nama supplier wajib diisi' });
        }

        const insertId = await supplierModel.createSupplier({ nama_supplier, kontak, alamat });

        res.status(201).json({
            success: true,
            message: 'Supplier berhasil ditambahkan',
            data: { id_supplier: insertId }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambahkan supplier', error: error.message });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_supplier, kontak, alamat } = req.body;

        if (!nama_supplier) {
            return res.status(400).json({ success: false, message: 'Nama supplier wajib diisi' });
        }

        const affectedRows = await supplierModel.updateSupplier(id, { nama_supplier, kontak, alamat });

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: `Supplier dengan ID ${id} tidak ditemukan` });
        }

        res.status(200).json({ success: true, message: 'Supplier berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui supplier', error: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await supplierModel.deleteSupplier(id);

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: `Supplier dengan ID ${id} tidak ditemukan` });
        }

        res.status(200).json({ success: true, message: 'Supplier berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus supplier', error: error.message });
    }
};

module.exports = {
    getSupplier,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};