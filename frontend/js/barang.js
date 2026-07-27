const API_URL = 'http://localhost:5000/api';

const barangForm = document.getElementById('barangForm');
const barangTableBody = document.getElementById('barangTableBody');
const kategoriSelect = document.getElementById('kategoriSelect');
const supplierSelect = document.getElementById('supplierSelect');
const formTitle = document.getElementById('formTitle');
const barangIdInput = document.getElementById('barangId');
const namaBarangInput = document.getElementById('namaBarang');
const stokInput = document.getElementById('stok');
const hargaInput = document.getElementById('harga');
const satuanInput = document.getElementById('satuan');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const fotoBarangInput = document.getElementById('fotoBarang');
const previewFoto = document.getElementById('previewFoto');
const previewWrapper = document.getElementById('previewWrapper');
const hapusFotoBtn = document.getElementById('hapusFotoBtn');
const fotoLamaInput = document.getElementById('fotoLama');
let semuaBarang = [];
const searchInput = document.getElementById('searchInput');

const MAX_FOTO_MB = 2;
const FORMAT_DIIZINKAN = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// ===== Tampilkan / sembunyikan preview foto =====
function tampilkanPreview(url) {
    previewFoto.src = url;
    previewWrapper.style.display = 'block';
}

function sembunyikanPreview() {
    previewFoto.src = '';
    previewWrapper.style.display = 'none';
}

