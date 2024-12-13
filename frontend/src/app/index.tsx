import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { fetchProdutosApi, addToCarrinhoApi, Produto } from "../api/produtoApi";
import ProductCard from "../components/ProductCard"; // Importando o componente ProductCard

export default function Index() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const fetchProdutos = async () => {
    try {
      const data = await fetchProdutosApi();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    }
  };

  const addToCarrinho = async (produtoId: number) => {
    try {
      await addToCarrinhoApi(produtoId, 1);
      Alert.alert("Sucesso", "Produto adicionado ao carrinho!");
      fetchProdutos(); // Atualiza os produtos para refletir o estoque atualizado.
    } catch (error: unknown) {
      console.error("Erro ao adicionar ao carrinho:", error);
      Alert.alert("Erro", "Erro ao adicionar produto ao carrinho.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProdutos();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Lista de produtos */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Cabeçalho */}
        <View className="bg-[#009432] pb-20 pt-12 px-6 rounded-b-[15px]">
          <Text className="text-white text-3xl font-bold text-center">
            AgroGestor
          </Text>
        </View>

        <View style={{ marginTop: -50 }}>
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <ProductCard
                key={produto.id}
                id={produto.id}
                name={produto.name}
                price={produto.price}
                unitType={produto.unitType}
                quantity={produto.quantity}
                imageUrl={produto.imageUrl}
                onAddToCart={addToCarrinho}
              />

            ))
          ) : (
            <Text className="text-center text-white">
              Nenhum produto disponível no momento.
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="bg-[#009432] py-4 mx-4 mt-6 rounded-lg shadow-lg"
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
