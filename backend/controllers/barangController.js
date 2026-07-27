const path = require('path');
const fs = require('fs');
const barangModel = require('../models/barangModel');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Helper: hapus file foto dari folder uploads (aman walau file tidak ada)
const hapusFileFoto = (namaFile) => {
    if (!namaFile) return;
    const filePath = path.join(uploadDir, namaFile);
    fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Gagal menghapus file foto:', err.message);
        } else if (!err) {
            console.log('File foto lama dihapus:', namaFile);
        }
    });
};

const getBarang = async (req, res) => {
    try {
        const data = await barangModel.getAllBarang();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('[getBarang] Error:', error.message);
        res.status(500).json({ success: false, message: 'Gagal mengambil data barang', error: error.message });
    }
};

const getBarangById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await barangModel.getBarangById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: `Barang dengan ID ${id} tidak ditemukan` });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('[getBarangById] Error:', error.message);
        res.status(500).json({ success: false, message: 'Gagal mengambil data barang', error: error.message });
    }
};

const createBarang = async (req, res) => {
    console.log('=== CREATE BARANG ===');
    console.log('Body diterima:', req.body);
    console.log('File diterima:', req.file ? req.file.filename : '(tidak ada file)');

    try {
        const { nama_barang, id_kategori, id_supplier, stok, harga, satuan } = req.body;

        if (!nama_barang || !stok || !harga) {
            if (req.file) hapusFileFoto(req.file.filename);
            return res.status(400).json({ success: false, message: 'Nama barang, stok, dan harga wajib diisi' });
        }

        const foto = req.file ? req.file.filename : null;

        const insertId = await barangModel.createBarang({
            nama_barang,
            id_kategori: id_kategori || null,
            id_supplier: id_supplier || null,
            stok,
            harga,
            satuan,
            foto
        });

        console.log('Barang berhasil dibuat, ID:', insertId, '| Foto disimpan:', foto);

        res.status(201).json({
            success: true,
            message: 'Barang berhasil ditambahkan',
            data: { id_barang: insertId, foto }
        });
    } catch (error) {
        console.error('[createBarang] Error:', error.message);
        if (req.file) hapusFileFoto(req.file.filename);
        res.status(500).json({ success: false, message: 'Gagal menambahkan barang', error: error.message });
    }
};

const updateBarang = async (req, res) => {
    console.log('=== UPDATE BARANG ID:', req.params.id, '===');
    console.log('Body diterima:', req.body);
    console.log('File baru diterima:', req.file ? req.file.filename : '(tidak ada file baru)');

    try {
        const { id } = req.params;
        const { nama_barang, id_kategori, id_supplier, stok, harga, satuan, fotoLama } = req.body;

        if (!nama_barang || !stok || !harga) {
            if (req.file) hapusFileFoto(req.file.filename);
            return res.status(400).json({ success: false, message: 'Nama barang, stok, dan harga wajib diisi' });
        }

        // Tentukan foto final:
        // - Kalau ada file BARU diupload -> pakai itu, hapus file lama
        // - Kalau TIDAK ada file baru -> tetap pakai foto lama (dikirim frontend lewat fotoLama)
        let foto;
        if (req.file) {
            foto = req.file.filename;
            if (fotoLama) hapusFileFoto(fotoLama);
        } else {
            foto = fotoLama && fotoLama.trim() !== '' ? fotoLama : null;
        }

        console.log('Foto final yang akan disimpan ke DB:', foto);

        const affectedRows = await barangModel.updateBarang(id, {
            nama_barang,
            id_kategori: id_kategori || null,
            id_supplier: id_supplier || null,
            stok,
            harga,
            satuan,
            foto
        });

        if (affectedRows === 0) {
            if (req.file) hapusFileFoto(req.file.filename);
            return res.status(404).json({ success: false, message: `Barang dengan ID ${id} tidak ditemukan` });
        }

        console.log('Barang ID', id, 'berhasil diupdate. Foto tersimpan:', foto);

        res.status(200).json({
            success: true,
            message: 'Barang berhasil diperbarui',
            data: { foto }
        });
    } catch (error) {
        console.error('[updateBarang] Error:', error.message);
        if (req.file) hapusFileFoto(req.file.filename);
        res.status(500).json({ success: false, message: 'Gagal memperbarui barang', error: error.message });
    }
};

const deleteBarang = async (req, res) => {
    try {
        const { id } = req.params;

        const barang = await barangModel.getBarangById(id);
        const affectedRows = await barangModel.deleteBarang(id);

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: `Barang dengan ID ${id} tidak ditemukan` });
        }

        if (barang && barang.foto) {
            hapusFileFoto(barang.foto);
        }

        res.status(200).json({ success: true, message: 'Barang berhasil dihapus' });
    } catch (error) {
        console.error('[deleteBarang] Error:', error.message);
        res.status(500).json({ success: false, message: 'Gagal menghapus barang', error: error.message });
    }
};

module.exports = {
    getBarang,
    getBarangById,
    createBarang,
    updateBarang,
    deleteBarang
};