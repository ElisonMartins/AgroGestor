import { Express } from "express";
import { add, get, remove, checkout, getAnaliseVendas } from "../controllers/carrinho.controller";

const carrinhoRoutes = (app: Express): void => {
    console.log("Registrando rotas do carrinho...");
    app.post("/carrinho", add); // Adicionar item ao carrinho
    app.get("/carrinho", get); // Listar itens do carrinho
    app.delete("/carrinho/:id", remove); // Remover item do carrinho
    app.post("/carrinho/checkout", checkout); // Finalizar compra
    app.get("/carrinho/analise", getAnaliseVendas); // Análise de vendas
};

export default carrinhoRoutes;
