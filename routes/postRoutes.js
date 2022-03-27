// create the route for posts

const router = require("express").Router();
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

router.route("/").post(createPost);
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