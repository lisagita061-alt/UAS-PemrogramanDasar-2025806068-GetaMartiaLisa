// ===== Variabel Global Kategori =====
const kategoriForm = document.getElementById('kategoriForm');
const kategoriTableBody = document.getElementById('kategoriTableBody');
const kategoriFormTitle = document.getElementById('kategoriFormTitle');
const kategoriIdInput = document.getElementById('kategoriId');
const namaKategoriInput = document.getElementById('namaKategori');
const keteranganKategoriInput = document.getElementById('keteranganKategori');
const kategoriSubmitBtn = document.getElementById('kategoriSubmitBtn');
const kategoriCancelBtn = document.getElementById('kategoriCancelBtn');

// ===== Tampilkan Data Kategori ke Tabel =====
async function loadKategoriTable() {
    try {
        const response = await fetch(`${API_URL}/kategori`);
        const result = await response.json();

        if (result.success) {
            renderKategoriTable(result.data);
        }
    } catch (error) {
        console.error('Gagal memuat kategori:', error);
        kategoriTableBody.innerHTML = `<tr><td colspan="3">Gagal memuat data.</td></tr>`;
    }
}

function renderKategoriTable(dataKategori) {
    kategoriTableBody.innerHTML = '';

    if (dataKategori.length === 0) {
        kategoriTableBody.innerHTML = `<tr><td colspan="3">Belum ada kategori.</td></tr>`;
        return;
    }

    dataKategori.forEach(kategori => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${kategori.nama_kategori}</td>
            <td>${kategori.keterangan || '-'}</td>
            <td>
                <button class="btn btn-edit" onclick="editKategori(${kategori.id_kategori})">Edit</button>
                <button class="btn btn-delete" onclick="hapusKategori(${kategori.id_kategori})">Hapus</button>
            </td>
        `;
        kategoriTableBody.appendChild(row);
    });
}

// ===== Submit Form (CREATE & UPDATE) =====
kategoriForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = kategoriIdInput.value;
    const data = {
        nama_kategori: namaKategoriInput.value,
        keterangan: keteranganKategoriInput.value
    };

    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/kategori/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}/kategori`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            resetKategoriForm();
            loadKategoriTable();
            loadKategori(); // refresh dropdown kategori di halaman Barang juga
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        showToast('Terjadi kesalahan saat menyimpan kategori.', 'error');
    }
});

// ===== Edit Kategori =====
async function editKategori(id) {
    try {
        const response = await fetch(`${API_URL}/kategori/${id}`);
        const result = await response.json();

        if (result.success) {
            const kategori = result.data;
            kategoriIdInput.value = kategori.id_kategori;
            namaKategoriInput.value = kategori.nama_kategori;
            keteranganKategoriInput.value = kategori.keterangan || '';

            kategoriFormTitle.textContent = 'Edit Kategori';
            kategoriSubmitBtn.textContent = 'Update';
            kategoriCancelBtn.style.display = 'inline-block';
        }
    } catch (error) {
        console.error('Gagal mengambil data kategori:', error);
        showToast('Gagal memuat data kategori.', 'error');
    }
}

// ===== Hapus Kategori (dengan Modal Konfirmasi) =====
const modalKategoriOverlay = document.getElementById('modalKategoriOverlay');
const modalKategoriCancelBtn = document.getElementById('modalKategoriCancelBtn');
const modalKategoriConfirmBtn = document.getElementById('modalKategoriConfirmBtn');
let idKategoriYangAkanDihapus = null;

function hapusKategori(id) {
    idKategoriYangAkanDihapus = id;
    modalKategoriOverlay.classList.add('active');
}

modalKategoriCancelBtn.addEventListener('click', () => {
    modalKategoriOverlay.classList.remove('active');
    idKategoriYangAkanDihapus = null;
});

modalKategoriConfirmBtn.addEventListener('click', async () => {
    if (!idKategoriYangAkanDihapus) return;

    try {
        const response = await fetch(`${API_URL}/kategori/${idKategoriYangAkanDihapus}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            loadKategoriTable();
            loadKategori();
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Gagal menghapus kategori:', error);
        showToast('Terjadi kesalahan saat menghapus kategori.', 'error');
    } finally {
        modalKategoriOverlay.classList.remove('active');
        idKategoriYangAkanDihapus = null;
    }
});

// ===== Reset Form Kategori =====
function resetKategoriForm() {
    kategoriForm.reset();
    kategoriIdInput.value = '';
    kategoriFormTitle.textContent = 'Tambah Kategori Baru';
    kategoriSubmitBtn.textContent = 'Simpan';
    kategoriCancelBtn.style.display = 'none';
}

kategoriCancelBtn.addEventListener('click', resetKategoriForm);

// ===== Muat Tabel Kategori Saat Halaman Dibuka =====
loadKategoriTable();