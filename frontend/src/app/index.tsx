import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";

export default function Index() {
  const [produtos, setProdutos] = useState([]);

  // Função para buscar os produtos
  const fetchProdutos = async () => {
    try {
      const response = await axios.get("http://192.168.0.108:3001/produto");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // Atualiza a lista ao voltar para a tela
  useFocusEffect(
    useCallback(() => {
      fetchProdutos();
    }, [])
  );

  const renderProduct = (produto: any) => (
    <View
      key={produto.id}
      className="flex-row bg-white rounded-lg shadow-md p-4 mb-4"
    >
      {/* Substituir pelo campo `imagem` do produto quando disponível */}
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
      </View>
    </View>
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
