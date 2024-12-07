import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SalesAnalysis() {
  return (
    <View style={styles.container}>
      <Text className="text-sm">Análise de Vendas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0ffe0",
  },
});
