const express = require("express");
const { executeQuery } = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Rota /ranking chamada");

  const query = `
    SELECT 
      t.id_time, 
      t.nome_time, 
      SUM(CASE WHEN p.id_time_a = t.id_time THEN p.sets_vencidos_a ELSE 0 END) +
      SUM(CASE WHEN p.id_time_b = t.id_time THEN p.sets_vencidos_b ELSE 0 END) AS total_sets_ganhos
    FROM 
      times t
    LEFT JOIN 
      partidas p ON p.id_time_a = t.id_time OR p.id_time_b = t.id_time
    GROUP BY 
      t.id_time, t.nome_time
    ORDER BY 
      total_sets_ganhos DESC
    LIMIT 3;
  `;

  try {
    const result = await executeQuery(query);
    console.log("Resultado da consulta:", result);

    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ error: "Erro ao buscar ranking de equipes" });
  }
});

module.exports = router;
