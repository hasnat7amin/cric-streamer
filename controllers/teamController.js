const VerifyToken = require("../validation/verifyToken");
const Team = require("../models/Team");

// create the controller for all teams
// @route GET api/team
// @desc get all teams
// @access Private
exports.getTeams = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const teams = await Team.find({})
      .populate("players")
      .populate("teamOwner")
      .populate("teamCaptain");
    return res.status(200).json({
      status: true,
      message: "Teams fetched successfully",
      teams: teams,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err);
  }
};

// create the controller for get team by id
// @route GET api/team/id
// @desc get team by id
// @access Private
exports.getTeamById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const team = await Team.findById(req.params.id)
      .populate("players")
      .populate("teamOwner")
      .populate("teamCaptain");
    if (!team) {
      return res.status(400).json({
        status: false,
        message: "Team not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Team fetched successfully",
      team: team,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// create the controller for update team by id
// @route PUT api/team/id
// @desc update team by id
// @access Private
exports.updateTeamById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(400).json({
        status: false,
        message: "Team not found",
      });
    }
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: true,
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// create the controller for create team
// @route POST api/team
// @desc create team
// @access Private
exports.createTeam = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    if(!req.body.name){
      return res.status(400).json({
        status: false,
        message: "Team name is required",
      });
    }
    const isExitsTeam = await Team.findOne({name: req.body.name});
    if(isExitsTeam){
      return res.status(400).json({
        status: false,
        message: "Team name already exists",
        team: isExitsTeam
      });
    }
    if(!req.body.name || !req.body.image){
      return res.status(400).json({
        status: false,
        message: "Team name and image is required",
      });
    }
    const newTeam = new Team(req.body);
    const team = await newTeam.save();
    return res.status(200).json({
      status: true,
      message: "Team created successfully",
      team: team,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

// create the controller for delete team by id
// @route DELETE api/team/id
// @desc delete team by id
// @access Private
exports.deleteTeamById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(400).json({
        status: false,
        message: "Team not found",
      });
    }
    await Team.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Team deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};
