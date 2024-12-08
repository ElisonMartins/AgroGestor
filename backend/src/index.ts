import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

// Configura as rotas
routes(app);

app.listen(3001, () => {
  console.log("Servidor rodando!");
});
