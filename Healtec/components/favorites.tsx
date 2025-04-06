import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { Card } from "./card";
import { TextButton } from "./text-button";
import { useNavigation } from "@react-navigation/native";
import Ripple from "react-native-material-ripple";

interface FavoritesProps {
    items: {
        id: string;
        name: string;
        specialty: string;
        rating: string;
        image: string;
        patients: string;
        yearsExp: string;
        reviews: string;
        aboutMe: string;
    }[];
}

const { width } = Dimensions.get("window");

export const Favorites = ({ items }: FavoritesProps) => {
    const navigation = useNavigation();
    
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
                            <Ripple
                                onPress={() => 
                                    navigation.navigate("Detail", { doctor: item })
                                }
                                rippleContainerBorderRadius={8}
                                rippleColor="#4894FE"
                            >
                                <Card
                                    name={item.name}
                                    image={item.image}
                                    rating={item.rating}
                                    specialty={item.specialty}
                                />
                            </Ripple>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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