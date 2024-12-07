import { Express } from "express"; // Importa o tipo Express
import { create, get, getId } from "../controllers/produto.controller";

const produtoRoutes = (app: Express): void => {
    app.post("/produto", create);
    app.get("/produto", get);
    app.get("/produto/:id", getId);
};

export default produtoRoutes;

