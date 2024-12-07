import { Request, Response } from "express";
import { produtoValidation } from "../validations/produto.validation";
import { ValidationError } from "yup"; // Importa ValidationError
import { createProduto, getAll, getById } from "../repositorys/produto.repository";

export const create = async (req: Request, res: Response) => {
    try {
        // Validação do corpo da solicitação
        await produtoValidation.validate(req.body, { abortEarly: false });

        // Criação do produto no banco de dados
        const produto = await createProduto(req.body);
        res.status(201).send(produto);
    } catch (e) {
        if (e instanceof ValidationError) {
            // Retorna os erros detalhados de validação
            res.status(400).send({ errors: e.errors });
        } else {
            // Erros genéricos
            console.error(e);
            res.status(500).send({ error: "Erro no servidor ao criar o produto." });
        }
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const produtos = await getAll();
        res.status(200).send(produtos);
    } catch (e) {
        res.status(400).send(e);
    }
};

export const getId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "ID inválido." });
            return;
        }
        const produto = await getById(id);
        if (!produto) {
            res.status(404).json({ error: "Produto não encontrado." });
            return;
        }
        res.status(200).json(produto);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erro no servidor ao buscar o produto." });
    }
};