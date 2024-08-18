import express from "express";
import router from "./routes/router.js";
import { configDotenv } from "dotenv";

// Config ----------------------------------------------------------------------------

const app = express();

const port = 3000;

app.use(express.json());

configDotenv();

// Rotas -----------------------------------------------------------------------------

app.use("/", router);

//Confirmação ------------------------------------------------------------------------

app.listen(port, () => {
  console.log(
    `Sevidor ativo na porta ${port}, acesso: http://localhost:${port}`
  );
});

export default app;
