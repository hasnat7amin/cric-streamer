const router = require("express").Router();
const {
    PostVideo, GetLiveVideo, GetUploadedVideos
} = require("../controllers/YouTubeController");

router.route("/livestreaming").post(PostVideo);
router.route("/currentLive").get(GetLiveVideo);
router.route("/uploadedVideos").get(GetUploadedVideos);


module.exports = router;