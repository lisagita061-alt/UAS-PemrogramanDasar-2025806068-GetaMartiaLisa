// ===== Variabel Global Pesanan =====
const pesananForm = document.getElementById('pesananForm');
const pesananTableBody = document.getElementById('pesananTableBody');
const pesananBarangSelect = document.getElementById('pesananBarangSelect');
const pesananJumlahInput = document.getElementById('pesananJumlah');
let semuaPesanan = [];

// ===== Isi Dropdown Barang untuk Pesanan =====
async function loadBarangUntukPesanan() {
    try {
        const response = await fetch(`${API_URL}/barang`);
        const result = await response.json();

        if (result.success) {
            pesananBarangSelect.innerHTML = '<option value="">-- Pilih Barang --</option>';
            result.data.forEach(barang => {
                const option = document.createElement('option');
                option.value = barang.id_barang;
                option.textContent = `${barang.nama_barang} (Stok: ${barang.stok})`;
                pesananBarangSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Gagal memuat daftar barang:', error);
    }
}

// ===== Tampilkan Daftar Pesanan =====
async function loadPesanan() {
    try {
        const response = await fetch(`${API_URL}/pesanan`);
        const result = await response.json();

        if (result.success) {
            semuaPesanan = result.data;
            renderPesananTable(result.data);
        }
    } catch (error) {
        console.error('Gagal memuat pesanan:', error);
        pesananTableBody.innerHTML = `<tr><td colspan="7">Gagal memuat data pesanan.</td></tr>`;
    }
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

function renderPesananTable(dataPesanan) {
    pesananTableBody.innerHTML = '';

    if (dataPesanan.length === 0) {
        pesananTableBody.innerHTML = `<tr><td colspan="7">Belum ada pesanan.</td></tr>`;
        return;
    }

    dataPesanan.forEach(pesanan => {
        const row = document.createElement('tr');

        const statusBadge = pesanan.status === 'Selesai'
            ? '<span class="badge badge-safe">Selesai</span>'
            : '<span class="badge badge-low">Pending</span>';

        const pembayaranBadge = pesanan.status_pembayaran === 'Lunas'
            ? `<span class="badge badge-lunas">Lunas${pesanan.metode_pembayaran ? ' - ' + pesanan.metode_pembayaran : ''}</span>`
            : '<span class="badge badge-pending">Belum Bayar</span>';

        const tanggal = new Date(pesanan.tanggal_pesan).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        let tombolAksi = '';

        // Kalau belum lunas -> tombol Bayar
        if (pesanan.status_pembayaran !== 'Lunas') {
            tombolAksi += `<button class="btn btn-bayar" onclick="bukaModalBayar(${pesanan.id_pesanan})">Bayar</button>`;
        }

        // Kalau sudah lunas -> bisa cetak nota
        if (pesanan.status_pembayaran === 'Lunas') {
            tombolAksi += `<button class="btn btn-cetak" onclick="cetakNota(${pesanan.id_pesanan})">Cetak Nota</button>`;
        }

        // Kalau sudah lunas & masih pending -> boleh diselesaikan
        if (pesanan.status_pembayaran === 'Lunas' && pesanan.status === 'Pending') {
            tombolAksi += `<button class="btn btn-primary" onclick="selesaikanPesanan(${pesanan.id_pesanan})">Tandai Selesai</button>`;
        }

        tombolAksi += `<button class="btn btn-delete" onclick="hapusPesanan(${pesanan.id_pesanan})">Hapus</button>`;

        row.innerHTML = `
            <td>${pesanan.nama_barang || '-'}</td>
            <td>${pesanan.jumlah}</td>
            <td>${formatRupiah(pesanan.total_bayar || 0)}</td>
            <td>${pembayaranBadge}</td>
            <td>${statusBadge}</td>
            <td>${tanggal}</td>
            <td>${tombolAksi}</td>
        `;

        pesananTableBody.appendChild(row);
    });
}

// ===== Submit Form Buat Pesanan =====
pesananForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        id_barang: pesananBarangSelect.value,
        jumlah: pesananJumlahInput.value
    };

    try {
        const response = await fetch(`${API_URL}/pesanan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            pesananForm.reset();
            loadPesanan();
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        showToast('Terjadi kesalahan saat membuat pesanan.', 'error');
    }
});

// ===== Modal Pembayaran QRIS =====
const qrisModalOverlay = document.getElementById('qrisModalOverlay');
const qrisNamaBarang = document.getElementById('qrisNamaBarang');
const qrisTotal = document.getElementById('qrisTotal');
const qrisCancelBtn = document.getElementById('qrisCancelBtn');
const qrisConfirmBtn = document.getElementById('qrisConfirmBtn');
const qriscodeContainer = document.getElementById('qriscode');
let idPesananYangDibayar = null;

async function bukaModalBayar(id) {
    try {
        const response = await fetch(`${API_URL}/pesanan/${id}/qr`);
        const result = await response.json();

        if (!result.success) {
            showToast('Gagal: ' + result.message, 'error');
            return;
        }

        const pesanan = result.data;
        idPesananYangDibayar = id;

        qrisNamaBarang.textContent = `${pesanan.nama_barang} x${pesanan.jumlah}`;
        qrisTotal.textContent = formatRupiah(pesanan.total_bayar);

        qriscodeContainer.innerHTML = '';
        new QRCode(qriscodeContainer, {
            text: pesanan.qr_string,
            width: 180,
            height: 180
        });

        qrisModalOverlay.classList.add('active');
    } catch (error) {
        console.error('Gagal membuka pembayaran:', error);
        showToast('Terjadi kesalahan saat memuat data pembayaran.', 'error');
    }
}

qrisCancelBtn.addEventListener('click', () => {
    qrisModalOverlay.classList.remove('active');
    idPesananYangDibayar = null;
});

qrisConfirmBtn.addEventListener('click', async () => {
    if (!idPesananYangDibayar) return;

    try {
        const response = await fetch(`${API_URL}/pesanan/${idPesananYangDibayar}/bayar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metode_pembayaran: 'QRIS' })
        });
        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            loadPesanan();
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Gagal konfirmasi pembayaran:', error);
        showToast('Terjadi kesalahan saat konfirmasi pembayaran.', 'error');
    } finally {
        qrisModalOverlay.classList.remove('active');
        idPesananYangDibayar = null;
    }
});

