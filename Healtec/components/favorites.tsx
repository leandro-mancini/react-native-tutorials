import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { Card } from "./card";
import { TextButton } from "./text-button";

interface FavoritesProps {
    items: { id: string; name: string; specialty: string; rank: string; image: string; }[];
}

const { width } = Dimensions.get("window");

export const Favorites = ({ items }: FavoritesProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.infoTitle}>Médicos Favoritos</Text>
                <TextButton label="Ver todos" onPress={() => {}} />
            </View>
            <FlatList
                data={items}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                    return (
                        <View style={[
                            styles.favoriteItem, 
                            index === 0 && styles.favoriteFirstItem,
                            index === items.length -1 && styles.favoriteLastItem
                        ]}>
                            <Card
                                name={item.name}
                                image={item.image}
                                rank={item.rank}
                                specialty={item.specialty}
                            />
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // gap: 16,
        marginBottom: -32
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        color: "#101010",
        paddingHorizontal: 24,
        justifyContent: "space-between",
    },
    infoTitle: {
        fontFamily: "Inter_18pt-Medium",
        fontSize: 16,
        lineHeight: 18,
    },
    favoriteItem: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
      paddingBottom: 32,
      paddingTop: 16,
      width: (width / 2) - 24,
    },
    favoriteFirstItem: {
        marginLeft: 24,
    },
    favoriteLastItem: {
        marginRight: 24,
    },
    button: {
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      height: 193,
      width: "100%"
    },
    buttonText: {
      fontSize: 14,
      lineHeight: 16,
      color: "#939393",
      fontFamily: "Inter_24pt-Regular"
    },
});