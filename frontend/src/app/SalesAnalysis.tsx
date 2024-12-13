// src/screens/SalesAnalysis.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { fetchVendasApi, Venda } from "../api/vendasApi";

export default function SalesAnalysis() {
  const [vendas, setVendas] = useState<Venda[]>([]);

  // Função para buscar as vendas
  const fetchVendas = async () => {
    try {
      const data = await fetchVendasApi();
      console.log("Dados recebidos:", data); // Debug do retorno
      setVendas(data);
    } catch (error) {
      console.error("Erro ao buscar análise de vendas:", error);
      Alert.alert("Erro", "Não foi possível carregar a análise de vendas.");
    }
  };

  useEffect(() => {
    fetchVendas();

    // Atualização periódica a cada 5 segundos
    const interval = setInterval(() => {
      console.log("Atualizando dados...");
      fetchVendas();
    }, 5000);

    // Limpar o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  // Função para converter a localização
  const parseLocation = (location: string | null) => {
    if (!location) {
      console.warn("Localização inválida ou ausente:", location);
      return null;
    }

    const [latitude, longitude] = location.replace(/\s/g, "").split(",").map(Number);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn("Coordenadas inválidas:", { latitude, longitude });
      return null;
    }

    return { latitude, longitude };
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -8.8828, // Latitude de Garanhuns
          longitude: -36.4964, // Longitude de Garanhuns
          latitudeDelta: 0.5, // Ajuste o zoom (menor valor = mais próximo)
          longitudeDelta: 0.5, // Ajuste o zoom (menor valor = mais próximo)
        }}
      >
        {vendas.map((venda, index) => {
          const location = parseLocation(venda.location);

          if (!location) return null; // Ignorar localizações inválidas

          const { latitude, longitude } = location;

          return (
            <Marker
              key={index}
              coordinate={{ latitude, longitude }}
              title={`Vendas: ${venda._count._all}`}
              description={`Total: R$ ${venda._sum.total?.toFixed(2) || 0}`}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0ffe0",
  },
  map: {
    flex: 1,
  },
});
