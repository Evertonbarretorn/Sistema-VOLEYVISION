const express = require("express");
const router = express.Router();
const partidasController = require("../controllers/partidasController");

router.get("/", partidasController.getAllPartidas);

router.post("/", partidasController.createPartida);

router.get("/:id_partida", partidasController.getPartidaById);

router.put("/:id_partida", partidasController.updatePartida);

router.delete("/:id_partida", partidasController.deletePartida);

module.exports = router;
