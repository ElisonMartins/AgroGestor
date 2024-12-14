import { Request, Response } from "express";
import { createProduto, getAll, getById } from "../repositorys/produto.repository";
import { produtoValidation } from "../validations/produto.validation";
import { ValidationError } from "yup";

// Função para criar um novo produto
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const imageUrl = (req.file as Express.MulterS3.File)?.location || null; // Obtém a URL da imagem (se disponível)

        // Validação dos dados recebidos
        await produtoValidation.validate(req.body, { abortEarly: false });

        // Converte os campos para os tipos apropriados antes de salvar no banco
        const data = {
            ...req.body,
            price: parseFloat(req.body.price.replace(",", ".")), // Substitui vírgula por ponto no preço
            quantity: parseInt(req.body.quantity, 10), // Converte a quantidade para número inteiro
            imageUrl, // Adiciona a URL da imagem ao produto
        };

        const produto = await createProduto(data); // Cria o produto no banco de dados
        res.status(201).send(produto); // Retorna o produto criado
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({ errors: error.errors }); // Retorna erro de validação
        } else {
            console.error("Erro ao criar o produto:", error);
            res.status(500).send({ error: "Erro no servidor ao criar o produto." }); // Retorna erro genérico do servidor
        }
    }
};

// Função para listar todos os produtos
export const get = async (_req: Request, res: Response): Promise<void> => {
    try {
        const produtos = await getAll(); // Busca todos os produtos no banco de dados
        res.status(200).send(produtos); // Retorna a lista de produtos
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        res.status(500).send({ error: "Erro no servidor ao listar produtos." }); // Retorna erro genérico do servidor
    }
};

// Função para buscar um produto pelo ID
export const getId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id); // Obtém o ID da requisição
        if (isNaN(id)) {
            res.status(400).send({ error: "ID inválido." }); // Retorna erro se o ID não for um número
            return;
        }

        const produto = await getById(id); // Busca o produto pelo ID no banco de dados
        if (!produto) {
            res.status(404).send({ error: "Produto não encontrado." }); // Retorna erro se o produto não for encontrado
            return;
        }

        res.status(200).send(produto); // Retorna o produto encontrado
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).send({ error: "Erro no servidor ao buscar produto." }); // Retorna erro genérico do servidor
    }
};
