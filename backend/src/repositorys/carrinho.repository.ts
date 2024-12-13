import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Adicionar item ao carrinho
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

  if (novaQuantidadeTotal > produto.quantity) {
    throw new Error(
      `Estoque insuficiente. Você já tem ${quantidadeAtualCarrinho} no carrinho. Estoque disponível: ${produto.quantity}.`
    );
  }

  if (existingItem) {
    return prisma.carrinhoItem.update({
      where: { id: existingItem.id },
      data: { quantidade: novaQuantidadeTotal },
      include: { produto: true },
    });
  }

  return prisma.carrinhoItem.create({
    data: {
      quantidade: data.quantidade,
      produto: { connect: { id: data.produtoId } },
      carrinho: { connectOrCreate: { where: { id: 1 }, create: {} } },
    },
    include: { produto: true },
  });
};

// Obter itens do carrinho
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
    imageUrl: item.produto.imageUrl || "https://via.placeholder.com/100",
  }));
};

// Remover item do carrinho
export const removeCarrinhoItem = async (id: number) => {
  return prisma.carrinhoItem.delete({ where: { id } });
};

// Finalizar compra e atualizar estoque
export const checkoutCarrinho = async (): Promise<{ carrinhoId: number; total: number }> => {
  try {
    console.log("Iniciando o checkout do carrinho...");
    const carrinho = await prisma.carrinho.findUnique({
      where: { id: 1 },
      include: { items: { include: { produto: true } } },
    });

    if (!carrinho || carrinho.items.length === 0) {
      console.error("Carrinho vazio ou não encontrado.");
      throw new Error("Carrinho vazio.");
    }

    let total = 0;

    for (const item of carrinho.items) {
      const produto = item.produto;

      if (produto.quantity < item.quantidade) {
        console.error(`Estoque insuficiente para o produto ${produto.name}.`);
        throw new Error(`Estoque insuficiente para o produto ${produto.name}.`);
      }

      const novaQuantidade = produto.quantity - item.quantidade;

      if (novaQuantidade === 0) {
        console.log(`Removendo produto ${produto.name}, estoque zerado.`);
        await prisma.produto.delete({ where: { id: produto.id } });
      } else {
        console.log(`Atualizando estoque do produto ${produto.name}: ${novaQuantidade} restantes.`);
        await prisma.produto.update({
          where: { id: produto.id },
          data: { quantity: novaQuantidade },
        });
      }

      total += item.quantidade * produto.price;
    }

    console.log("Limpando o carrinho...");
    await prisma.carrinhoItem.deleteMany({ where: { carrinhoId: carrinho.id } });

    console.log(`Checkout concluído com sucesso. Total: ${total}`);
    return { carrinhoId: carrinho.id, total };
  } catch (error: any) {
    console.error("Erro no checkoutCarrinho:", error.message);
    throw new Error("Erro ao finalizar o checkout do carrinho.");
  }
};

// Salvar venda associada ao carrinho
export const saveVenda = async (
  carrinhoId: number,
  total: number,
  location: string | null
): Promise<{ id: number; total: number; location: string | null; createdAt: Date }> => {
  try {
    console.log("Salvando venda...", { carrinhoId, total, location });
    const venda = await prisma.venda.create({
      data: {
        total,
        location,
        carrinhoId,
      },
    });
    console.log("Venda salva com sucesso:", venda);
    return venda;
  } catch (error: any) {
    console.error("Erro ao salvar a venda:", error.message);
    throw new Error("Erro ao salvar a venda.");
  }
};

// Buscar análise de vendas agrupadas por local
export const getVendasAgrupadasPorLocal = async (): Promise<
  { location: string | null; _count: { _all: number }; _sum: { total: number | null } }[]
> => {
  console.log("Buscando análise de vendas agrupadas por local...");
  const vendas = await prisma.venda.groupBy({
    by: ["location"],
    _count: { _all: true },
    _sum: { total: true },
  });

  console.log("Análise de vendas retornada:", vendas);
  return vendas;
};
