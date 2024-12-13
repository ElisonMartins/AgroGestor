import axios from "axios";
import { API_URL } from "@env";

export type Venda = {
  location: string | null;
  _count: { _all: number };
  _sum: { total: number | null };
};

// Buscar análise de vendas
export const fetchVendasApi = async (): Promise<Venda[]> => {
  const response = await axios.get(`${API_URL}/carrinho/analise`);
  return response.data;
};