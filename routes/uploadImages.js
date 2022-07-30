
const router = require("express").Router();
const multer = require("multer");
const { UploadImages } = require("../controllers/uploadImageController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/svg" 
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const  upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
}).single("image");


router.route("/image").post(upload, UploadImages);

module.exports = router;