// ===== Tandai Pesanan Selesai =====
async function selesaikanPesanan(id) {
    try {
        const response = await fetch(`${API_URL}/pesanan/${id}/selesai`, {
            method: 'PUT'
        });
        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            loadPesanan();
            loadBarang();
            loadBarangUntukPesanan();
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Gagal menyelesaikan pesanan:', error);
        showToast('Terjadi kesalahan saat memproses pesanan.', 'error');
    }
}

// ===== Hapus Pesanan =====
async function hapusPesanan(id) {
    const konfirmasi = confirm('Yakin ingin menghapus pesanan ini?');
    if (!konfirmasi) return;

    try {
        const response = await fetch(`${API_URL}/pesanan/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            loadPesanan();
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Gagal menghapus pesanan:', error);
        showToast('Terjadi kesalahan saat menghapus pesanan.', 'error');
    }
}

// ===== Cetak Nota Pembayaran =====
function cetakNota(id) {
    const pesanan = semuaPesanan.find(p => p.id_pesanan === id);
    if (!pesanan) {
        showToast('Data pesanan tidak ditemukan.', 'error');
        return;
    }

    const hargaSatuan = pesanan.jumlah > 0 ? pesanan.total_bayar / pesanan.jumlah : 0;
    const tanggalBayar = pesanan.tanggal_bayar
        ? new Date(pesanan.tanggal_bayar).toLocaleString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        : '-';

    const invoiceArea = document.getElementById('invoiceArea');
    invoiceArea.innerHTML = `
        <div class="invoice-box">
            <h2>📦 Mini Inventory System</h2>
            <p class="invoice-sub">Nota Pembayaran</p>
            <hr>
            <table class="invoice-table">
                <tr><td>No. Pesanan</td><td>#${pesanan.id_pesanan}</td></tr>
                <tr><td>Kode Pembayaran</td><td>${pesanan.kode_pembayaran || '-'}</td></tr>
                <tr><td>Tanggal Bayar</td><td>${tanggalBayar}</td></tr>
                <tr><td>Metode</td><td>${pesanan.metode_pembayaran || '-'}</td></tr>
            </table>
            <hr>
            <table class="invoice-table invoice-items">
                <thead>
                    <tr><th>Barang</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${pesanan.nama_barang || '-'}</td>
                        <td>${pesanan.jumlah}</td>
                        <td>${formatRupiah(hargaSatuan)}</td>
                        <td>${formatRupiah(pesanan.total_bayar)}</td>
                    </tr>
                </tbody>
            </table>
            <hr>
            <p class="invoice-total">Total Bayar: ${formatRupiah(pesanan.total_bayar)}</p>
            <p class="invoice-footer">Terima kasih telah bertransaksi 🙏</p>
        </div>
    `;

    window.print();
}

// ===== Muat Data Saat Halaman Dibuka =====
loadBarangUntukPesanan();
loadPesanan();