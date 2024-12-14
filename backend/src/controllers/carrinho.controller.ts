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
        console.log("Recebendo requisição para adicionar item ao carrinho:", req.body);
        const carrinhoItem = await addCarrinhoItem(req.body);
        console.log("Item adicionado ao carrinho com sucesso:", carrinhoItem);
        res.status(201).send(carrinhoItem);
    } catch (e: any) {
        console.error("Erro ao adicionar item ao carrinho:", e.message);
        res.status(400).send({ error: e.message });
    }
};

export const get = async (_req: Request, res: Response): Promise<void> => {
    try {
      console.log("Buscando o carrinho mais recente...");
      const items = await getCarrinhoItems(); // Buscar os itens do carrinho
  
      if (items.length === 0) {
        console.warn("Carrinho está vazio ou não encontrado.");
        res.status(200).send([]); // Retornar uma lista vazia se não houver itens
      } else {
        console.log(`Itens encontrados no carrinho: ${items.length}`);
        console.log("Detalhes dos itens do carrinho:", items);
        res.status(200).send(items); // Enviar os itens encontrados
      }
    } catch (e: any) {
      console.error("Erro ao buscar itens do carrinho:", e.message);
      res.status(500).send({ error: "Erro ao buscar itens do carrinho." });
    }
  };
  

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        console.log(`Recebendo requisição para remover item do carrinho com ID ${id}`);
        await removeCarrinhoItem(id);
        console.log("Item removido do carrinho com sucesso.");
        res.status(200).send({ message: "Item removido do carrinho com sucesso." });
    } catch (e: any) {
        console.error("Erro ao remover item do carrinho:", e.message);
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

export const getAnaliseVendas = async (_req: Request, res: Response): Promise<void> => {
    try {
        console.log("Recebendo requisição para análise de vendas.");
        const vendasAgrupadas = await getVendasAgrupadasPorLocal();
        console.log("Análise de vendas encontrada:", vendasAgrupadas);
        res.status(200).send(vendasAgrupadas);
    } catch (e: any) {
        console.error("Erro ao obter análise de vendas:", e.message);
        res.status(500).send({ error: "Erro ao obter análise de vendas." });
    }
};
