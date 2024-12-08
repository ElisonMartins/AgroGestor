import { Request, Response } from "express";
import { carrinhoValidation } from "../validations/carrinho.validation";
import { ValidationError } from "yup";
import { addCarrinhoItem, getCarrinhoItems, removeCarrinhoItem, checkoutCarrinho } from "../repositorys/carrinho.repository";

export const add = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validação do corpo da solicitação
        await carrinhoValidation.validate(req.body, { abortEarly: false });

        const carrinhoItem = await addCarrinhoItem(req.body);
        res.status(201).send(carrinhoItem);
    } catch (e) {
        if (e instanceof ValidationError) {
            res.status(400).send({ errors: e.errors });
        } else {
            console.error(e);
            res.status(500).send({ error: "Erro no servidor ao adicionar item ao carrinho." });
        }
    }
};

export const get = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await getCarrinhoItems();
        res.status(200).send(items);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Erro no servidor ao listar itens do carrinho." });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).send({ error: "ID inválido." });
            return;
        }

        await removeCarrinhoItem(id);
        res.status(200).send({ message: "Item removido do carrinho com sucesso." });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Erro no servidor ao remover item do carrinho." });
    }
};

export const checkout = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await checkoutCarrinho();
        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Erro no servidor ao finalizar a compra." });
    }
};
