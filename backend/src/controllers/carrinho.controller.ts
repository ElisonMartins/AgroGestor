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
        console.error("Localização não fornecida.");
        res.status(400).send({ error: "Localização é obrigatória ao finalizar a compra." });
        return;
      }
  
      console.log("Recebendo pedido de checkout...");
      const { carrinhoId, total } = await checkoutCarrinho();
      const venda = await saveVenda(carrinhoId, total, location);
  
      console.log("Checkout finalizado com sucesso. Enviando resposta.");
      res.status(200).send({ message: "Compra realizada com sucesso!", venda });
    } catch (error: any) {
      console.error("Erro no checkout:", error.message);
      res.status(500).send({ error: "Erro ao finalizar a compra.", details: error.message });
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
