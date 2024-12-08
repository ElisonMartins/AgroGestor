import { prisma } from "../services/prisma";

export const addCarrinhoItem = async (data: { produtoId: number; quantidade: number }) => {
  const produto = await prisma.produto.findUnique({
    where: { id: data.produtoId },
  });

  if (!produto) {
    throw new Error("Produto não encontrado.");
  }

  const existingItem = await prisma.carrinhoItem.findFirst({
    where: {
      carrinhoId: 1,
      produtoId: data.produtoId,
    },
  });

  const quantidadeAtualCarrinho = existingItem ? existingItem.quantidade : 0;
  const novaQuantidadeTotal = quantidadeAtualCarrinho + data.quantidade;

  // Verificar se a quantidade total no carrinho excede o estoque
  if (novaQuantidadeTotal > produto.quantity) {
    throw new Error(
      `Estoque insuficiente. Você já tem ${quantidadeAtualCarrinho} no carrinho. Estoque disponível: ${produto.quantity}.`
    );
  }

  if (existingItem) {
    // Atualizar a quantidade do item no carrinho
    return prisma.carrinhoItem.update({
      where: { id: existingItem.id },
      data: { quantidade: novaQuantidadeTotal },
      include: { produto: true },
    });
  }

  // Criar um novo item no carrinho
  return prisma.carrinhoItem.create({
    data: {
      quantidade: data.quantidade,
      produto: { connect: { id: data.produtoId } },
      carrinho: { connectOrCreate: { where: { id: 1 }, create: {} } },
    },
    include: { produto: true },
  });
};

export const getCarrinhoItems = async () => {
  const carrinho = await prisma.carrinho.findUnique({
    where: { id: 1 },
    include: {
      items: {
        include: { produto: true },
      },
    },
  });

  if (!carrinho) {
    return [];
  }

  return carrinho.items.map((item) => ({
    id: item.id,
    produtoId: item.produtoId,
    name: item.produto.name,
    price: item.produto.price,
    unitType: item.produto.unitType,
    quantidade: item.quantidade,
    subtotal: item.quantidade * item.produto.price,
  }));
};

export const removeCarrinhoItem = async (id: number) => {
  return prisma.carrinhoItem.delete({ where: { id } });
};

export const checkoutCarrinho = async () => {
  const carrinho = await prisma.carrinho.findUnique({
    where: { id: 1 },
    include: { items: { include: { produto: true } } },
  });

  if (!carrinho || carrinho.items.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  for (const item of carrinho.items) {
    const produto = item.produto;

    if (produto.quantity < item.quantidade) {
      throw new Error(`Estoque insuficiente para o produto ${produto.name}.`);
    }

    const novaQuantidade = produto.quantity - item.quantidade;

    if (novaQuantidade === 0) {
      // Remover o produto quando o estoque chegar a zero
      await prisma.produto.delete({ where: { id: produto.id } });
    } else {
      // Atualizar a quantidade do produto
      await prisma.produto.update({
        where: { id: produto.id },
        data: { quantity: novaQuantidade },
      });
    }
  }

  // Limpar o carrinho após o checkout
  await prisma.carrinhoItem.deleteMany({ where: { carrinhoId: carrinho.id } });

  return { message: "Compra realizada com sucesso!" };
};
