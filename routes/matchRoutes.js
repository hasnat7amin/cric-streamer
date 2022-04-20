// create the route for players

const router = require("express").Router();
const {
    getMatches,
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch
} = require("../controllers/matchController");

router.route("/").get(getMatches);
router.route("/").post(createMatch);
router.route("/:id").get(getMatchById);
router.route("/:id").put(updateMatch);
router.route("/:id").delete(deleteMatch);

module.exports = router;