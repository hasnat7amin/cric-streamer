const VerifyToken = require("../validation/verifyToken");
const Player = require("../models/Player");

// create a get controller for all players
// @route GET api/player
// @desc get all players
// @access Private
exports.getPlayers = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const players = await Player.find({});
    return res.status(200).json({
      status: true,
      message: "Players fetched successfully",
      players: players,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err);
  }
};

// create a controller for create player
// @route POST api/player
// @desc create player
// @access Private
exports.createPlayer = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const isExist = await Player.findOne({ cnic: req.body.cnic });
    if (isExist) {
      return  res.status(200).json({
        status: true,
        message: "Player already created successfully",
        player: player,
      });
    }
    const player = await Player.create(req.body);
    return res.status(200).json({
      status: true,
      message: "Player created successfully",
      player: player,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err);
  }
};

// create a controller for get player by id
// @route GET api/player/id
// @desc get player by id
// @access Private
exports.getPlayerById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(400).json({
        status: false,
        message: "Player not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Player fetched successfully",
      player: player,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// update player by id
// @route PUT api/player/id
// @desc update player by id
// @access Private
exports.updatePlayerById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(400).json({
        status: false,
        message: "Player not found",
      });
    }
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      status: true,
      message: "Player updated successfully",
      player: updatedPlayer,
    });

  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// create a controller for delete player by id
// @route DELETE api/player/id
// @desc delete player by id
// @access Private
exports.deletePlayerById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(400).json({
        status: false,
        message: "Player not found",
      });
    }
    await Player.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Player deleted successfully",
    });
  }
  catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};


