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
import * as ImagePicker from "expo-image-picker"; // Biblioteca para selecionar imagens
import { addProdutoApi } from "../api/produtoApi"; // Função de API para adicionar produtos

// Componente para cadastrar um produto
export default function AddProduct() {
  // Estados para armazenar os dados do produto
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [unitType, setUnitType] = useState<"Unidade" | "Quilo">("Unidade");
  const [image, setImage] = useState<string | null>(null);

  // Função para selecionar uma imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Permite apenas imagens
      allowsEditing: true, // Habilita edição antes de selecionar
      quality: 1, // Qualidade máxima da imagem
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      // Verifica se o arquivo não excede 5 MB
      if (selectedImage.fileSize && selectedImage.fileSize > 5 * 1024 * 1024) {
        Alert.alert("Erro", "O arquivo selecionado excede o limite de 5 MB.");
        return;
      }

      setImage(selectedImage.uri); // Armazena o URI da imagem
    }
  };
  
  // Função para enviar o produto
  const handleAddProduct = async () => {
    // Valida os campos obrigatórios
    if (!productName || !productPrice || !productQuantity || !image) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos obrigatórios e selecione uma imagem."
      );
      return;
    }

    // Substitui vírgulas por pontos no preço e converte para número
    const formattedPrice = parseFloat(productPrice.replace(",", "."));

    if (isNaN(formattedPrice)) {
      Alert.alert("Erro", "Insira um preço válido.");
      return;
    }

    // Cria um objeto FormData para envio de dados
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", formattedPrice.toFixed(2)); // Formata o preço com 2 casas decimais
    formData.append("unitType", unitType);
    formData.append("quantity", parseInt(productQuantity, 10).toString());
    formData.append("image", {
      uri: image,
      name: `image_${Date.now()}.jpg`, // Nome único para a imagem
      type: "image/jpeg", // Tipo MIME
    } as any);

    try {
      await addProdutoApi(formData); // Chama a API para adicionar o produto
      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      // Reseta os estados após o sucesso
      setProductName("");
      setProductPrice("");
      setProductQuantity("");
      setUnitType("Unidade");
      setImage(null);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-6 py-8">
        <Text className="text-center text-3xl font-bold text-[#009432] mb-8">
          Cadastro de Produto
        </Text>

        {/* Campo para o nome do produto */}
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

        {/* Campo para o preço */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">Preço:</Text>
          <TextInput
            className="bg-white shadow-md border border-gray-300 rounded-lg px-4 py-3 text-lg"
            value={productPrice}
            onChangeText={setProductPrice}
            placeholder="Digite o preço"
            keyboardType="numeric" // Teclado numérico
          />
        </View>

        {/* Seleção do tipo de unidade */}
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

        {/* Campo para quantidade disponível */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Quantidade Disponível:
          </Text>
          <TextInput
            className="bg-white shadow-md border border-gray-300 rounded-lg px-4 py-3 text-lg"
            value={productQuantity}
            onChangeText={setProductQuantity}
            placeholder="Digite a quantidade disponível"
            keyboardType="numeric" // Teclado numérico
          />
        </View>

        {/* Botão para selecionar uma imagem */}
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

        {/* Botão para adicionar o produto */}
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
