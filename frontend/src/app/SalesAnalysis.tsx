import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { fetchVendasApi, Venda } from "../api/vendasApi";

export default function SalesAnalysis() {
  const [vendas, setVendas] = useState<Venda[]>([]);

  const fetchVendas = async () => {
    try {
      const data = await fetchVendasApi();
      setVendas(data);
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
      return null;
    }

    const [latitude, longitude] = location.replace(/\s/g, "").split(",").map(Number);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn("Coordenadas inválidas:", { latitude, longitude });
      return null;
    }

    return { latitude, longitude };
  };

  const totalVendas = vendas.reduce((acc, venda) => acc + (venda._sum.total || 0), 0);
  const totalPontos = vendas.length;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -8.8828,
          longitude: -36.4964,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {vendas.map((venda, index) => {
          const location = parseLocation(venda.location);
          if (!location) return null;
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

      <View style={[styles.panel, { bottom: 60 }]}>
        <Text style={styles.panelTitle}>Resumo de Vendas</Text>
        <Text style={styles.panelText}>
          Total de Pontos: <Text style={styles.bold}>{totalPontos}</Text>
        </Text>
        <Text style={styles.panelText}>
          Total Arrecadado: <Text style={styles.bold}>R$ {totalVendas.toFixed(2)}</Text>
        </Text>
      </View>
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
  panel: {
    position: "absolute",
    bottom: 85,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009432",
    marginBottom: 10,
  },
  panelText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
});
