const multer = require('multer');
const path = require('path');
const uuid4 = require('uuid4');

const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            const randomID = uuid4();
            const ext = path.extname(file.originalname);
            const filename = randomID + ext;
            done(null, filename);
        },
        destination(req, file, done) {
            done(null, path.join(__dirname, "../files"));
        },
    }),
    limits: { fileSize: 1024 * 1024 },
});

exports.uploadMiddleware = upload.single('myFile');