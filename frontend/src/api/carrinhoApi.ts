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

// Função para buscar itens no carrinho
export const fetchCarrinhoApi = async (): Promise<CarrinhoItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/carrinho`); // Requisição GET para buscar os itens do carrinho
    return response.data; // Retorna os dados recebidos
  } catch (error) {
    console.error("Erro ao buscar itens do carrinho:", error);
    throw new Error("Erro ao buscar itens do carrinho."); // Lança um erro caso ocorra
  }
};

// Função para remover um item do carrinho
export const removeFromCarrinhoApi = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/carrinho/${id}`); // Requisição DELETE para remover o item pelo ID
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    throw new Error("Erro ao remover item do carrinho."); // Lança um erro caso ocorra
  }
};

// Função para finalizar a compra
export const finalizarCompraApi = async (location: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/carrinho/checkout`, { location }); // Envia a localização para finalizar a compra
  } catch (error) {
    console.error("Erro ao finalizar a compra:", error);
    throw new Error("Erro ao finalizar a compra."); // Lança um erro caso ocorra
  }
};

// Função para buscar localizações usando a API do Nominatim
export const searchLocationApi = async (
  query: string
): Promise<NominatimResponse[]> => {
  try {
    const response = await axios.get<NominatimResponse[]>(
      "https://nominatim.openstreetmap.org/search", // Endpoint do Nominatim
      {
        params: {
          q: query, // Parâmetro de busca
          format: "json", // Formato dos dados
          limit: 5, // Limita a 5 resultados
        },
        headers: {
          "User-Agent": "AgroGestorApp/1.0", // User-Agent para identificar o aplicativo
        },
      }
    );
    return response.data; // Retorna os dados recebidos
  } catch (error) {
    console.error("Erro ao buscar localizações:", error);
    throw new Error("Erro ao buscar localizações."); // Lança um erro caso ocorra
  }
};
