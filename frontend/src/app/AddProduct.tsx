import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from "@env";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [unitType, setUnitType] = useState<"Unidade" | "Quilo">("Unidade");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Salva o URI da imagem selecionada
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productQuantity || !image) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios e selecione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("unitType", unitType);
    formData.append("quantity", productQuantity);
    formData.append("image", {
      uri: image,
      name: `image_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    try {
      const response = await axios.post(`${API_URL}/produto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      console.log(response.data);

      // Resetando os campos após o cadastro
      setProductName("");
      setProductPrice("");
      setProductQuantity("");
      setUnitType("Unidade");
      setImage(null);
    } catch (error) {
      console.error("Erro ao cadastrar o produto:", error);
      Alert.alert("Erro", "Erro ao cadastrar o produto. Verifique os dados e tente novamente.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-6 py-8">
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

        {/* Preço */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">Preço:</Text>
          <TextInput
            className="bg-white shadow-md border border-gray-300 rounded-lg px-4 py-3 text-lg"
            value={productPrice}
            onChangeText={setProductPrice}
            placeholder="Digite o preço"
            keyboardType="numeric"
          />
        </View>

        {/* Tipo de Unidade */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Tipo de Unidade:
          </Text>
          <View className="flex-row items-center space-x-2">
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

        {/* Selecionar Imagem */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Imagem do Produto:
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            className="bg-gray-200 rounded-lg p-4 text-center"
          >
            <Text className="text-gray-600">
              {image ? "Imagem Selecionada" : "Selecionar Imagem"}
            </Text>
          </TouchableOpacity>
          {image && (
            <Image
              source={{ uri: image }}
              className="w-32 h-32 mt-4 self-center rounded-md"
            />
          )}
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
      </ScrollView>
    </SafeAreaView>
  );
}
