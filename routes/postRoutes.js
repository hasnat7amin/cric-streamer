// create the route for posts

const router = require("express").Router();
const multer = require("multer");

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
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cd(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
}).single("avatar");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  createLike,
  createComment,
  deleteComment,
  updateLike,
  deleteLike,
  updateComment,
} = require("../controllers/postController");

router.route("/").post(upload, createPost);
router.route("/").get(getPosts);
router.route("/:id").get(getPostById);
router.route("/:id").put(updatePost);
router.route("/:id").delete(deletePost);
router.route("/:id/comments").post(createComment);
router.route("/:id/likes").post(createLike);
router.route("/:id/likes/:likeId").put(updateLike);
router.route("/:id/likes/:likeId").delete(deleteLike);
router.route("/:id/comments/:commentId").put(updateComment);
router.route("/:id/comments/:commentId").delete(deleteComment);

module.exports = router;