// ===== Load Dropdown Kategori =====
async function loadKategori() {
    try {
        const response = await fetch(`${API_URL}/kategori`);
        const result = await response.json();

        if (result.success) {
            kategoriSelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
            result.data.forEach(kategori => {
                const option = document.createElement('option');
                option.value = kategori.id_kategori;
                option.textContent = kategori.nama_kategori;
                kategoriSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Gagal memuat kategori:', error);
        alert('Gagal memuat data kategori. Pastikan server backend sedang berjalan.');
    }
}

// ===== Load Dropdown Supplier =====
async function loadSupplierUntukBarang() {
    try {
        const response = await fetch(`${API_URL}/supplier`);
        const result = await response.json();

        if (result.success) {
            supplierSelect.innerHTML = '<option value="">-- Pilih Supplier --</option>';
            result.data.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id_supplier;
                option.textContent = supplier.nama_supplier;
                supplierSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Gagal memuat supplier:', error);
    }
}

// ===== Load & Render Tabel Barang =====
async function loadBarang() {
    try {
        const response = await fetch(`${API_URL}/barang`);
        const result = await response.json();

        if (result.success) {
            semuaBarang = result.data;
            renderTable(result.data);
            updateStats(result.data);
            checkStokMenipis(result.data);
            renderDonutChart(result.data);
        }
    } catch (error) {
        console.error('Gagal memuat barang:', error);
        barangTableBody.innerHTML = `<tr><td colspan="8">Gagal memuat data. Pastikan server backend berjalan.</td></tr>`;
    }
}

function renderTable(dataBarang) {
    barangTableBody.innerHTML = '';

    if (dataBarang.length === 0) {
        barangTableBody.innerHTML = `<tr><td colspan="8">Belum ada data barang.</td></tr>`;
        return;
    }

    dataBarang.forEach(barang => {
        const row = document.createElement('tr');

        const hargaFormatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(barang.harga);

        const fotoHTML = barang.foto
            ? `<img src="http://localhost:5000/uploads/${barang.foto}" class="foto-thumbnail" alt="${barang.nama_barang}">`
            : `<div class="foto-placeholder">📦</div>`;

        const stokBadge = barang.stok < 10
            ? '<span class="badge badge-low">Menipis</span>'
            : '<span class="badge badge-safe">Aman</span>';

        row.innerHTML = `
            <td>${fotoHTML}</td>
            <td>${barang.nama_barang}</td>
            <td>${barang.nama_kategori || '-'}</td>
            <td>${barang.nama_supplier || '-'}</td>
            <td>${barang.stok} ${stokBadge}</td>
            <td>${hargaFormatted}</td>
            <td>${barang.satuan}</td>
            <td>
                <button class="btn btn-edit" onclick="editBarang(${barang.id_barang})">Edit</button>
                <button class="btn btn-delete" onclick="hapusBarang(${barang.id_barang})">Hapus</button>
                <button class="btn btn-qr" onclick="tampilkanQR(${barang.id_barang}, '${barang.nama_barang}', ${barang.stok}, ${barang.harga})">QR</button>
            </td>
        `;

        barangTableBody.appendChild(row);
    });
}

function animateCounter(elementId, targetValue, isCurrency = false) {
    const element = document.getElementById(elementId);
    const duration = 800;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);

        if (isCurrency) {
            element.textContent = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(currentValue);
        } else {
            element.textContent = currentValue;
        }

        if (progress < 1) requestAnimationFrame(updateCounter);
    }

    requestAnimationFrame(updateCounter);
}

function updateStats(dataBarang) {
    const totalBarang = dataBarang.length;
    const totalStok = dataBarang.reduce((sum, b) => sum + b.stok, 0);
    const totalNilai = dataBarang.reduce((sum, b) => sum + (b.stok * b.harga), 0);

    animateCounter('totalBarang', totalBarang);
    animateCounter('totalStok', totalStok);
    animateCounter('totalNilai', totalNilai, true);
}

function checkStokMenipis(dataBarang) {
    const banner = document.getElementById('stokWarningBanner');
    const bannerText = document.getElementById('stokWarningText');
    const barangMenipis = dataBarang.filter(b => b.stok < 10);

    if (barangMenipis.length > 0) {
        bannerText.textContent = `⚠️ ${barangMenipis.length} barang stoknya menipis, segera lakukan restock!`;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

// ===== VALIDASI FOTO SAAT DIPILIH =====
fotoBarangInput.addEventListener('change', () => {
    const file = fotoBarangInput.files[0];
    if (!file) return;

    console.log('Foto dipilih:', file.name, '| Ukuran:', (file.size / 1024 / 1024).toFixed(2), 'MB', '| Tipe:', file.type);

    if (file.size > MAX_FOTO_MB * 1024 * 1024) {
        alert(`❌ File terlalu besar (${(file.size / 1024 / 1024).toFixed(2)} MB).\nMaksimal ${MAX_FOTO_MB} MB. Silakan kompres atau pilih foto lain.`);
        fotoBarangInput.value = '';
        return;
    }

    if (!FORMAT_DIIZINKAN.includes(file.type)) {
        alert(`❌ Format "${file.type || 'tidak dikenal'}" tidak didukung.\nGunakan JPG, PNG, GIF, atau WEBP.`);
        fotoBarangInput.value = '';
        return;
    }

    // Lolos validasi -> tampilkan preview
    tampilkanPreview(URL.createObjectURL(file));
});

// ===== TOMBOL HAPUS FOTO =====
hapusFotoBtn.addEventListener('click', () => {
    fotoBarangInput.value = '';   // batalkan file baru yang mungkin dipilih
    fotoLamaInput.value = '';     // kosongkan referensi foto lama -> backend akan set NULL
    sembunyikanPreview();
    console.log('Foto ditandai untuk dihapus saat disimpan.');
});

// ===== SUBMIT FORM (TAMBAH / UPDATE BARANG) =====
barangForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = barangIdInput.value;

    const formData = new FormData();
    formData.append('nama_barang', namaBarangInput.value);
    formData.append('id_kategori', kategoriSelect.value);
    formData.append('id_supplier', supplierSelect.value);
    formData.append('stok', stokInput.value);
    formData.append('harga', hargaInput.value);
    formData.append('satuan', satuanInput.value);
    formData.append('fotoLama', fotoLamaInput.value);

    if (fotoBarangInput.files[0]) {
        formData.append('foto', fotoBarangInput.files[0]);
    }

    console.log('Mengirim data barang. ID:', id || '(baru)', '| fotoLama:', fotoLamaInput.value, '| foto baru:', fotoBarangInput.files[0]?.name || '(tidak ada)');

    try {
        const response = id
            ? await fetch(`${API_URL}/barang/${id}`, { method: 'PUT', body: formData })
            : await fetch(`${API_URL}/barang`, { method: 'POST', body: formData });

        const result = await response.json();
        console.log('Response dari server:', result);

        if (result.success) {
            showToast(result.message, 'success');
            resetForm();
            loadBarang();
        } else {
            console.error('GAGAL:', result);
            alert('❌ Gagal menyimpan barang:\n' + result.message + (result.error ? '\n\nDetail teknis: ' + result.error : ''));
        }
    } catch (error) {
        console.error('Terjadi kesalahan koneksi:', error);
        alert('❌ Tidak bisa terhubung ke server. Pastikan backend (npm run dev) sedang berjalan.');
    }
});

// ===== EDIT BARANG =====
async function editBarang(id) {
    try {
        const response = await fetch(`${API_URL}/barang/${id}`);
        const result = await response.json();

        if (result.success) {
            const barang = result.data;
            console.log('Data barang yang diedit:', barang);

            barangIdInput.value = barang.id_barang;
            namaBarangInput.value = barang.nama_barang;
            kategoriSelect.value = barang.id_kategori || '';
            supplierSelect.value = barang.id_supplier || '';
            stokInput.value = barang.stok;
            hargaInput.value = barang.harga;
            satuanInput.value = barang.satuan;
            fotoLamaInput.value = barang.foto || '';
            fotoBarangInput.value = '';

            if (barang.foto) {
                tampilkanPreview(`http://localhost:5000/uploads/${barang.foto}`);
            } else {
                sembunyikanPreview();
            }

            formTitle.textContent = 'Edit Barang';
            submitBtn.textContent = 'Update';
            cancelBtn.style.display = 'inline-block';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Gagal mengambil data barang:', error);
        alert('Gagal memuat data barang untuk diedit.');
    }
}

const modalOverlay = document.getElementById('modalOverlay');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
let idYangAkanDihapus = null;

function hapusBarang(id) {
    idYangAkanDihapus = id;
    modalOverlay.classList.add('active');
}

modalCancelBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    idYangAkanDihapus = null;
});

modalConfirmBtn.addEventListener('click', async () => {
    if (!idYangAkanDihapus) return;

    try {
        const response = await fetch(`${API_URL}/barang/${idYangAkanDihapus}`, { method: 'DELETE' });
        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            loadBarang();
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Gagal menghapus barang:', error);
        showToast('Terjadi kesalahan saat menghapus data.', 'error');
    } finally {
        modalOverlay.classList.remove('active');
        idYangAkanDihapus = null;
    }
});

function resetForm() {
    barangForm.reset();
    barangIdInput.value = '';
    fotoLamaInput.value = '';
    sembunyikanPreview();
    formTitle.textContent = 'Tambah Barang Baru';
    submitBtn.textContent = 'Simpan';
    cancelBtn.style.display = 'none';
}

cancelBtn.addEventListener('click', resetForm);

searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    const hasilFilter = semuaBarang.filter(b => b.nama_barang.toLowerCase().includes(keyword));
    renderTable(hasilFilter);
});

