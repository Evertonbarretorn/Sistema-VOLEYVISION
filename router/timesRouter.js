const express = require("express");
const router = express.Router();
const timesController = require("../controllers/timesController");

router.post("/", timesController.createTeam);

router.get("/", timesController.getAllTeams);

router.get("/:id_time", timesController.getTeamById);

router.put("/:id_time", timesController.updateTeam);

router.delete("/:id_time", timesController.deleteTeam);

module.exports = router;
