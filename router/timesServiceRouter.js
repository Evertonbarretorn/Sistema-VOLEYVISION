const express = require("express");
const { executeQuery } = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Rota /estatisticas chamada");

  const query = `
    SELECT 
      t.id_time, 
      t.nome_time, 
      SUM(CASE WHEN p.id_time_a = t.id_time THEN p.sets_vencidos_a ELSE p.sets_vencidos_b END) AS total_sets,
      SUM(CASE WHEN p.id_time_a = t.id_time THEN p.ponto_saque_a ELSE p.ponto_saque_b END) AS total_ponto_saque,
      SUM(CASE WHEN p.id_time_a = t.id_time THEN p.ponto_ataque_a ELSE p.ponto_ataque_b END) AS total_ponto_ataque,
      SUM(CASE WHEN p.id_time_a = t.id_time THEN p.ponto_bloqueio_a ELSE p.ponto_bloqueio_b END) AS total_ponto_bloqueio,
      SUM(CASE WHEN p.id_time_a = t.id_time THEN p.erro_saque_a ELSE p.erro_saque_b END) AS total_erros_saque,
      SUM(CASE WHEN p.id_time_a = t.id_time THEN p.erro_ataque_a ELSE p.erro_ataque_b END) AS total_erros_ataque,
      COALESCE(
          (SUM(CASE WHEN p.id_time_a = t.id_time THEN p.ponto_saque_a ELSE p.ponto_saque_b END) - 
           SUM(CASE WHEN p.id_time_a = t.id_time THEN p.erro_saque_a ELSE p.erro_saque_b END)) * 100 /
          NULLIF(
              SUM(CASE WHEN p.id_time_a = t.id_time THEN p.ponto_saque_a ELSE p.ponto_saque_b END) + 
              SUM(CASE WHEN p.id_time_a = t.id_time THEN p.erro_saque_a ELSE p.erro_saque_b END), 
              0
          ), 
          0
      ) AS eficiencia_saque,
      COALESCE(
          (SUM(CASE WHEN p.id_time_a = t.id_time THEN p.ponto_ataque_a ELSE p.ponto_ataque_b END) - 
           SUM(CASE WHEN p.id_time_a = t.id_time THEN p.erro_ataque_a ELSE p.erro_ataque_b END)) * 100 /
          NULLIF(
              SUM(CASE WHEN p.id_time_a = t.id_time THEN p.ponto_ataque_a ELSE p.ponto_ataque_b END) + 
              SUM(CASE WHEN p.id_time_a = t.id_time THEN p.erro_ataque_a ELSE p.erro_ataque_b END), 
              0
          ), 
          0
      ) AS eficiencia_ataque
    FROM 
      times t
    LEFT JOIN 
      partidas p ON t.id_time IN (p.id_time_a, p.id_time_b)
    GROUP BY 
      t.id_time, t.nome_time;
  `;

  try {
    const result = await executeQuery(query);
    console.log("Resultado da consulta:", result);
    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

module.exports = router;
