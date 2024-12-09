import { Express } from "express";
import { create, get, getId } from "../controllers/produto.controller";
import { upload } from "../services/s3Service";

const produtoRoutes = (app: Express): void => {
    console.log("Registrando rotas de produtos...");
    app.post("/produto", upload.single("image"), create);
    app.get("/produto", get);
    app.get("/produto/:id", getId);
};

export default produtoRoutes;
