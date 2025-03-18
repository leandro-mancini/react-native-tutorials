import { StyleSheet, Text, View } from "react-native";
import { AppBar } from "../components/appbar";
import { Category } from "../components/category";
import { useState } from "react";

const categories = [
    { id: "1", name: "🔥 Todos" },
    { id: "2", name: "🤒 Febre ️" },
    { id: "3", name: "🤧 Tosse" },
    { id: "4", name: "🤢 Enjoado(a)" },
    { id: "5", name: "🤕 Dor de Cabeça" },
    { id: "6", name: "🤮 Vômito" },
    { id: "7", name: "🤯 Enxaqueca" },
    { id: "8", name: "🥴 Tontura" },
    { id: "9", name: "😷 Gripe" },
];

export const HomeScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("🔥 Todos");
    
    return (
        <View style={styles.container}>
            <AppBar 
                username="Leandro Mancini"
                avatarUrl="https://avatars.githubusercontent.com/u/8883746?v=4"
                onIconPress={() => console.log("Notificações pressionadas!")}
            />
            <View style={styles.section}>
                <Category categories={categories} selected={selectedCategory} onSelect={(category) => setSelectedCategory(category)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    section: {
        paddingVertical: 24
    }
})