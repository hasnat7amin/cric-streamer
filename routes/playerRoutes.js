// create the route for players

const router = require("express").Router();
const {
    getPlayers,
    getPlayerById,
    updatePlayerById,
    deletePlayerById,
    createPlayer
} = require("../controllers/playerController");

router.route("/").get(getPlayers);
router.route("/").post(createPlayer);
router.route("/:id").get(getPlayerById);
router.route("/:id").put(updatePlayerById);
router.route("/:id").delete(deletePlayerById);

module.exports = router;