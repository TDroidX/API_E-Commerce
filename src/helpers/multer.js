const multer = require('multer');
const fs = require('node:fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/img'); // Directorio donde se almacenan las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };
