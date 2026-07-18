const kategoriModel = require('../models/kategoriModel');

// GET semua kategori
const getKategori = async (req, res) => {
    try {
        const data = await kategoriModel.getAllKategori();
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori',
            error: error.message
        });
    }
};

// GET kategori by ID
const getKategoriById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await kategoriModel.getKategoriById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `Kategori dengan ID ${id} tidak ditemukan`
            });
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori',
            error: error.message
        });
    }
};

// POST tambah kategori baru
const createKategori = async (req, res) => {
    try {
        const { nama_kategori, keterangan } = req.body;

        // Validasi: nama kategori wajib diisi
        if (!nama_kategori) {
            return res.status(400).json({
                success: false,
                message: 'Nama kategori wajib diisi'
            });
        }

        const insertId = await kategoriModel.createKategori({ nama_kategori, keterangan });

        res.status(201).json({
            success: true,
            message: 'Kategori berhasil ditambahkan',
            data: { id_kategori: insertId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan kategori',
            error: error.message
        });
    }
};

// PUT update kategori
const updateKategori = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_kategori, keterangan } = req.body;

        if (!nama_kategori) {
            return res.status(400).json({
                success: false,
                message: 'Nama kategori wajib diisi'
            });
        }

        const affectedRows = await kategoriModel.updateKategori(id, { nama_kategori, keterangan });

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Kategori dengan ID ${id} tidak ditemukan`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Kategori berhasil diperbarui'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui kategori',
            error: error.message
        });
    }
};

// DELETE kategori
const deleteKategori = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await kategoriModel.deleteKategori(id);

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Kategori dengan ID ${id} tidak ditemukan`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Kategori berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus kategori',
            error: error.message
        });
    }
};

module.exports = {
    getKategori,
    getKategoriById,
    createKategori,
    updateKategori,
    deleteKategori
};