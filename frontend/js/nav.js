// ===== Navigasi Antar Halaman =====
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetPage = btn.dataset.page;

        // Reset semua tombol & halaman
        navButtons.forEach(b => b.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        // Aktifkan yang dipilih
        btn.classList.add('active');
        document.getElementById(`page-${targetPage}`).classList.add('active');
    });
});