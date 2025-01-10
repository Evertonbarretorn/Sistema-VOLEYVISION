const express = require("express");
const jogadoresController = require("../controllers/jogadoresController");
const router = express.Router();

router.get("/", jogadoresController.getAllJogadores);

router.post("/", jogadoresController.createJogador);

router.get("/:id_jogador", jogadoresController.getJogadorById);

router.put("/:id_jogador", jogadoresController.updateJogador);

router.delete("/:id_jogador", jogadoresController.deleteJogador);

module.exports = router;
