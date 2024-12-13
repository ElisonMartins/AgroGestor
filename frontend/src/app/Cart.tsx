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

export default function Cart() {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);
  const [useGps, setUseGps] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCarrinho = async () => {
    try {
      const data = await fetchCarrinhoApi();
      setItens(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o carrinho.");
    }
  };

  const removeFromCarrinho = async (id: number) => {
    try {
      await removeFromCarrinhoApi(id);
      Alert.alert("Sucesso", "Item removido do carrinho!");
      fetchCarrinho();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  };

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

  const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchLocationApi(query);
      setSuggestions(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar as localizações.");
    } finally {
      setLoading(false);
    }
  };

  const finalizarCompra = async () => {
    try {
      let location: string | null = manualLocation;
      if (useGps) {
        const gpsLocation = await getGpsLocation();
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
  
      await finalizarCompraApi(location);
      Alert.alert("Sucesso", "Compra finalizada com sucesso!");
      setManualLocation("");
      fetchCarrinho();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      fetchCarrinho();
    }, [])
  );

  const renderCarrinhoItem = ({ item }: { item: CarrinhoItem }) => (
    <View key={item.id} className="flex-row bg-white p-4 rounded-lg mb-4 shadow">
      <TouchableOpacity
        className="absolute top-2 right-2"
        onPress={() => removeFromCarrinho(item.id)}
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

  const calculateTotal = () =>
    itens.reduce((total, item) => total + item.subtotal, 0).toFixed(2);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCarrinhoItem}
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
              <Text className="text-xl font-bold text-green-600 mb-4">Total: R$ {calculateTotal()}</Text>
              <View className="mb-4">
                <TouchableOpacity
                  className={`py-2 px-4 rounded-lg ${useGps ? "bg-gray-400" : "bg-green-600"}`}
                  onPress={() => setUseGps(!useGps)}
                >
                  <Text className="text-center text-white font-bold">
                    {useGps ? "Usar Localização Manual" : "Usar Localização por GPS"}
                  </Text>
                </TouchableOpacity>
                {!useGps && (
                  <View>
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
              <TouchableOpacity className="bg-green-600 py-4 rounded-lg shadow" onPress={finalizarCompra}>
                <Text className="text-center text-white text-lg font-bold">Finalizar Compra</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
