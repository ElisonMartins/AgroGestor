import { Request, Response } from "express";
import { 
    addCarrinhoItem, 
    getCarrinhoItems, 
    removeCarrinhoItem, 
    checkoutCarrinho, 
    saveVenda, 
    getVendasAgrupadasPorLocal 
} from "../repositorys/carrinho.repository";

export const add = async (req: Request, res: Response): Promise<void> => {
    try {
        const carrinhoItem = await addCarrinhoItem(req.body);
        res.status(201).send(carrinhoItem);
    } catch (e: any) {
        res.status(400).send({ error: e.message });
    }
};

export const get = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await getCarrinhoItems();
        res.status(200).send(items);
    } catch (e: any) {
        res.status(500).send({ error: "Erro ao buscar itens do carrinho." });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        await removeCarrinhoItem(id);
        res.status(200).send({ message: "Item removido do carrinho com sucesso." });
    } catch (e: any) {
        res.status(500).send({ error: "Erro ao remover item do carrinho." });
    }
};

export const checkout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { location } = req.body;
        if (!location) {
            res.status(400).send({ error: "Localização é obrigatória ao finalizar a compra." });
            return;
        }

        const { carrinhoId, total } = await checkoutCarrinho();
        const venda = await saveVenda(carrinhoId, total, location);

        res.status(200).send({ message: "Compra realizada com sucesso!", venda });
    } catch (e: any) {
        res.status(500).send({ error: "Erro ao finalizar a compra." });
    }
};

export const getAnaliseVendas = async (req: Request, res: Response): Promise<void> => {
    try {
        const vendasAgrupadas = await getVendasAgrupadasPorLocal();
        res.status(200).send(vendasAgrupadas);
    } catch (e: any) {
        res.status(500).send({ error: "Erro ao obter análise de vendas." });
    }
};
