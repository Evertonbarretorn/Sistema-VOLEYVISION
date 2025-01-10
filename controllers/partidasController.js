const db = require("../config/db");

async function getAllPartidas(req, res) {
  try {
    const result = await db.executeQuery("SELECT * FROM partidas");
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar partidas", error: error.message });
  }
}

async function createPartida(req, res) {
  const {
    local_partida,
    data_partida,
    hora_partida,
    id_time_a,
    id_time_b,
    id_vencedor,
    sets_vencidos_a,
    sets_vencidos_b,
    status_partida,
    ponto_saque_a,
    ponto_saque_b,
    ponto_ataque_a,
    ponto_ataque_b,
    ponto_bloqueio_a,
    ponto_bloqueio_b,
    erro_saque_a,
    erro_saque_b,
    erro_ataque_a,
    erro_ataque_b,
  } = req.body;

  if (
    !local_partida ||
    !data_partida ||
    !hora_partida ||
    !id_time_a ||
    !id_time_b ||
    !status_partida
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos obrigatórios devem ser preenchidos!" });
  }

  const sql = `
    INSERT INTO partidas (
      local_partida, data_partida, hora_partida, id_time_a, id_time_b, id_vencedor,
      sets_vencidos_a, sets_vencidos_b, status_partida, 
      ponto_saque_a, ponto_saque_b, ponto_ataque_a, ponto_ataque_b, 
      ponto_bloqueio_a, ponto_bloqueio_b, erro_saque_a, erro_saque_b, 
      erro_ataque_a, erro_ataque_b
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
  `;

  try {
    await db.executeQuery(sql, [
      local_partida,
      data_partida,
      hora_partida,
      id_time_a,
      id_time_b,
      id_vencedor,
      sets_vencidos_a,
      sets_vencidos_b,
      status_partida,
      ponto_saque_a,
      ponto_saque_b,
      ponto_ataque_a,
      ponto_ataque_b,
      ponto_bloqueio_a,
      ponto_bloqueio_b,
      erro_saque_a,
      erro_saque_b,
      erro_ataque_a,
      erro_ataque_b,
    ]);
    res.status(201).json({ message: "Partida criada com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar partida", error: error.message });
  }
}

async function getPartidaById(req, res) {
  try {
    const result = await db.executeQuery(
      "SELECT * FROM partidas WHERE id_partida = $1",
      [req.params.id_partida]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Partida não encontrada" });
    }
    res.json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar partida", error: error.message });
  }
}

async function updatePartida(req, res) {
  const {
    local_partida,
    data_partida,
    hora_partida,
    id_time_a,
    id_time_b,
    id_vencedor,
    sets_vencidos_a,
    sets_vencidos_b,
    status_partida,
    ponto_saque_a,
    ponto_saque_b,
    ponto_ataque_a,
    ponto_ataque_b,
    ponto_bloqueio_a,
    ponto_bloqueio_b,
    erro_saque_a,
    erro_saque_b,
    erro_ataque_a,
    erro_ataque_b,
  } = req.body;

  if (
    !local_partida ||
    !data_partida ||
    !hora_partida ||
    !id_time_a ||
    !id_time_b ||
    !status_partida
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos obrigatórios devem ser preenchidos!" });
  }

  const sql = `
    UPDATE partidas SET 
      local_partida = $1, data_partida = $2, hora_partida = $3, id_time_a = $4, id_time_b = $5, 
      id_vencedor = $6, sets_vencidos_a = $7, sets_vencidos_b = $8, status_partida = $9,
      ponto_saque_a = $10, ponto_saque_b = $11, ponto_ataque_a = $12, ponto_ataque_b = $13,
      ponto_bloqueio_a = $14, ponto_bloqueio_b = $15, erro_saque_a = $16, erro_saque_b = $17, 
      erro_ataque_a = $18, erro_ataque_b = $19
    WHERE id_partida = $20 
    RETURNING *`;

  try {
    const result = await db.executeQuery(sql, [
      local_partida,
      data_partida,
      hora_partida,
      id_time_a,
      id_time_b,
      id_vencedor,
      sets_vencidos_a,
      sets_vencidos_b,
      status_partida,
      ponto_saque_a,
      ponto_saque_b,
      ponto_ataque_a,
      ponto_ataque_b,
      ponto_bloqueio_a,
      ponto_bloqueio_b,
      erro_saque_a,
      erro_saque_b,
      erro_ataque_a,
      erro_ataque_b,
      req.params.id_partida,
    ]);
    if (!result.length) {
      return res.status(404).json({ message: "Partida não encontrada" });
    }
    res.json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar partida", error: error.message });
  }
}

async function deletePartida(req, res) {
  try {
    const result = await db.executeQuery(
      "DELETE FROM partidas WHERE id_partida = $1 RETURNING *",
      [req.params.id_partida]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Partida não encontrada" });
    }
    res.status(200).json({ message: "Partida excluída com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir partida", error: error.message });
  }
}

module.exports = {
  getAllPartidas,
  getPartidaById,
  createPartida,
  updatePartida,
  deletePartida,
};
