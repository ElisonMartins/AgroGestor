import { ScrollView, Text, View, Button } from "react-native";
import { Header } from "../components/header";
import{ Link, router } from "expo-router";

export default function Index() {

  return (
    <ScrollView
    style={{ flex: 1}}
    className="bg-slate-200"
    showsVerticalScrollIndicator={false}
    >
      <View className="w-full px-4">
        <Header/>
        <Link href="/AddProduct">Go to AddProduct</Link>
      </View>
    </ScrollView>
  );
}
