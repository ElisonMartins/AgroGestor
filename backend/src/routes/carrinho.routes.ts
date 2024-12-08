import { Express } from "express";
import { add, get, remove, checkout } from "../controllers/carrinho.controller";

const carrinhoRoutes = (app: Express): void => {
    app.post("/carrinho", add); // Adicionar item ao carrinho
    app.get("/carrinho", get); // Listar itens do carrinho
    app.delete("/carrinho/:id", remove); // Remover item do carrinho
    app.post("/carrinho/checkout", checkout); // Finalizar compra
};

export default carrinhoRoutes;
