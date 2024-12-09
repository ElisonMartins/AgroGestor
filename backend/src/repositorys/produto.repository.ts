import { prisma } from "../services/prisma";
import { Prisma } from "@prisma/client"; // Importa os tipos gerados pelo Prisma

// Função para criar um produto
export const createProduto = async (data: Prisma.ProdutoCreateInput) => {
  const produto = await prisma.produto.create({
    data: {
      ...data,
      price: parseFloat(data.price as unknown as string), // Converte o preço para Float
      quantity: parseInt(data.quantity as unknown as string, 10), // Converte a quantidade para Int
    },
  });
  return produto;
};

// Função para buscar todos os produtos
export const getAll = async () => {
  const produtos = await prisma.produto.findMany();
  return produtos;
};

// Função para buscar um produto pelo ID
export const getById = async (id: number) => {
  const produto = await prisma.produto.findUnique({
    where: {
      id, // Se 'id' for Int no esquema do Prisma
    },
  });
  return produto;
};
