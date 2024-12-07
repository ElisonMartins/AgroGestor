import { Express } from "express"; // Importa o tipo Express
import produtoRoutes from "./produto.routes";

const routes = (app: Express): void => {
    produtoRoutes(app);
};

export default routes;
