const multer = require('multer');

const storage = multer.memoryStorage(); //keep file in the memory, to access it we use req.file.buffer
const upload = multer({ storage });

module.exports = upload;