import { Express } from "express";
import produtoRoutes from "./produto.routes";
import carrinhoRoutes from "./carrinho.routes";
import uploadRoutes from "./upload.routes";

const routes = (app: Express): void => {
    console.log("Inicializando rotas...");
    produtoRoutes(app);
    carrinhoRoutes(app);
    app.use("/upload", uploadRoutes);
};

export default routes;
