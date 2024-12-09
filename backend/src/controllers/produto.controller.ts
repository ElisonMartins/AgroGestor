import { Request, Response } from "express";
import { createProduto, getAll, getById } from "../repositorys/produto.repository";
import { produtoValidation } from "../validations/produto.validation";
import { ValidationError } from "yup";

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const imageUrl = (req.file as Express.MulterS3.File)?.location || null;

        await produtoValidation.validate(req.body, { abortEarly: false });

        const produto = await createProduto({ ...req.body, imageUrl });
        res.status(201).send(produto);
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({ errors: error.errors });
        } else {
            console.error("Erro ao criar o produto:", error);
            res.status(500).send({ error: "Erro no servidor ao criar o produto." });
        }
    }
};

export const get = async (_req: Request, res: Response): Promise<void> => {
    try {
        const produtos = await getAll();
        res.status(200).send(produtos);
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        res.status(500).send({ error: "Erro no servidor ao listar produtos." });
    }
};

export const getId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).send({ error: "ID inválido." });
            return;
        }

        const produto = await getById(id);
        if (!produto) {
            res.status(404).send({ error: "Produto não encontrado." });
            return;
        }

        res.status(200).send(produto);
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).send({ error: "Erro no servidor ao buscar produto." });
    }
};
