import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextButton } from "./text-button";
import { useState } from "react";
import { Icon } from "./icon";

interface AboutMeProps {
    text: string;
}

export const AboutMe = ({ text }: AboutMeProps) => {
    const [expanded, setExpanded] = useState(false);
    
    const toggleExpanded = () => {
        setExpanded((prev) => !prev);
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sobre mim</Text>
            <Text
                style={styles.text}
                numberOfLines={expanded ? undefined : 2}
                ellipsizeMode="tail"
            >
                {text}
            </Text>
            {!expanded && (
                <TouchableOpacity onPress={toggleExpanded} style={styles.button}>
                    <Text style={styles.buttonText}>Ver descrição completa</Text>
                    <Icon name="ArrowDownIcon" size={16} color="#4C4DDC" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8
    },
    title: {
        fontFamily: "Inter_18pt-Medium",
        fontSize: 16,
        lineHeight: 18,
    },
    text: {
        fontSize: 12,
        lineHeight: 14,
        fontFamily: "Inter_18pt-Light",
        color: "#939393"
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    buttonText: {
        fontSize: 12,
        lineHeight: 14,
        fontFamily: "Inter_18pt-Light",
        color: "#4C4DDC"
    }
})