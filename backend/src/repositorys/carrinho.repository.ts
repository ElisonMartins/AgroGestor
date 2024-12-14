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

  // Buscar ou criar o carrinho mais recente
  const carrinho = await prisma.carrinho.findFirst({
    where: {},
    orderBy: { createdAt: "desc" }, // Pega o carrinho mais recente
  }) ?? await prisma.carrinho.create({ data: {} });

  // Verificar se o item já existe no carrinho
  const existingItem = await prisma.carrinhoItem.findFirst({
    where: {
      carrinhoId: carrinho.id,
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
    // Atualizar quantidade do item existente
    return prisma.carrinhoItem.update({
      where: { id: existingItem.id },
      data: { quantidade: novaQuantidadeTotal },
      include: { produto: true },
    });
  }

  // Adicionar novo item ao carrinho
  return prisma.carrinhoItem.create({
    data: {
      quantidade: data.quantidade,
      produto: { connect: { id: data.produtoId } },
      carrinho: { connect: { id: carrinho.id } },
    },
    include: { produto: true },
  });
};

// Obter itens do carrinho
export const getCarrinhoItems = async () => {
  // Buscar o carrinho mais recente
  const carrinho = await prisma.carrinho.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { produto: true }, // Incluir detalhes do produto
      },
    },
  });

  if (!carrinho || carrinho.items.length === 0) {
    console.warn("Carrinho não encontrado ou sem itens.");
    return [];
  }

  // Mapear os itens do carrinho para o formato esperado
  const itensMapeados = carrinho.items.map((item) => ({
    id: item.id,
    produtoId: item.produtoId,
    name: item.produto.name,
    price: parseFloat(item.produto.price.toFixed(2)), // Garantir 2 casas decimais
    unitType: item.produto.unitType,
    quantidade: item.quantidade,
    subtotal: parseFloat((item.quantidade * item.produto.price).toFixed(2)), // Garantir 2 casas decimais
    imageUrl: item.produto.imageUrl || "https://via.placeholder.com/100",
  }));

  console.log("Itens do carrinho mapeados:", itensMapeados);
  return itensMapeados;
};

// Remover item do carrinho
export const removeCarrinhoItem = async (id: number) => {
  return prisma.carrinhoItem.delete({ where: { id } });
};

// Finalizar compra e atualizar estoque
export const checkoutCarrinho = async (): Promise<{ carrinhoId: number; total: number }> => {
  console.log("Iniciando o checkout do carrinho...");
  const carrinho = await prisma.carrinho.findFirst({
    orderBy: { createdAt: "desc" },
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

    await prisma.produto.update({
      where: { id: produto.id },
      data: { quantity: novaQuantidade },
    });

    total += item.quantidade * produto.price;
  }

  console.log("Limpando o carrinho...");
  await prisma.carrinhoItem.deleteMany({ where: { carrinhoId: carrinho.id } });

  console.log(`Checkout concluído com sucesso. Total: ${total}`);
  return { carrinhoId: carrinho.id, total: parseFloat(total.toFixed(2)) };
};

// Salvar venda associada ao carrinho
export const saveVenda = async (
  carrinhoId: number,
  total: number,
  location: string | null
): Promise<{ id: number; total: number; location: string | null; createdAt: Date }> => {
  const venda = await prisma.venda.create({
    data: {
      total: parseFloat(total.toFixed(2)), // Garantir 2 casas decimais
      location,
      carrinhoId,
    },
  });
  console.log("Venda salva com sucesso:", venda);
  return venda;
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
