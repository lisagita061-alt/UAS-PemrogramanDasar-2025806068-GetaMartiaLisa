const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesananController');

router.get('/', pesananController.getPesanan);
router.post('/', pesananController.createPesanan);
router.get('/:id/qr', pesananController.getQrPembayaran);
router.put('/:id/bayar', pesananController.konfirmasiPembayaran);
router.put('/:id/selesai', pesananController.selesaikanPesanan);
router.delete('/:id', pesananController.deletePesanan);

module.exports = router;