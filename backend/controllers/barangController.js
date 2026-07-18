const barangModel = require('../models/barangModel');

// GET semua barang
const getBarang = async (req, res) => {
    try {
        const data = await barangModel.getAllBarang();
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data barang',
            error: error.message
        });
    }
};

// GET barang by ID
const getBarangById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await barangModel.getBarangById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `Barang dengan ID ${id} tidak ditemukan`
            });
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data barang',
            error: error.message
        });
    }
};

// POST tambah barang baru
const createBarang = async (req, res) => {
    try {
        const { nama_barang, id_kategori, id_supplier, stok, harga, satuan } = req.body;

        // Validasi sederhana: field wajib tidak boleh kosong
        if (!nama_barang || !stok || !harga) {
            return res.status(400).json({
                success: false,
                message: 'Nama barang, stok, dan harga wajib diisi'
            });
        }

        const insertId = await barangModel.createBarang({
            nama_barang, id_kategori, id_supplier, stok, harga, satuan
        });

        res.status(201).json({
            success: true,
            message: 'Barang berhasil ditambahkan',
            data: { id_barang: insertId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan barang',
            error: error.message
        });
    }
};

// PUT update barang
const updateBarang = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_barang, id_kategori, id_supplier, stok, harga, satuan } = req.body;

        if (!nama_barang || !stok || !harga) {
            return res.status(400).json({
                success: false,
                message: 'Nama barang, stok, dan harga wajib diisi'
            });
        }

        const affectedRows = await barangModel.updateBarang(id, {
            nama_barang, id_kategori, id_supplier, stok, harga, satuan
        });

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Barang dengan ID ${id} tidak ditemukan`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Barang berhasil diperbarui'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui barang',
            error: error.message
        });
    }
};

// DELETE barang
const deleteBarang = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await barangModel.deleteBarang(id);

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Barang dengan ID ${id} tidak ditemukan`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Barang berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus barang',
            error: error.message
        });
    }
};

module.exports = {
    getBarang,
    getBarangById,
    createBarang,
    updateBarang,
    deleteBarang
};