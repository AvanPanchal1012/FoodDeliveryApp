const path = require("path");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
      cb(
        null,
        "image-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).single("profileImage");

module.exports = upload;
