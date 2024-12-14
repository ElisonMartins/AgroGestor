import { Tabs } from "expo-router";
import '../styles/global.css'
import TabBar from "../components/TabBar"; 
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      {/* Página Home */}
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Produtos disponíveis",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Página Carrinho */}
      <Tabs.Screen
        name="Cart"
        options={{
          headerTitle: "Carrinho",
          tabBarLabel: "Carrinho",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Página Adicionar Produto */}
      <Tabs.Screen
        name="AddProduct"
        options={{
          headerTitle: "Adicionar Produto",
          tabBarLabel: "Adicionar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Página Análise de Vendas */}
      <Tabs.Screen
        name="SalesAnalysis"
        options={{
          headerTitle: "Análise de Vendas",
          tabBarLabel: "Vendas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
     
    </Tabs>
  );
}
