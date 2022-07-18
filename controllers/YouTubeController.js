const YouTubeStreaming = require("../models/YouTubeModel");

// @route   POST api/youtube/LiveStreaming
// @desc    Create a post
// @access  Public
module.exports.PostVideo = async (req, res) => {
  try {
    if(!req.body.videoID) {
      return res.status(400).json({
        status: false,
        message: "Video ID is required"
      });
    }
    const videoID = req.body.videoID;
    const youtubeStreaming = new YouTubeStreaming({ videoID: videoID });
    await youtubeStreaming
      .save()
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: result,
          message: "Video uploaded successfully",
        });
      })
      .catch((e) => {
        res.status(400).json({
          status: false,
          message: e,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};
