const router = require("express").Router();
const {
    PostVideo
} = require("../controllers/YouTubeController");

router.route("/livestreaming").post(PostVideo);

module.exports = router;