const pesananModel = require('../models/pesananModel');

const getPesanan = async (req, res) => {
    try {
        const data = await pesananModel.getAllPesanan();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan', error: error.message });
    }
};

const createPesanan = async (req, res) => {
    try {
        const { id_barang, jumlah } = req.body;

        if (!id_barang || !jumlah || jumlah <= 0) {
            return res.status(400).json({ success: false, message: 'Barang dan jumlah pesanan wajib diisi dengan benar' });
        }

        // Hitung total bayar = harga barang x jumlah
        const harga = await pesananModel.getHargaBarang(id_barang);
        const total_bayar = harga * jumlah;

        // Kode unik buat data yang di-encode ke QR pembayaran
        const kode_pembayaran = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const insertId = await pesananModel.createPesanan({ id_barang, jumlah, total_bayar, kode_pembayaran });

        res.status(201).json({
            success: true,
            message: 'Pesanan berhasil dibuat, menunggu pembayaran',
            data: { id_pesanan: insertId, total_bayar, kode_pembayaran }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal membuat pesanan', error: error.message });
    }
};

// Tandai pesanan selesai -> otomatis kurangi stok barang
const selesaikanPesanan = async (req, res) => {
    try {
        const { id } = req.params;
        const pesanan = await pesananModel.getPesananById(id);

        if (!pesanan) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
        }

        if (pesanan.status === 'Selesai') {
            return res.status(400).json({ success: false, message: 'Pesanan ini sudah selesai sebelumnya' });
        }

        if (pesanan.status_pembayaran !== 'Lunas') {
            return res.status(400).json({ success: false, message: 'Pesanan belum dibayar, tidak bisa diselesaikan' });
        }

        const stokBerhasilDikurangi = await pesananModel.kurangiStokBarang(pesanan.id_barang, pesanan.jumlah);

        if (stokBerhasilDikurangi === 0) {
            return res.status(400).json({ success: false, message: 'Stok barang tidak mencukupi untuk menyelesaikan pesanan ini' });
        }

        await pesananModel.updateStatusPesanan(id, 'Selesai');

        res.status(200).json({ success: true, message: 'Pesanan selesai diproses, stok barang telah diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses pesanan', error: error.message });
    }
};

// Ambil data pesanan buat ditampilkan sebagai QR pembayaran
const getQrPembayaran = async (req, res) => {
    try {
        const { id } = req.params;
        const pesanan = await pesananModel.getPesananById(id);

        if (!pesanan) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
        }

        if (pesanan.status_pembayaran === 'Lunas') {
            return res.status(400).json({ success: false, message: 'Pesanan ini sudah lunas' });
        }

        // String yang nanti di-encode jadi QR code di frontend
        const dataQR = JSON.stringify({
            kode: pesanan.kode_pembayaran,
            barang: pesanan.nama_barang,
            jumlah: pesanan.jumlah,
            total: pesanan.total_bayar
        });

        res.status(200).json({
            success: true,
            data: { ...pesanan, qr_string: dataQR }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data pembayaran', error: error.message });
    }
};

// Konfirmasi pembayaran (simulasi "sudah discan / sudah dibayar")
const konfirmasiPembayaran = async (req, res) => {
    try {
        const { id } = req.params;
        const { metode_pembayaran } = req.body;

        const pesanan = await pesananModel.getPesananById(id);
        if (!pesanan) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
        }

        if (pesanan.status_pembayaran === 'Lunas') {
            return res.status(400).json({ success: false, message: 'Pesanan ini sudah lunas sebelumnya' });
        }

        await pesananModel.konfirmasiPembayaran(id, metode_pembayaran);

        res.status(200).json({ success: true, message: 'Pembayaran berhasil dikonfirmasi' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengonfirmasi pembayaran', error: error.message });
    }
};

const deletePesanan = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await pesananModel.deletePesanan(id);

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
        }

        res.status(200).json({ success: true, message: 'Pesanan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus pesanan', error: error.message });
    }
};

module.exports = {
    getPesanan,
    createPesanan,
    selesaikanPesanan,
    getQrPembayaran,
    konfirmasiPembayaran,
    deletePesanan
};