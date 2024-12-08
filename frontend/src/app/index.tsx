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
import axios, { AxiosError } from "axios";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@env";

type Produto = {
  id: number;
  name: string;
  price: number;
  unitType: string;
  quantity: number;
  image?: string;
};

export default function Index() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [quantidades, setQuantidades] = useState<{ [key: number]: number }>({});

  const fetchProdutos = async () => {
    try {
      const response = await axios.get(`${API_URL}/produto`);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const addToCarrinho = async (produtoId: number) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) {
      Alert.alert("Erro", "Produto não encontrado.");
      return;
    }

    const quantidadeParaAdicionar = quantidades[produtoId] || 1;

    try {
      await axios.post(`${API_URL}/carrinho`, {
        produtoId,
        quantidade: quantidadeParaAdicionar,
      });

      Alert.alert("Sucesso", "Produto adicionado ao carrinho!");

      // Reseta a quantidade para 1 após adicionar ao carrinho
      setQuantidades((prev) => ({
        ...prev,
        [produtoId]: 1,
      }));

      fetchProdutos(); // Atualiza os produtos para refletir o estoque atualizado.
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Erro ao adicionar ao carrinho.";
        Alert.alert("Erro", errorMessage);
      } else {
        console.error("Erro desconhecido:", error);
        Alert.alert("Erro", "Erro desconhecido ao adicionar ao carrinho.");
      }
    }
  };

  const handleQuantidadeChange = (produtoId: number, delta: number) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) return;

    setQuantidades((prev) => {
      const novaQuantidade = Math.min(
        Math.max((prev[produtoId] || 1) + delta, 1), // Não permite valores negativos ou zero
        produto.quantity // Limita ao estoque disponível
      );

      return { ...prev, [produtoId]: novaQuantidade };
    });
  };

  const renderProduct = (produto: Produto) => {
    const quantidadeParaAdicionar = quantidades[produto.id] || 1;

    return (
      <View
        key={produto.id}
        className="flex-row bg-white rounded-lg shadow-md p-4 mb-4"
      >
        <Image
          source={{
            uri: produto.image || "https://via.placeholder.com/100",
          }}
          className="w-20 h-20 rounded-lg mr-4"
        />
        <View className="flex-1 justify-center">
          <Text className="text-lg font-bold text-gray-800">{produto.name}</Text>
          <Text className="text-base text-gray-600 my-1">
            R$ {produto.price.toFixed(2)} por {produto.unitType.toLowerCase()}
          </Text>
          <Text className="text-sm text-gray-500">
            Disponível: {produto.quantity}
          </Text>

          {/* Controle de quantidade */}
          <View className="flex-row items-center justify-center mt-2 bg-gray-200 rounded-lg">
            <TouchableOpacity
              onPress={() => handleQuantidadeChange(produto.id, -1)}
              className="px-2 py-1"
            >
              <Ionicons name="remove-outline" size={18} color="#333" />
            </TouchableOpacity>
            <Text className="px-4 py-1 text-base font-bold text-gray-800">
              {quantidadeParaAdicionar}
            </Text>
            <TouchableOpacity
              onPress={() => handleQuantidadeChange(produto.id, 1)}
              className="px-2 py-1"
            >
              <Ionicons name="add-outline" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="flex-row items-center bg-[#009432] mt-2 py-2 px-4 rounded-lg shadow-md"
            onPress={() => addToCarrinho(produto.id)}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white text-sm font-bold">
              Adicionar ao Carrinho
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchProdutos();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="bg-[#009432] p-6">
          <Text className="text-center text-2xl font-bold text-white">
            Produtos Disponíveis
          </Text>
        </View>

        <View className="px-4 py-6">
          {produtos.length > 0 ? (
            produtos.map(renderProduct)
          ) : (
            <Text className="text-center text-gray-500">
              Nenhum produto disponível no momento.
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="bg-[#009432] py-4 mx-4 rounded-lg shadow-lg"
          onPress={() => router.push("/AddProduct")}
        >
          <Text className="text-center text-white text-lg font-bold">
            Adicionar Produto
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
