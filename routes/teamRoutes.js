const router = require("express").Router();
const util = require("util");
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
    cb(null, file);
  } else {
    cd(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 9,
  },
}).single("image")
var uploadFilesMiddleware = util.promisify(upload);
const {
    getTeams,
    getTeamById,
    createTeam,
    updateTeamById,
    deleteTeamById,
    deleteAllTeams,
    changeCaptain

} = require("../controllers/teamController")

router.route("/").get(getTeams);
router.route("/").post(createTeam);
router.route("/:id").get(getTeamById);
router.route("/:id").put(updateTeamById);
router.route("/:id").delete(deleteTeamById);
router.route("/").delete(deleteAllTeams);
router.route("/:teamId/changeCaptain").put(changeCaptain)


module.exports = router;