loadKategori();
loadSupplierUntukBarang();
loadBarang();

const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

const qrModalOverlay = document.getElementById('qrModalOverlay');
const qrCloseBtn = document.getElementById('qrCloseBtn');
const qrBarangNama = document.getElementById('qrBarangNama');
const qrcodeContainer = document.getElementById('qrcode');

function tampilkanQR(id, nama, stok, harga) {
    qrcodeContainer.innerHTML = '';
    const dataQR = `Barang: ${nama}\nID: ${id}\nStok: ${stok}\nHarga: Rp${harga}`;
    new QRCode(qrcodeContainer, { text: dataQR, width: 180, height: 180 });
    qrBarangNama.textContent = nama;
    qrModalOverlay.classList.add('active');
}

qrCloseBtn.addEventListener('click', () => {
    qrModalOverlay.classList.remove('active');
});

const WARNA_CHART = ['#4a6fa5', '#f0ad4e', '#2ecc71', '#e74c3c', '#9b59b6', '#1abc9c'];

function renderDonutChart(dataBarang) {
    const donutChart = document.getElementById('donutChart');
    const chartLegend = document.getElementById('chartLegend');

    const stokPerKategori = {};
    dataBarang.forEach(b => {
        const kategori = b.nama_kategori || 'Tanpa Kategori';
        stokPerKategori[kategori] = (stokPerKategori[kategori] || 0) + b.stok;
    });

    const totalStok = Object.values(stokPerKategori).reduce((a, b) => a + b, 0);

    if (totalStok === 0) {
        donutChart.style.background = '#eee';
        chartLegend.innerHTML = '<p>Belum ada data stok.</p>';
        return;
    }

    let currentDegree = 0;
    let gradientParts = [];
    let legendHTML = '';

    Object.entries(stokPerKategori).forEach(([kategori, stok], index) => {
        const persentase = (stok / totalStok) * 100;
        const warna = WARNA_CHART[index % WARNA_CHART.length];
        const startDeg = currentDegree;
        const endDeg = currentDegree + (persentase / 100) * 360;

        gradientParts.push(`${warna} ${startDeg}deg ${endDeg}deg`);
        currentDegree = endDeg;

        legendHTML += `
            <div class="legend-item">
                <span class="legend-color" style="background:${warna}"></span>
                <span>${kategori}: ${stok} unit (${persentase.toFixed(1)}%)</span>
            </div>
        `;
    });

    donutChart.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    donutChart.style.setProperty('--hole', 'radial-gradient(circle, var(--card-bg) 50%, transparent 50%)');
    chartLegend.innerHTML = legendHTML;
}