const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');
const upload = require('../middleware/upload');

router.get('/', barangController.getBarang);              // GET semua barang
router.get('/:id', barangController.getBarangById);        // GET barang by ID
router.post('/', upload.single('foto'), barangController.createBarang);   // POST tambah barang
router.put('/:id', upload.single('foto'), barangController.updateBarang); // PUT update barang
router.delete('/:id', barangController.deleteBarang);       // DELETE hapus barang

module.exports = router;