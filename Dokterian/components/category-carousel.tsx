import { FlatList, StyleSheet, Text, View } from "react-native";
import Ripple from "react-native-material-ripple";
import Ionicons from "@react-native-vector-icons/ionicons";

interface CategoryCarouselProps {
    categories: { id: string; name: string, icon: string }[];
    onSelect: (category: string) => void;
}

export const CategoryCarousel = ({ categories, onSelect }: CategoryCarouselProps) => {
    return (
        <View style={styles.container}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.categoryItem}>
                <Ripple
                  style={styles.icon}
                  rippleColor="#4894FE"
                  rippleContainerBorderRadius={100}
                  onPress={() => onSelect(item.name)}
                >
                  <Ionicons name={item.icon as any} size={24} color="#4894FE" />
                </Ripple>
                <Text style={styles.text}>{item.name}</Text>
              </View>
            )}
          />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    icon: {
      width: 72,
      height: 72,
      backgroundColor: "#FAFAFA",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100
    },
    categoryItem: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 6,
      gap: 8,
    },
    text: {
      fontSize: 14,
      lineHeight: 18,
      color: "#8696BB",
      fontFamily: "Poppins-Regular"
    },
});