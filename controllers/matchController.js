const VerifyToken = require("../validation/verifyToken");
const Match = require("../models/Match");

// creating the controller for all matches
// @route GET api/match
// @desc get all matches
// @access Private
exports.getMatches = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const matches = await Match.find({});
    return res.status(200).json({
      status: true,
      message: "Matches fetched successfully",
      matches: matches,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for get match by id
// @route GET api/match/id
// @desc get match by id
// @access Private
exports.getMatchById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Match not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Match fetched successfully",
      match: match,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for create match
// @route POST api/match
// @desc create match
// @access Private
exports.createMatch = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const match = await Match.create(req.body);
    return res.status(200).json({
      status: true,
      message: "Match created successfully",
      match: match,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// creating the controller for update match
// @route PUT api/match/id
// @desc update match
// @access Private
exports.updateMatch = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Match not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Match updated successfully",
      match: match,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// deleting the controller for delete match
// @route DELETE api/match/id
// @desc delete match
// @access Private
exports.deleteMatch = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Match not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Match deleted successfully",
      match: match,
    });
  }
  catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

