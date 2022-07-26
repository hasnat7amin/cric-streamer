const router = require("express").Router();
const {
    PostVideo, GetLiveVideo, GetUploadedVideos, UpdateStreaming, DeleteStreaming
} = require("../controllers/YouTubeController");

router.route("/livestreaming").post(PostVideo);
router.route("/currentLive").get(GetLiveVideo);
router.route("/uploadedVideos").get(GetUploadedVideos);
router.route("/updateStreaming").put(UpdateStreaming);
router.route("/deleteStreaming").delete(DeleteStreaming);


module.exports = router;