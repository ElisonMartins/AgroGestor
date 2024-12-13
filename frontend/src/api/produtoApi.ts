import axios from "axios";
import { API_URL } from "@env";

export type Produto = {
  id: number;
  name: string;
  price: number;
  unitType: "Unidade" | "Quilo";
  quantity: number;
  imageUrl?: string;
};

// Função genérica para tratar erros de requisições
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status || "Desconhecido";
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.details ||
      "Erro desconhecido no servidor.";
    console.error(`Erro (${statusCode}):`, errorMessage);
    throw new Error(errorMessage);
  } else {
    console.error("Erro inesperado:", error);
    throw new Error("Erro inesperado. Por favor, tente novamente.");
  }
};

// Buscar todos os produtos
export const fetchProdutosApi = async (): Promise<Produto[]> => {
  try {
    const response = await axios.get(`${API_URL}/produto`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Adicionar produto ao carrinho
export const addToCarrinhoApi = async (
  produtoId: number,
  quantidade: number
): Promise<void> => {
  try {
    if (quantidade <= 0) {
      throw new Error("A quantidade deve ser maior que zero.");
    }
    await axios.post(`${API_URL}/carrinho`, {
      produtoId,
      quantidade,
    });
  } catch (error) {
    handleApiError(error);
  }
};

// Adicionar novo produto
export const addProdutoApi = async (formData: FormData): Promise<void> => {
  try {
    await axios.post(`${API_URL}/produto`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};
