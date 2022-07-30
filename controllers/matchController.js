const VerifyToken = require("../validation/verifyToken");
const Match = require("../models/Match");
const Team = require("../models/Team");
const Player = require("../models/Player");

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
    if (!req.body.team1 || !req.body.team2 || !req.body.location) {
      return res.status(400).json({
        status: false,
        message:
          "Match team1, team2, location, scoreCard and userId are required",
      });
    }
    const validatedUser = await VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const match = await Match.create({
      team1: req.body.team1,
      team2: req.body.team2,
      location: req.body.location,
      userId: validatedUser._id,
      winner: req.body.winner,
    });
    const team1ToUpdate = await Team.findById(match.team1).populate({
      path: "players",
    });
    const team2ToUpdate = await Team.findById(match.team2).populate({
      path: "players",
    });

    await Team.findByIdAndUpdate(
      match.team1,
      {
        teamScoreList: [
          ...team1ToUpdate.teamScoreList,
          { matchId: match._id, totalScore: 0, overs: 0, wickets: 0 },
        ],
      },
      {
        new: true,
      }
    );

    await Team.findByIdAndUpdate(
      match.team2,
      {
        teamScoreList: [
          ...team2ToUpdate.teamScoreList,
          { matchId: match._id, totalScore: 0, overs: 0, wickets: 0 },
        ],
      },
      {
        new: true,
      }
    );
    for (let i = 0; i < team1ToUpdate.players.length; i++) {
      await Player.findByIdAndUpdate(team1ToUpdate.players[i]._id, {
        playerScoreList: [
          ...team1ToUpdate.players[i].playerScoreList,
          {
            matchId: match._id,
            teamId: team1ToUpdate._id,
            playedTotalScore: 0,
            bolledTotalScore: 0,
            overs: 0,
            wickets: 0,
          },
        ],
      });
    }
    for (let i = 0; i < team2ToUpdate.players.length; i++) {
      await Player.findByIdAndUpdate(team2ToUpdate.players[i]._id, {
        playerScoreList: [
          ...team2ToUpdate.players[i].playerScoreList,
          {
            matchId: match._id,
            teamId: team2ToUpdate._id,
            playedTotalScore: 0,
            bolledTotalScore: 0,
            overs: 0,
            wickets: 0,
          },
        ],
      });
    }
    return res.status(200).json({
      status: true,
      message: "Match created successfully",
      match: await Match.findById(match._id)
        .populate({
          path: "team1",
          populate: { path: "image" },
        })
        .populate({
          path: "team1",
          populate: { path: "logo" },
        })
        .populate({
          path: "team1",
          populate: { path: "players" },
        })
        .populate({
          path: "team2",
          populate: { path: "image" },
        })
        .populate({
          path: "team2",
          populate: { path: "logo" },
        })
        .populate({
          path: "team2",
          populate: { path: "players" },
        })
        .populate({
          path: "winner",
          populate: { path: "image" },
        })
        .populate({
          path: "winner",
          populate: { path: "logo" },
        })
        .populate({
          path: "winner",
          populate: { path: "players" },
        })
        .populate("userId")
        .populate("winner"),
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
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
