import { FlatList, StyleSheet, Text, View } from "react-native";
import Ripple from "react-native-material-ripple";
import React, { useState } from "react";

interface CategoryProps {
    categories: { id: string; name: string }[];
    onSelect: (category: string) => void;
    selected: string;
}

export const Category = ({ categories, selected, onSelect }: CategoryProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(selected);

    return (
        <View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const isSelected = selectedCategory === item.name;

              return (
                <View style={[styles.categoryItem, index === 0 && styles.categoryFirstItem]}>
                  <Ripple
                    style={[styles.button, isSelected && styles.selectedButton]}
                    rippleColor="#4894FE"
                    rippleContainerBorderRadius={100}
                    onPress={() => {
                      setSelectedCategory(item.name);
                      onSelect(item.name);
                    }}
                  >
                    <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]}>
                      {item.name}
                    </Text>
                  </Ripple>
                </View>
              );
            }}
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
      marginLeft: 24,
    },
    button: {
      backgroundColor: "rgba(237,237,252,0.40)",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      height: 33
    },
    selectedButton: {
      backgroundColor: "#4C4DDC",
    },
    buttonText: {
      fontSize: 14,
      lineHeight: 16,
      color: "#939393",
      fontFamily: "Inter_24pt-Regular"
    },
    selectedButtonText: {
      color: "#FFFFFF",
        fontFamily: "Inter_18pt-Medium"
    },
});