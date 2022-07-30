const VerifyToken = require("../validation/verifyToken");
const Team = require("../models/Team");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cd(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
});

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
      .populate("image")
      .populate("logo")
      .populate("players");
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
      .populate("image")
      .populate("logo")
      .populate("players");
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
      team: await Team.findById(updatedTeam._id)
        .populate("image")
        .populate("logo")
        .populate("players"),
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
    const validatedUser = await VerifyToken(req, res);
    //console.log("validatedUser",validatedUser);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    if (!req.body.name) {
      // console.log(req.body.name.toString())
      return res.status(400).json({
        status: false,
        message: "Team name is required",
      });
    }
    const isExitsTeam = await Team.findOne({ name: req.body.name });
    if (isExitsTeam) {
      return res.status(400).json({
        status: false,
        message: "Team name already exists",
        team: isExitsTeam,
      });
    }
    if (!req.body.name || !req.body.image) {
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
      team: await Team.findById(team._id) 
        .populate("image")
        .populate("logo")
        .populate("players")
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      data: err,
      message: "got some error",
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

// create a controller for deleteing all the teams
// @route DELETE api/team
// @desc delete all teams
// @access Public
exports.deleteAllTeams = async (req, res) => {
  try {
    await Team.deleteMany({})
      .then(() => {
        return res.status(200).json({
          status: true,
          message: "Players deleted successfully",
        });
      })
      .catch((err) => {
        return res.status(400).json({
          status: false,
          error: err,
          message: "Players not deleted successfully",
        });
      });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};
