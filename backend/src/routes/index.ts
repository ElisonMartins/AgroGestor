import { Express } from "express"; // Importa o tipo Express
import produtoRoutes from "./produto.routes";
import carrinhoRoutes from "./carrinho.routes";

const routes = (app: Express): void => {
    produtoRoutes(app);
    carrinhoRoutes(app);
};

export default routes;
