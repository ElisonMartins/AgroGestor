import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_URL } from "@env"; 

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [unitType, setUnitType] = useState<"Unidade" | "Quilo">("Unidade");

  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productQuantity) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/produto`, {
        name: productName,
        price: parseFloat(productPrice),
        unitType,
        quantity: parseInt(productQuantity, 10),
      });

      alert("Produto cadastrado com sucesso!");
      console.log(response.data);

      // Resetando os campos após o cadastro
      setProductName("");
      setProductPrice("");
      setProductQuantity("");
    } catch (error) {
      console.error("Erro ao cadastrar o produto:", error);
      alert("Erro ao cadastrar o produto. Verifique os dados e tente novamente.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="w-full px-6 py-8">
          <Text className="text-center text-3xl font-bold text-[#009432] mb-8">
            Cadastro de Produto
          </Text>

          {/* Nome do Produto */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              Nome do Produto:
            </Text>
            <TextInput
              className="bg-white shadow-md border border-gray-300 rounded-lg px-4 py-3 text-lg"
              value={productName}
              onChangeText={setProductName}
              placeholder="Digite o nome do produto"
            />
          </View>

          {/* Preço por Unidade ou Quilo */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              Preço:
            </Text>
            <View className="flex-row items-center space-x-2 mb-4">
              <TouchableOpacity
                className={`flex-1 bg-${
                  unitType === "Unidade" ? "[#009432]" : "white"
                } border border-gray-300 rounded-lg px-4 py-3 shadow-md`}
                onPress={() => setUnitType("Unidade")}
              >
                <Text
                  className={`text-center text-lg font-semibold ${
                    unitType === "Unidade" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Unidade
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 bg-${
                  unitType === "Quilo" ? "[#009432]" : "white"
                } border border-gray-300 rounded-lg px-4 py-3 shadow-md`}
                onPress={() => setUnitType("Quilo")}
              >
                <Text
                  className={`text-center text-lg font-semibold ${
                    unitType === "Quilo" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Quilo
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className="bg-white shadow-md border border-gray-300 rounded-lg px-4 py-3 text-lg"
              value={productPrice}
              onChangeText={setProductPrice}
              placeholder={`Digite o preço por ${unitType.toLowerCase()}`}
              keyboardType="numeric"
            />
          </View>

          {/* Quantidade Disponível */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              Quantidade Disponível:
            </Text>
            <TextInput
              className="bg-white shadow-md border border-gray-300 rounded-lg px-4 py-3 text-lg"
              value={productQuantity}
              onChangeText={setProductQuantity}
              placeholder="Digite a quantidade disponível"
              keyboardType="numeric"
            />
          </View>

          {/* Botão de Adicionar Produto */}
          <TouchableOpacity
            className="bg-[#009432] rounded-lg px-4 py-4 shadow-lg"
            onPress={handleAddProduct}
          >
            <Text className="text-center text-white text-lg font-bold">
              Adicionar Produto
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
