import axios from "axios";
import { API_URL } from "@env";

export type CarrinhoItem = {
  id: number;
  produtoId: number;
  name: string;
  price: number;
  unitType: string;
  quantidade: number;
  subtotal: number;
  imageUrl?: string;
};

export type NominatimResponse = {
  display_name: string;
  lat: string;
  lon: string;
};

// Buscar itens no carrinho
export const fetchCarrinhoApi = async (): Promise<CarrinhoItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/carrinho`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar itens do carrinho:", error);
    throw new Error("Erro ao buscar itens do carrinho.");
  }
};

// Remover item do carrinho
export const removeFromCarrinhoApi = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/carrinho/${id}`);
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    throw new Error("Erro ao remover item do carrinho.");
  }
};

// Finalizar compra
export const finalizarCompraApi = async (location: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/carrinho/checkout`, { location });
  } catch (error) {
    console.error("Erro ao finalizar a compra:", error);
    throw new Error("Erro ao finalizar a compra.");
  }
};

// Buscar localizações pelo Nominatim
export const searchLocationApi = async (
  query: string
): Promise<NominatimResponse[]> => {
  try {
    const response = await axios.get<NominatimResponse[]>(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          limit: 5,
        },
        headers: {
          "User-Agent": "AgroGestorApp/1.0",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar localizações:", error);
    throw new Error("Erro ao buscar localizações.");
  }
};
