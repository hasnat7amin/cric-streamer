const router = require("express").Router();

const {
    getTeams,
    getTeamById,
    createTeam,
    updateTeamById,
    deleteTeamById

} = require("../controllers/teamController")

router.route("/").get(getTeams);
router.route("/").post(createTeam);
router.route("/:id").get(getTeamById);
router.route("/:id").put(updateTeamById);
router.route("/:id").delete(deleteTeamById);

module.exports = router;

