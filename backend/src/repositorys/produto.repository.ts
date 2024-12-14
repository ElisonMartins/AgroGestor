import { prisma } from "../services/prisma";
import { Prisma } from "@prisma/client"; // Importa os tipos gerados pelo Prisma

// Função para criar um produto
// Cria um novo produto no banco de dados usando os dados fornecidos. Garante que o preço já está em formato correto.
export const createProduto = async (data: Prisma.ProdutoCreateInput) => {
  console.log("Recebendo dados para criação de produto:", data);

  try {
    const produto = await prisma.produto.create({
      data, // Insere o produto no banco de dados
    });

    console.log("Produto criado com sucesso:", produto);
    return produto; // Retorna o produto criado
  } catch (error) {
    console.error("Erro ao criar o produto:", error);

    throw new Error(
      `Erro ao criar o produto. Detalhes do erro: ${
        error instanceof Error ? error.message : "Erro desconhecido"
      }`
    ); // Lança erro detalhado em caso de falha
  }
};

// Função para buscar todos os produtos
// Retorna todos os produtos cadastrados no banco de dados.
export const getAll = async () => {
  try {
    const produtos = await prisma.produto.findMany(); // Busca todos os produtos
    console.log("Produtos encontrados:", produtos);
    return produtos; // Retorna os produtos encontrados
  } catch (error) {
    console.error("Erro ao buscar todos os produtos:", error);
    throw new Error("Erro ao buscar produtos."); // Lança erro em caso de falha
  }
};

// Função para buscar um produto pelo ID
// Retorna um produto específico com base no ID fornecido.
export const getById = async (id: number) => {
  try {
    const produto = await prisma.produto.findUnique({
      where: {
        id, // Identifica o produto pelo ID
      },
    });

    if (!produto) {
      console.warn(`Produto com ID ${id} não encontrado.`);
      throw new Error(`Produto com ID ${id} não encontrado.`); // Lança erro se o produto não for encontrado
    }

    console.log("Produto encontrado:", produto);
    return produto; // Retorna o produto encontrado
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw new Error(`Erro ao buscar produto com ID ${id}.`); // Lança erro detalhado em caso de falha
  }
};
