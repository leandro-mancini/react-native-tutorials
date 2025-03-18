import React, { useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Ripple from "react-native-material-ripple";
import PagerView from "react-native-pager-view";
import { BulletIndicator } from "../components/bullet-indicator";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const pages = [
    { id: "1", text: "Converse com o médico de forma mais confortável", description: "Agende uma consulta com o médico. Converse com o médico por meio da carta de agendamento e obtenha uma consulta." },
    { id: "2", text: "Consultas online \nfáceis e rápidas ", description: "Agende sua consulta médica de forma rápida e fácil, sem precisar enfrentar longas filas." },
    { id: "3", text: "Receba recomendações personalizadas de saúde", description: "Obtenha dicas de saúde e orientações personalizadas de especialistas para melhorar seu bem-estar." },
];

const Slider = ({ navigation }: any) => {
    const pagerRef = useRef<PagerView>(null);
    const currentIndex = useRef(new Animated.Value(0)).current;
    const [contentHeight, setContentHeight] = useState(200);

    const handlePress = () => {
        navigation.replace("Main");
    }

    return (
        <View style={styles.slider}>
            <PagerView
                ref={pagerRef}
                style={[styles.pagerView, { height: contentHeight }]}
                initialPage={0}
                onPageSelected={(e) => {
                    Animated.timing(currentIndex, {
                        toValue: e.nativeEvent.position,
                        duration: 300,
                        useNativeDriver: false,
                    }).start();
                }}
            >
                {pages.map((page, index) => (
                <View key={index} style={styles.page}>
                    <Text style={styles.title}>{page.text}</Text>
                    <Text style={styles.description}>{page.description}</Text>
                </View>
                ))}
            </PagerView>
            <View style={styles.action}>
                <View>
                    <BulletIndicator total={3} currentIndex={currentIndex} />
                </View>
                <Ripple style={styles.button} rippleContainerBorderRadius={14} onPress={handlePress}>
                    <Text style={styles.buttonText}>Começar</Text>
                </Ripple>
            </View>
        </View>
    );
}

export const OnboardingScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <LottieView 
                source={require("../assets/animations/background2.json")}
                autoPlay
                loop
                resizeMode="cover"
                style={styles.backgroundAnimation}
            />
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require("../assets/images/image_onboarding.png")} />
            </View>
            <Slider navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#4C4DDC",
        justifyContent: "flex-end"
    },
    backgroundAnimation: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    imageContainer: {
        width: width,
        height: width * 0.9,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: width * 0.9,
        resizeMode: "contain",
    },
    slider: {
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        lineHeight: 28,
        fontFamily: "Inter_18pt-SemiBold",
        color: "#101010",
        marginBottom: 8
    },
    description: {
        textAlign: "center",
        fontSize: 14,
        lineHeight: 18,
        fontFamily: "Inter_18pt-Light",
        color: "#939393"
    },
    button: {
        backgroundColor: "#4C4DDC",
        width: "100%",
        paddingVertical: 16,
        borderRadius: 14
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontFamily: "Inter_18pt-SemiBold",
        fontSize: 16,
        lineHeight: 16
    },

    pagerViewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    pagerView: {
        width,
    },
    page: {
        justifyContent: "center",
        alignItems: "center",
        width,
        paddingHorizontal: 24,
    },
    action: {
        paddingHorizontal: 24,
        paddingBottom: 16,
    }
});