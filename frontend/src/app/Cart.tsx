import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import {
  fetchCarrinhoApi,
  removeFromCarrinhoApi,
  finalizarCompraApi,
  searchLocationApi,
  CarrinhoItem,
  NominatimResponse,
} from "../api/carrinhoApi";

// Componente para exibição e gerenciamento do carrinho de compras
export default function Cart() {
  // Estados para armazenar dados e controlar comportamentos
  const [itens, setItens] = useState<CarrinhoItem[]>([]); // Itens do carrinho
  const [useGps, setUseGps] = useState(false); // Controle do uso do GPS
  const [manualLocation, setManualLocation] = useState(""); // Localização manual
  const [suggestions, setSuggestions] = useState<NominatimResponse[]>([]); // Sugestões de localização
  const [loading, setLoading] = useState(false); // Indicador de carregamento

  // Função para buscar os itens do carrinho via API
  const fetchCarrinho = async () => {
    try {
      const data = await fetchCarrinhoApi();
      setItens(data); // Atualiza os itens no estado
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o carrinho.");
    }
  };

  // Função para remover um item do carrinho
  const removeFromCarrinho = async (id: number) => {
    try {
      await removeFromCarrinhoApi(id);
      Alert.alert("Sucesso", "Item removido do carrinho!");
      fetchCarrinho(); // Atualiza o carrinho após a remoção
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  };

  // Função para obter a localização via GPS
  const getGpsLocation = async (): Promise<string | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "Permita o acesso à localização para usar o GPS."
        );
        return null;
      }
      const location = await Location.getCurrentPositionAsync({});
      return `${location.coords.latitude},${location.coords.longitude}`;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a localização pelo GPS.");
      return null;
    }
  };

  // Função para buscar sugestões de localização a partir de uma string
  const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true); // Ativa o indicador de carregamento
    try {
      const data = await searchLocationApi(query);
      setSuggestions(data); // Atualiza as sugestões de localização
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar as localizações.");
    } finally {
      setLoading(false); // Desativa o indicador de carregamento
    }
  };

  // Função para finalizar a compra
  const finalizarCompra = async () => {
    try {
      let location: string | null = manualLocation;
      if (useGps) {
        const gpsLocation = await getGpsLocation(); // Obtém a localização via GPS
        if (!gpsLocation) {
          Alert.alert("Erro", "Não foi possível obter a localização.");
          return;
        }
        location = gpsLocation;
      }

      if (!location || location.trim() === "") {
        Alert.alert("Erro", "Por favor, informe uma localização válida.");
        return;
      }

      await finalizarCompraApi(location); // Finaliza a compra via API
      Alert.alert("Sucesso", "Compra finalizada com sucesso!");
      setManualLocation("");
      fetchCarrinho(); // Atualiza o carrinho após a finalização
    } catch (error) {
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
    }
  };

  // Atualiza os itens do carrinho ao focar na tela
  useFocusEffect(
    useCallback(() => {
      fetchCarrinho();
    }, [])
  );

  // Função para renderizar cada item do carrinho
  const renderCarrinhoItem = ({ item }: { item: CarrinhoItem }) => (
    <View key={item.id} className="flex-row bg-white p-4 rounded-lg mb-4 shadow">
      <TouchableOpacity
        className="absolute top-2 right-2"
        onPress={() => removeFromCarrinho(item.id)} // Remove o item ao clicar
      >
        <Ionicons name="close-outline" size={24} color="#FF0000" />
      </TouchableOpacity>
      <Image
        source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }}
        className="w-16 h-16 rounded-lg mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600">
          Quantidade: {item.quantidade}
        </Text>
        <Text className="text-sm text-gray-600">
          Preço Unitário: R$ {item.price.toFixed(2)}
        </Text>
        <Text className="text-lg font-semibold text-green-600">
          Subtotal: R$ {item.subtotal.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  // Função para calcular o total do carrinho
  const calculateTotal = () =>
    itens.reduce((total, item) => total + item.subtotal, 0).toFixed(2);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id.toString()} // Define uma chave única para cada item
        renderItem={renderCarrinhoItem} // Renderiza cada item do carrinho
        ListHeaderComponent={
          <Text className="text-2xl font-bold text-center text-green-600 my-4">
            Carrinho de Compras
          </Text>
        }
        ListEmptyComponent={
          <Text className="text-center text-gray-400">
            Seu carrinho está vazio.
          </Text>
        }
        ListFooterComponent={
          itens.length > 0 ? (
            <View className="bg-white rounded-lg p-4 shadow mt-4">
              <Text className="text-xl font-bold text-green-600 mb-4">
                Total: R$ {calculateTotal()}
              </Text>
              <View className="mb-4">
                {/* Botão para alternar entre GPS e localização manual */}
                <TouchableOpacity
                  className={`py-2 px-4 rounded-lg ${
                    useGps ? "bg-gray-400" : "bg-green-600"
                  }`}
                  onPress={() => setUseGps(!useGps)}
                >
                  <Text className="text-center text-white font-bold">
                    {useGps ? "Usar Localização Manual" : "Usar Localização por GPS"}
                  </Text>
                </TouchableOpacity>
                {!useGps && (
                  <View>
                    {/* Campo de entrada para localização manual */}
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2 mt-2"
                      placeholder="Digite a localização manualmente"
                      value={manualLocation}
                      onChangeText={(text) => {
                        setManualLocation(text);
                        searchLocation(text);
                      }}
                    />
                    {loading && <ActivityIndicator size="small" color="#009432" />}
                    {/* Lista de sugestões de localização */}
                    <FlatList
                      data={suggestions}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          className="bg-gray-100 p-2 border-b border-gray-300"
                          onPress={() => {
                            setManualLocation(`${item.lat},${item.lon}`);
                            setSuggestions([]);
                          }}
                        >
                          <Text>{item.display_name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </View>
              {/* Botão para finalizar a compra */}
              <TouchableOpacity
                className="bg-green-600 py-4 rounded-lg shadow"
                onPress={finalizarCompra}
              >
                <Text className="text-center text-white text-lg font-bold">
                  Finalizar Compra
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
