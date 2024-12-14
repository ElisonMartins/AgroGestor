import { Request, Response } from "express";
import { 
    addCarrinhoItem, 
    getCarrinhoItems, 
    removeCarrinhoItem, 
    checkoutCarrinho, 
    saveVenda, 
    getVendasAgrupadasPorLocal 
} from "../repositorys/carrinho.repository";

// Função para adicionar um item ao carrinho
export const add = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Recebendo requisição para adicionar item ao carrinho:", req.body);
        const carrinhoItem = await addCarrinhoItem(req.body); // Adiciona o item ao carrinho
        console.log("Item adicionado ao carrinho com sucesso:", carrinhoItem);
        res.status(201).send(carrinhoItem); // Retorna o item adicionado
    } catch (e: any) {
        console.error("Erro ao adicionar item ao carrinho:", e.message);
        res.status(400).send({ error: e.message }); // Retorna erro caso algo dê errado
    }
};

// Função para buscar os itens do carrinho
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
      res.status(500).send({ error: "Erro ao buscar itens do carrinho." }); // Retorna erro caso algo dê errado
    }
};

// Função para remover um item do carrinho
export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id); // Obtém o ID do item a ser removido
        console.log(`Recebendo requisição para remover item do carrinho com ID ${id}`);
        await removeCarrinhoItem(id); // Remove o item do carrinho
        console.log("Item removido do carrinho com sucesso.");
        res.status(200).send({ message: "Item removido do carrinho com sucesso." }); // Retorna mensagem de sucesso
    } catch (e: any) {
        console.error("Erro ao remover item do carrinho:", e.message);
        res.status(500).send({ error: "Erro ao remover item do carrinho." }); // Retorna erro caso algo dê errado
    }
};

// Função para finalizar a compra
export const checkout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { location } = req.body; // Obtém a localização fornecida pelo cliente
        if (!location) {
            console.error("Localização não fornecida.");
            res.status(400).send({ error: "Localização é obrigatória ao finalizar a compra." }); // Retorna erro se localização não for fornecida
            return;
        }

        console.log("Recebendo pedido de checkout...");
        const { carrinhoId, total } = await checkoutCarrinho(); // Finaliza o carrinho
        const venda = await saveVenda(carrinhoId, total, location); // Salva os dados da venda

        console.log("Checkout finalizado com sucesso. Enviando resposta.");
        res.status(200).send({ message: "Compra realizada com sucesso!", venda }); // Retorna mensagem de sucesso e dados da venda
    } catch (error: any) {
        console.error("Erro no checkout:", error.message);
        res.status(500).send({ error: "Erro ao finalizar a compra.", details: error.message }); // Retorna erro caso algo dê errado
    }
};

// Função para obter análise de vendas agrupadas por local
export const getAnaliseVendas = async (_req: Request, res: Response): Promise<void> => {
    try {
        console.log("Recebendo requisição para análise de vendas.");
        const vendasAgrupadas = await getVendasAgrupadasPorLocal(); // Busca dados agrupados por local
        console.log("Análise de vendas encontrada:", vendasAgrupadas);
        res.status(200).send(vendasAgrupadas); // Retorna a análise de vendas
    } catch (e: any) {
        console.error("Erro ao obter análise de vendas:", e.message);
        res.status(500).send({ error: "Erro ao obter análise de vendas." }); // Retorna erro caso algo dê errado
    }
};
