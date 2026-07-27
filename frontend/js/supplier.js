// ===== Variabel Global Supplier =====
const supplierForm = document.getElementById('supplierForm');
const supplierTableBody = document.getElementById('supplierTableBody');
const supplierFormTitle = document.getElementById('supplierFormTitle');
const supplierIdInput = document.getElementById('supplierId');
const namaSupplierInput = document.getElementById('namaSupplier');
const kontakSupplierInput = document.getElementById('kontakSupplier');
const alamatSupplierInput = document.getElementById('alamatSupplier');
const supplierSubmitBtn = document.getElementById('supplierSubmitBtn');
const supplierCancelBtn = document.getElementById('supplierCancelBtn');

// ===== Tampilkan Data Supplier ke Tabel =====
async function loadSupplierTable() {
    try {
        const response = await fetch(`${API_URL}/supplier`);
        const result = await response.json();

        if (result.success) {
            renderSupplierTable(result.data);
        }
    } catch (error) {
        console.error('Gagal memuat supplier:', error);
        supplierTableBody.innerHTML = `<tr><td colspan="4">Gagal memuat data.</td></tr>`;
    }
}

function renderSupplierTable(dataSupplier) {
    supplierTableBody.innerHTML = '';

    if (dataSupplier.length === 0) {
        supplierTableBody.innerHTML = `<tr><td colspan="4">Belum ada supplier.</td></tr>`;
        return;
    }

    dataSupplier.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.nama_supplier}</td>
            <td>${supplier.kontak || '-'}</td>
            <td>${supplier.alamat || '-'}</td>
            <td>
                <button class="btn btn-edit" onclick="editSupplier(${supplier.id_supplier})">Edit</button>
                <button class="btn btn-delete" onclick="hapusSupplier(${supplier.id_supplier})">Hapus</button>
            </td>
        `;
        supplierTableBody.appendChild(row);
    });
}

// ===== Submit Form (CREATE & UPDATE) =====
supplierForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = supplierIdInput.value;
    const data = {
        nama_supplier: namaSupplierInput.value,
        kontak: kontakSupplierInput.value,
        alamat: alamatSupplierInput.value
    };

    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/supplier/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}/supplier`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            resetSupplierForm();
            loadSupplierTable();
            loadSupplierUntukBarang(); // refresh dropdown supplier di halaman Barang juga
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        showToast('Terjadi kesalahan saat menyimpan supplier.', 'error');
    }
});

// ===== Edit Supplier =====
async function editSupplier(id) {
    try {
        const response = await fetch(`${API_URL}/supplier/${id}`);
        const result = await response.json();

        if (result.success) {
            const supplier = result.data;
            supplierIdInput.value = supplier.id_supplier;
            namaSupplierInput.value = supplier.nama_supplier;
            kontakSupplierInput.value = supplier.kontak || '';
            alamatSupplierInput.value = supplier.alamat || '';

            supplierFormTitle.textContent = 'Edit Supplier';
            supplierSubmitBtn.textContent = 'Update';
            supplierCancelBtn.style.display = 'inline-block';
        }
    } catch (error) {
        console.error('Gagal mengambil data supplier:', error);
        showToast('Gagal memuat data supplier.', 'error');
    }
}

// ===== Hapus Supplier (dengan Modal Konfirmasi) =====
const modalSupplierOverlay = document.getElementById('modalSupplierOverlay');
const modalSupplierCancelBtn = document.getElementById('modalSupplierCancelBtn');
const modalSupplierConfirmBtn = document.getElementById('modalSupplierConfirmBtn');
let idSupplierYangAkanDihapus = null;

function hapusSupplier(id) {
    idSupplierYangAkanDihapus = id;
    modalSupplierOverlay.classList.add('active');
}

modalSupplierCancelBtn.addEventListener('click', () => {
    modalSupplierOverlay.classList.remove('active');
    idSupplierYangAkanDihapus = null;
});

modalSupplierConfirmBtn.addEventListener('click', async () => {
    if (!idSupplierYangAkanDihapus) return;

    try {
        const response = await fetch(`${API_URL}/supplier/${idSupplierYangAkanDihapus}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            loadSupplierTable();
            loadSupplierUntukBarang();
        } else {
            showToast('Gagal: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Gagal menghapus supplier:', error);
        showToast('Terjadi kesalahan saat menghapus supplier.', 'error');
    } finally {
        modalSupplierOverlay.classList.remove('active');
        idSupplierYangAkanDihapus = null;
    }
});

// ===== Reset Form Supplier =====
function resetSupplierForm() {
    supplierForm.reset();
    supplierIdInput.value = '';
    supplierFormTitle.textContent = 'Tambah Supplier Baru';
    supplierSubmitBtn.textContent = 'Simpan';
    supplierCancelBtn.style.display = 'none';
}

supplierCancelBtn.addEventListener('click', resetSupplierForm);

// ===== Muat Tabel Supplier Saat Halaman Dibuka =====
loadSupplierTable();