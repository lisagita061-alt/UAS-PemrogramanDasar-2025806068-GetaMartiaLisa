 
const API_URL = 'http://localhost:5000/api';

const barangForm = document.getElementById('barangForm');
const barangTableBody = document.getElementById('barangTableBody');
const kategoriSelect = document.getElementById('kategoriSelect');
const formTitle = document.getElementById('formTitle');
const barangIdInput = document.getElementById('barangId');
const namaBarangInput = document.getElementById('namaBarang');
const stokInput = document.getElementById('stok');
const hargaInput = document.getElementById('harga');
const satuanInput = document.getElementById('satuan');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
let semuaBarang = []; 
const searchInput = document.getElementById('searchInput');

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
        barangTableBody.innerHTML = `<tr><td colspan="6">Gagal memuat data. Pastikan server backend berjalan.</td></tr>`;
    }
}
function renderTable(dataBarang) {
  
    barangTableBody.innerHTML = '';

    if (dataBarang.length === 0) {
        barangTableBody.innerHTML = `<tr><td colspan="6">Belum ada data barang.</td></tr>`;
        return;
    }

    dataBarang.forEach(barang => {
        const row = document.createElement('tr');


        const hargaFormatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(barang.harga);

        row.innerHTML = `
            <td>${barang.nama_barang}</td>
            <td>${barang.nama_kategori || '-'}</td>
            <td>${barang.stok}</td>
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
        const progress = Math.min(elapsed / duration, 1); // 0 sampai 1
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

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

function updateStats(dataBarang) {
    const totalBarang = dataBarang.length;
    const totalStok = dataBarang.reduce((sum, barang) => sum + barang.stok, 0);
    const totalNilai = dataBarang.reduce((sum, barang) => sum + (barang.stok * barang.harga), 0);

    animateCounter('totalBarang', totalBarang);
    animateCounter('totalStok', totalStok);
    animateCounter('totalNilai', totalNilai, true);
}
function checkStokMenipis(dataBarang) {
    const banner = document.getElementById('stokWarningBanner');
    const bannerText = document.getElementById('stokWarningText');

    const barangMenipis = dataBarang.filter(barang => barang.stok < 10);

    if (barangMenipis.length > 0) {
        bannerText.textContent = `⚠️ ${barangMenipis.length} barang stoknya menipis, segera lakukan restock!`;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

barangForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = barangIdInput.value;
    const data = {
        nama_barang: namaBarangInput.value,
        id_kategori: kategoriSelect.value,
        stok: stokInput.value,
        harga: hargaInput.value,
        satuan: satuanInput.value
    };

    try {
        let response;

        if (id) {
            response = await fetch(`${API_URL}/barang/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}/barang`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            resetForm();          
            loadBarang();         
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        showToast('Terjadi kesalahan saat menyimpan data.', 'error');
    }
});

async function editBarang(id) {
    try {
        const response = await fetch(`${API_URL}/barang/${id}`);
        const result = await response.json();

        if (result.success) {
            const barang = result.data;

            barangIdInput.value = barang.id_barang;
            namaBarangInput.value = barang.nama_barang;
            kategoriSelect.value = barang.id_kategori;
            stokInput.value = barang.stok;
            hargaInput.value = barang.harga;
            satuanInput.value = barang.satuan;

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
        const response = await fetch(`${API_URL}/barang/${idYangAkanDihapus}`, {
            method: 'DELETE'
        });
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
    formTitle.textContent = 'Tambah Barang Baru';
    submitBtn.textContent = 'Simpan';
    cancelBtn.style.display = 'none';
}

cancelBtn.addEventListener('click', resetForm);

searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    const hasilFilter = semuaBarang.filter(barang =>
        barang.nama_barang.toLowerCase().includes(keyword)
    );
    renderTable(hasilFilter);
});

loadKategori();
loadBarang();

const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
    } else {
        darkModeToggle.textContent = '🌙';
    }
});

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

const qrModalOverlay = document.getElementById('qrModalOverlay');
const qrCloseBtn = document.getElementById('qrCloseBtn');
const qrBarangNama = document.getElementById('qrBarangNama');
const qrcodeContainer = document.getElementById('qrcode');

function tampilkanQR(id, nama, stok, harga) {
    qrcodeContainer.innerHTML = '';

    const dataQR = `Barang: ${nama}\nID: ${id}\nStok: ${stok}\nHarga: Rp${harga}`;

    new QRCode(qrcodeContainer, {
        text: dataQR,
        width: 180,
        height: 180
    });

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
    dataBarang.forEach(barang => {
        const kategori = barang.nama_kategori || 'Tanpa Kategori';
        stokPerKategori[kategori] = (stokPerKategori[kategori] || 0) + barang.stok;
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
