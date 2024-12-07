import { Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

type TabBarButtonProps = {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  color: string;
};

// Ícones para cada rota
const icons: Record<string, (props: { color: string }) => JSX.Element> = {
  index: (props) => <Ionicons name="home-outline" size={24} {...props} />,
  AddProduct: (props) => <Ionicons name="add-circle-outline" size={24} {...props} />,
  Cart: (props) => <Ionicons name="cart-outline" size={24} {...props} />,
  SalesAnalysis: (props) => <Ionicons name="bar-chart-outline" size={24} {...props} />,
  Config: (props) => <Ionicons name="settings-outline" size={24} {...props} />,
};

const TabBarButton: React.FC<TabBarButtonProps> = ({ onPress, onLongPress, isFocused, routeName, color }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, -8]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        {icons[routeName] && icons[routeName]({ color })}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

export default TabBarButton;
