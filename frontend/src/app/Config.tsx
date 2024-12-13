import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleHighContrast = () => {
    setHighContrastEnabled(!highContrastEnabled);
    Alert.alert(
      "Modo de Alto Contraste",
      highContrastEnabled
        ? "O modo de alto contraste foi desativado."
        : "O modo de alto contraste foi ativado."
    );
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 22)); // Limita o tamanho máximo a 22px
    if (fontSize < 22) {
      Alert.alert("Ajuste de Fonte", "O tamanho da fonte foi aumentado.");
    }
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 14)); // Limita o tamanho mínimo a 14px
    if (fontSize > 14) {
      Alert.alert("Ajuste de Fonte", "O tamanho da fonte foi reduzido.");
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Cache Limpo", "Todos os dados de cache foram removidos.");
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
      Alert.alert("Erro", "Não foi possível limpar o cache.");
    }
  };

  const exitApp = () => {
    Alert.alert(
      "Sair do Aplicativo",
      "Você tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: () => console.log("Encerrar o aplicativo") }, // Aqui você pode usar uma API para fechar o app, dependendo da plataforma
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      style={[
        styles.container,
        highContrastEnabled && { backgroundColor: "#000" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { fontSize },
          highContrastEnabled && { color: "#FFF" },
        ]}
      >
        Configurações de Acessibilidade
      </Text>

      {/* Modo de Alto Contraste */}
      <View style={styles.settingItem}>
        <Text
          style={[
            styles.settingLabel,
            { fontSize },
            highContrastEnabled && { color: "#FFF" },
          ]}
        >
          Alto Contraste
        </Text>
        <Switch
          value={highContrastEnabled}
          onValueChange={toggleHighContrast}
          trackColor={{ false: "#ccc", true: "#009432" }}
          thumbColor={highContrastEnabled ? "#009432" : "#f4f4f4"}
        />
      </View>

      {/* Ajuste de Tamanho de Fonte */}
      <View style={styles.settingItem}>
        <Text
          style={[
            styles.settingLabel,
            { fontSize },
            highContrastEnabled && { color: "#FFF" },
          ]}
        >
          Tamanho da Fonte
        </Text>
        <View style={styles.fontSizeControls}>
          <TouchableOpacity
            style={[styles.fontSizeButton, highContrastEnabled && { backgroundColor: "#444" }]}
            onPress={decreaseFontSize}
          >
            <Text style={[styles.fontSizeButtonText, { fontSize }]}>-</Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.fontSizeValue,
              { fontSize },
              highContrastEnabled && { color: "#FFF" },
            ]}
          >
            {fontSize}px
          </Text>
          <TouchableOpacity
            style={[styles.fontSizeButton, highContrastEnabled && { backgroundColor: "#444" }]}
            onPress={increaseFontSize}
          >
            <Text style={[styles.fontSizeButtonText, { fontSize }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Limpar Cache */}
      <TouchableOpacity style={styles.actionButton} onPress={clearCache}>
        <Text style={styles.actionButtonText}>Limpar Cache</Text>
      </TouchableOpacity>

      {/* Sair do Aplicativo */}
      <TouchableOpacity style={[styles.actionButton, styles.exitButton]} onPress={exitApp}>
        <Text style={styles.actionButtonText}>Sair do Aplicativo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e6f7ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009432",
    marginBottom: 20,
    textAlign: "center",
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  fontSizeControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  fontSizeButton: {
    backgroundColor: "#009432",
    padding: 10,
    borderRadius: 8,
  },
  fontSizeButtonText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
  },
  fontSizeValue: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#009432",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  exitButton: {
    backgroundColor: "#FF0000",
  },
});
