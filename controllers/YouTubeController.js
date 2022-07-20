const YouTubeStreaming = require("../models/YouTubeModel");

// @route   POST api/youtube/LiveStreaming
// @desc    Create a post
// @access  Public
module.exports.PostVideo = async (req, res) => {
  try {
    if (!req.body.videoID) {
      return res.status(400).json({
        status: false,
        message: "Video ID and isStreaming is required",
      });
    }
    await YouTubeStreaming.findOne({videoID:req.body.videoID}).then(async (data) => {
      if (data)
        return res.status(400).json({
          status: false,
          data:data,
          message: "Video ID already exists",
        });
      })
    const videoID = req.body.videoID;
    const youtubeStreaming = new YouTubeStreaming(req.body);
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

// creating the controller for get youtubeStreaming
// @route   GET api/youtube/LiveStreaming
// @desc   get all post
// @access Public
module.exports.GetLiveVideo = async (req, res) => {
  try {
    await YouTubeStreaming.find({ isStreaming: true })
      .populate("scoreCard")
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: result,
          message: "get successfully",
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

// creating the controller for getting the uploaded videos
// @route   GET api/youtube/uploadedVideos
// @desc   get all post
// @access Public
module.exports.GetUploadedVideos = async (req, res) => {
  try {
    await YouTubeStreaming.find({ isStreaming: false })
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: result,
          message: "get successfully",
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
