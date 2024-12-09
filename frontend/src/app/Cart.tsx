import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

type CarrinhoItem = {
  id: number;
  produtoId: number;
  name: string;
  price: number;
  unitType: string;
  quantidade: number;
  subtotal: number;
  imageUrl?: string; // Altere para usar imageUrl
};

export default function Cart() {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);

  // Função para buscar itens do carrinho
  const fetchCarrinho = async () => {
    try {
      const response = await axios.get(`${API_URL}/carrinho`);
      setItens(response.data);
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error);
      Alert.alert("Erro", "Não foi possível carregar o carrinho.");
    }
  };

  // Função para remover item do carrinho
  const removeFromCarrinho = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/carrinho/${id}`);
      Alert.alert("Sucesso", "Item removido do carrinho!");
      fetchCarrinho(); // Atualiza o carrinho automaticamente
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  };

  // Função para finalizar a compra
  const finalizarCompra = async () => {
    try {
      await axios.post(`${API_URL}/carrinho/checkout`);
      Alert.alert("Sucesso", "Compra finalizada com sucesso!");
      fetchCarrinho(); // Atualiza o carrinho para limpar os itens
    } catch (error) {
      console.error("Erro ao finalizar a compra:", error);
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
    }
  };

  // Atualiza os dados sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchCarrinho();
    }, [])
  );

  const renderItem = (item: CarrinhoItem) => (
    <View
      key={item.id}
      className="relative flex-row bg-white p-4 rounded-lg mb-4 shadow-md"
    >
      {/* Botão de "X" para remover */}
      <TouchableOpacity
        className="absolute top-2 right-2"
        onPress={() => removeFromCarrinho(item.id)}
      >
        <Ionicons name="close-outline" size={24} color="#FF0000" />
      </TouchableOpacity>

      {/* Imagem e informações do produto */}
      <Image
        source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }}
        className="w-20 h-20 rounded-lg mr-4"
      />
      <View className="flex-1 justify-center">
        <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
        <Text className="text-base text-gray-600 my-1">
          Quantidade: {item.quantidade}
        </Text>
        <Text className="text-base text-gray-600 my-1">
          Preço Unitário: R$ {item.price.toFixed(2)}
        </Text>
        <Text className="text-lg font-semibold text-[#009432]">
          Subtotal: R$ {item.subtotal.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const calculateTotal = () =>
    itens.reduce((total, item) => total + item.subtotal, 0).toFixed(2);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="p-4">
        <Text className="text-2xl font-bold text-[#009432] text-center mb-6">
          Carrinho de Compras
        </Text>
        {itens.length > 0 ? (
          itens.map((item) => renderItem(item))
        ) : (
          <Text className="text-center text-gray-500">
            Seu carrinho está vazio.
          </Text>
        )}
        {itens.length > 0 && (
          <View className="bg-white rounded-lg p-4 shadow-md mt-4">
            <Text className="text-xl font-bold text-[#009432] mb-4">
              Total: R$ {calculateTotal()}
            </Text>
            <TouchableOpacity
              className="bg-[#009432] py-4 rounded-lg shadow-md"
              onPress={finalizarCompra}
            >
              <Text className="text-center text-white text-lg font-bold">
                Finalizar Compra
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
