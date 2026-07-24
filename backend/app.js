const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const barangRoutes = require('./routes/barangRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');

const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});