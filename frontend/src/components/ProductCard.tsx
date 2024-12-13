import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  unitType: string;
  quantity: number;
  imageUrl?: string;
  onAddToCart: (id: number, quantidade: number) => void;
};

export default function ProductCard({
  id,
  name,
  price,
  unitType,
  quantity,
  imageUrl,
  onAddToCart,
}: ProductCardProps) {
  const [quantidadeParaAdicionar, setQuantidadeParaAdicionar] = useState(1);

  const handleQuantidadeChange = (delta: number) => {
    setQuantidadeParaAdicionar((prev) =>
      Math.min(Math.max(prev + delta, 1), quantity)
    );
  };

  return (
    <View
      key={id}
      className="bg-white rounded-lg shadow-md p-4 mb-6 mx-4"
      style={{ overflow: "hidden" }}
    >
      <Image
        source={{
          uri: imageUrl || "https://via.placeholder.com/100",
        }}
        className="w-full h-40 rounded-md mb-4"
      />
      <View className="mb-4">
        {/* Título */}
        <Text className="text-lg font-bold text-gray-800">{name}</Text>

        {/* Disponibilidade */}
        <Text className="text-sm text-gray-600 mt-2">
          Disponível: {quantity} {unitType.toLowerCase()}
        </Text>
      </View>

      {/* Preço e Controle de Quantidade */}
      <View className="flex-row items-center justify-between mt-4">
        {/* Preço */}
        <View>
          <Text className="text-3xl font-bold text-gray-800">R$ {price}</Text>
          <Text className="text-sm text-gray-500">por {unitType.toLowerCase()}</Text>
        </View>

        {/* Controle de Quantidade */}
        <View className="flex-row items-center bg-gray-200 rounded-lg p-1">
          <TouchableOpacity
            onPress={() => handleQuantidadeChange(-1)}
            className="px-2"
          >
            <Ionicons name="remove-outline" size={18} color="#333" />
          </TouchableOpacity>
          <Text className="px-3 text-base font-bold text-gray-800">
            {quantidadeParaAdicionar}
          </Text>
          <TouchableOpacity
            onPress={() => handleQuantidadeChange(1)}
            className="px-2"
          >
            <Ionicons name="add-outline" size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão Adicionar ao Carrinho */}
      <TouchableOpacity
        className="bg-[#009432] mt-4 py-2 rounded-md flex-row justify-center items-center"
        onPress={() => onAddToCart(id, quantidadeParaAdicionar)}
      >
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text className="text-white ml-2 font-bold">Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}
