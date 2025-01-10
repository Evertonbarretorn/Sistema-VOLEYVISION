const db = require("../config/db");
async function getAllJogadores(req, res) {
  try {
    const result = await db.executeQuery("SELECT * FROM jogadores");
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar jogadores" });
  }
}

async function createJogador(req, res) {
  const {
    id_time,
    nome_jogador,
    posicao_jogador,
    altura_jogador,
    idade_jogador,
  } = req.body;

  if (
    !id_time ||
    !nome_jogador ||
    !posicao_jogador ||
    !altura_jogador ||
    !idade_jogador
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  const sql =
    "INSERT INTO jogadores (id_time, nome_jogador, posicao_jogador, altura_jogador, idade_jogador) VALUES ($1, $2, $3, $4, $5) RETURNING *";

  try {
    const result = await db.executeQuery(sql, [
      id_time,
      nome_jogador,
      posicao_jogador,
      altura_jogador,
      idade_jogador,
    ]);
    res.status(201).json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao inserir jogador", error: error.message });
  }
}

async function getJogadorById(req, res) {
  try {
    const result = await db.executeQuery(
      "SELECT * FROM jogadores WHERE id_jogador = $1",
      [req.params.id_jogador]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Jogador não encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar jogador", error: error.message });
  }
}

async function updateJogador(req, res) {
  const {
    id_time,
    nome_jogador,
    posicao_jogador,
    altura_jogador,
    idade_jogador,
  } = req.body;

  if (
    !id_time ||
    !nome_jogador ||
    !posicao_jogador ||
    !altura_jogador ||
    !idade_jogador
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await db.executeQuery(
      "UPDATE jogadores SET id_time = $1, nome_jogador = $2, posicao_jogador = $3, altura_jogador = $4, idade_jogador = $5 WHERE id_jogador = $6 RETURNING *",
      [
        id_time,
        nome_jogador,
        posicao_jogador,
        altura_jogador,
        idade_jogador,
        req.params.id_jogador,
      ]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Jogador não encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar jogador", error: error.message });
  }
}

async function deleteJogador(req, res) {
  try {
    const result = await db.executeQuery(
      "DELETE FROM jogadores WHERE id_jogador = $1 RETURNING *",
      [req.params.id_jogador]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Jogador não encontrado" });
    }
    res.status(200).json({ message: "Jogador excluído com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir jogador", error: error.message });
  }
}

module.exports = {
  getAllJogadores,
  getJogadorById,
  createJogador,
  updateJogador,
  deleteJogador,
};
