import { FlatList, StyleSheet, Text, View } from "react-native";
import Ripple from "react-native-material-ripple";

interface CategoryScheduleProps {
    categories: { id: string; name: string }[];
    onSelect: (category: string) => void;
}

export const CategorySchedule = ({ categories, onSelect }: CategoryScheduleProps) => {
    return (
        <View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              // <View style={styles.categoryItem}>
              <View style={[styles.categoryItem, index === 0 && styles.categoryFirstItem]}>
                <Ripple
                  style={styles.button}
                  rippleColor="#4894FE"
                  rippleContainerBorderRadius={100}
                  onPress={() => onSelect(item.name)}
                >
                  <Text style={styles.buttonText}>{item.name}</Text>
                </Ripple>
              </View>
            )}
          />
        </View>
    );
}

const styles = StyleSheet.create({
    categoryItem: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 6,
    },
    categoryFirstItem: {
      marginLeft: 20
    },
    button: {
      height: 50,
      backgroundColor: "rgba(99,180,255,0.10)",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
      paddingHorizontal: 32
    },
    buttonText: {
      fontSize: 16,
      lineHeight: 18,
      color: "#4894FE",
      fontFamily: "Poppins-Medium"
    },
});