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
import * as ImagePicker from "expo-image-picker";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [unitType, setUnitType] = useState<"Unidade" | "Quilo">("Unidade");

  // Função para abrir o seletor de imagens
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0].uri);
    }
  };

  const handleAddProduct = () => {
    if (!productName || !productImage || !productPrice || !productQuantity) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    console.log({
      productName,
      productImage,
      productPrice,
      productQuantity,
      unitType,
    });

    alert("Produto cadastrado com sucesso!");
    setProductName("");
    setProductImage(null);
    setProductPrice("");
    setProductQuantity("");
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

          {/* Imagem do Produto */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-2">
              Imagem do Produto:
            </Text>
            <TouchableOpacity
              className="bg-[#009432] rounded-lg px-4 py-3 shadow-lg"
              onPress={pickImage}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Selecionar Imagem
              </Text>
            </TouchableOpacity>
            {productImage && (
              <Image
                source={{ uri: productImage }}
                className="w-40 h-40 rounded-lg mt-4 mx-auto shadow-md"
              />
            )}
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
