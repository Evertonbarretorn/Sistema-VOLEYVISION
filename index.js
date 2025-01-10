require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db.js");
const timesRouter = require("./router/timesRouter");
const jogadoresRouter = require("./router/jogadoresRouter");
const partidasRouter = require("./router/partidasRouter");
const timesServiceRouter = require("./router/timesServiceRouter");
const rankingRouter = require("./router/rankingRouter");

process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Rejeição não tratada em:", promise, "Motivo:", reason);
});

const testDbConnection = async () => {
  try {
    const result = await db.executeQuery("SELECT NOW()");
    console.log("Conexão com o banco de dados estabelecida!", result);
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err.stack);
    process.exit(1);
  }
};

testDbConnection();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

app.use("/times", timesRouter);
app.use("/jogadores", jogadoresRouter);
app.use("/partidas", partidasRouter);
app.use("/estatisticas", timesServiceRouter);
app.use("/ranking", rankingRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
