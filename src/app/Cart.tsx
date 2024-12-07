import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const items = [
  {
    id: "1",
    name: "Maçã",
    quantity: 3,
    price: 2.5,
    image: "https://via.placeholder.com/100",
  },
  {
    id: "2",
    name: "Banana",
    quantity: 5,
    price: 1.2,
    image: "https://via.placeholder.com/100",
  },
  {
    id: "3",
    name: "Laranja",
    quantity: 2,
    price: 3.0,
    image: "https://via.placeholder.com/100",
  },
];

export default function Cart() {
  const renderItem = (item: typeof items[0]) => (
    <View key={item.id} className="flex-row bg-white p-4 rounded-lg mb-4 shadow-md">
      <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg mr-4" />
      <View className="flex-1 justify-center">
        <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
        <Text className="text-base text-gray-600 my-1">
          Quantidade: {item.quantity}
        </Text>
        <Text className="text-lg font-semibold text-[#009432]">
          R$ {item.price.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const calculateTotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-[#009432] text-center mb-6">
            Carrinho de Compras
          </Text>
          {items.map((item) => renderItem(item))}
          <View className="bg-white rounded-lg p-4 shadow-md mt-4">
            <Text className="text-xl font-bold text-[#009432] mb-4">
              Total: R$ {calculateTotal()}
            </Text>
            <TouchableOpacity className="bg-[#009432] py-4 rounded-lg shadow-md">
              <Text className="text-center text-white text-lg font-bold">
                Finalizar Compra
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
