const db = require("../config/db");

async function getAllTeams(req, res) {
  try {
    const result = await db.executeQuery("SELECT * FROM times");
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar times" });
  }
}

async function createTeam(req, res) {
  const { nome_time, cidade_time, estado_time, treinador_time } = req.body;

  if (!nome_time || !cidade_time || !estado_time || !treinador_time) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  const sql =
    "INSERT INTO times (nome_time, cidade_time, estado_time, treinador_time) VALUES ($1, $2, $3, $4) RETURNING *";

  try {
    const result = await db.executeQuery(sql, [
      nome_time,
      cidade_time,
      estado_time,
      treinador_time,
    ]);
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao inserir time" });
  }
}

async function getTeamById(req, res) {
  try {
    const result = await db.executeQuery(
      "SELECT * FROM times WHERE id_time = $1",
      [req.params.id_time]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Time não encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar time" });
  }
}

async function updateTeam(req, res) {
  const { nome_time, cidade_time, estado_time, treinador_time } = req.body;

  if (!nome_time || !cidade_time || !estado_time || !treinador_time) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await db.executeQuery(
      "UPDATE times SET nome_time = $1, cidade_time = $2, estado_time = $3, treinador_time = $4 WHERE id_time = $5 RETURNING *",
      [nome_time, cidade_time, estado_time, treinador_time, req.params.id_time]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Time não encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar time" });
  }
}

async function deleteTeam(req, res) {
  try {
    const result = await db.executeQuery(
      "DELETE FROM times WHERE id_time = $1 RETURNING *",
      [req.params.id_time]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Time não encontrado" });
    }
    res.status(200).json({ message: "Time excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir time" });
  }
}

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};
