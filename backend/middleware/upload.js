const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Folder uploads dibuat di:', uploadDir);
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        const namaFileBaru = uniqueSuffix + ext;
        cb(null, namaFileBaru);
    }
});

// Hanya izinkan file gambar
const fileFilter = (req, file, cb) => {
    const allowedExt = /\.(jpe?g|png|gif|webp)$/i;
    const allowedMime = /^image\/(jpeg|jpg|png|gif|webp)$/i;

    const extValid = allowedExt.test(file.originalname);
    const mimeValid = allowedMime.test(file.mimetype);

    if (extValid && mimeValid) {
        cb(null, true);
    } else {
        console.log('Foto ditolak. Nama file:', file.originalname, '| Mimetype:', file.mimetype);
        cb(new Error('Hanya file gambar (jpg, jpeg, png, gif, webp) yang diizinkan'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // maksimal 2MB
});

module.exports = upload;