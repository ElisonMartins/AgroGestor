import { prisma } from "../services/prisma";
import { Prisma } from "@prisma/client"; // Importa os tipos gerados pelo Prisma

// Função para criar um produto
export const createProduto = async (data: Prisma.ProdutoCreateInput) => {
  console.log("Recebendo dados para criação de produto:", data);

  try {
    // Não converta o preço novamente aqui; ele já vem como Float do frontend
    const produto = await prisma.produto.create({
      data,
    });

    console.log("Produto criado com sucesso:", produto);
    return produto;
  } catch (error) {
    console.error("Erro ao criar o produto:", error);

    throw new Error(
      `Erro ao criar o produto. Detalhes do erro: ${
        error instanceof Error ? error.message : "Erro desconhecido"
      }`
    );
  }
};


// Função para buscar todos os produtos
export const getAll = async () => {
  try {
    const produtos = await prisma.produto.findMany();
    console.log("Produtos encontrados:", produtos);
    return produtos;
  } catch (error) {
    console.error("Erro ao buscar todos os produtos:", error);
    throw new Error("Erro ao buscar produtos.");
  }
};

// Função para buscar um produto pelo ID
export const getById = async (id: number) => {
  try {
    const produto = await prisma.produto.findUnique({
      where: {
        id, // Se 'id' for Int no esquema do Prisma
      },
    });

    if (!produto) {
      console.warn(`Produto com ID ${id} não encontrado.`);
      throw new Error(`Produto com ID ${id} não encontrado.`);
    }

    console.log("Produto encontrado:", produto);
    return produto;
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw new Error(`Erro ao buscar produto com ID ${id}.`);
  }
};
