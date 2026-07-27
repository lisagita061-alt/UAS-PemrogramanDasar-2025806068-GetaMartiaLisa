const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const pool = require('./config/db');
const barangRoutes = require('./routes/barangRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const pesananRoutes = require('./routes/pesananRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Supaya foto barang di folder /uploads bisa diakses lewat browser
// contoh: http://localhost:5000/uploads/namafile.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS hasil');
        res.json({
            message: 'Server backend berjalan dengan baik!',
            test_database: rows[0].hasil
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server jalan, tapi database gagal terhubung',
            error: error.message
        });
    }
});

app.use('/api/barang', barangRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/pesanan', pesananRoutes);
app.use('/api/supplier', supplierRoutes);

// Tangkap error dari Multer (misal file terlalu besar / tipe salah)
app.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Terjadi kesalahan saat upload file'
        });
    }
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});