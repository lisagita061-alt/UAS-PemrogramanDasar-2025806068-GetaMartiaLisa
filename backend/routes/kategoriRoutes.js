const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');

// Endpoint: /api/kategori
router.get('/', kategoriController.getKategori);           // GET semua kategori
router.get('/:id', kategoriController.getKategoriById);    // GET kategori by ID
router.post('/', kategoriController.createKategori);       // POST tambah kategori
router.put('/:id', kategoriController.updateKategori);     // PUT update kategori
router.delete('/:id', kategoriController.deleteKategori);  // DELETE hapus kategori

module.exports = router;