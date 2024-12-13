import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { API_URL } from "@env";

type Venda = {
  location: string | null;
  _count: { _all: number };
  _sum: { total: number | null };
};

export default function SalesAnalysis() {
  const [vendas, setVendas] = useState<Venda[]>([]);

  const fetchVendas = async () => {
    try {
      const response = await axios.get(`${API_URL}/carrinho/analise`);
      setVendas(response.data);
    } catch (error) {
      console.error("Erro ao buscar análise de vendas:", error);
      Alert.alert("Erro", "Não foi possível carregar a análise de vendas.");
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  const parseLocation = (location: string | null) => {
    if (!location) {
      console.warn("Localização inválida ou ausente:", location);
      return { latitude: 0, longitude: 0 };
    }
  
    const [latitude, longitude] = location.replace(/\s/g, "").split(",").map(Number);
  
    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn("Coordenadas inválidas:", { latitude, longitude });
      return { latitude: 0, longitude: 0 };
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
          latitudeDelta: 0.10, // Ajuste o zoom (menor valor = mais próximo)
          longitudeDelta: 0.10, // Ajuste o zoom (menor valor = mais próximo)
        }}
      >
        {vendas.map((venda, index) => {
          const { latitude, longitude } = parseLocation(venda.location);

          // Ignorar markers com localização inválida
          if (latitude === 0 && longitude === 0) return null;

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
