import { Animated, StyleSheet, View } from "react-native";
import { AppBar } from "../components/appbar";
import { Category } from "../components/category";
import { useRef, useState } from "react";
import { Favorites } from "../components/favorites";
import { TopDoctors } from "../components/top-doctors";

const EXPANDED_HEIGHT = 180;
const COLLAPSED_HEIGHT = 92;

export const HomeScreen = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerHeight = scrollY.interpolate({
        inputRange: [0, EXPANDED_HEIGHT - COLLAPSED_HEIGHT],
        outputRange: [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
        extrapolate: "clamp",
    });

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

    const favorites = [
        { id: "1", title: "Card 1", description: "Descrição do Card 1" },
        { id: "2", title: "Card 2", description: "Descrição do Card 2" },
        { id: "3", title: "Card 2", description: "Descrição do Card 2" },
        { id: "4", title: "Card 2", description: "Descrição do Card 2" },
    ];

    const topDoctors = [
        { id: "1", avatarUrl: "https://img.freepik.com/fotos-gratis/confiante-olhando-para-a-camera-jovem-medico-vestindo-uniforme-de-medico-com-estetoscopio-isolado-na-parede-rosa-com-espaco-de-copia_141793-90966.jpg?t=st=1741985186~exp=1741988786~hmac=8aa5bfb68f77ddffd8f57132e398103db5f5447558565f9fd7e779f67210d938&w=1800", name: "Dr. Pedro Lima", specialty: "Cardiologista", review: "(120 avaliações)", rank: "4,8", clinic: "Vcare Clinic" },
        { id: "2", avatarUrl: "https://img.freepik.com/fotos-gratis/jovem-medico-barbudo-vestindo-jaleco-branco-com-estetoscopio-olhando-para-a-camera-confuso_141793-28210.jpg?t=st=1741985214~exp=1741988814~hmac=abaf2e35cad4b6dfb54e079fc9dc8ae57d51e879bf326776eb03aaa29e95cdea&w=1800", name: "Dr. André Santos", specialty: "Dermatologista", review: "(240 avaliações)", rank: "4,5", clinic: "Vcare Clinic" },
        { id: "3", avatarUrl: "https://img.freepik.com/fotos-gratis/medico-homem-barbudo-vestindo-jaleco-branco-com-estetoscopio-no-pescoco-usando-oculos-olhando-para-a-camera-sorrindo-confiante-em-pe-sobre-um-fundo-laranja_141793-110795.jpg?t=st=1741985259~exp=1741988859~hmac=2bbe8e0705922d8513db5386905dc1b05add0b34679959941696b9010f1893b1&w=2000", name: "Dr. Carlos Mendes", specialty: "Pediatra", review: "(98 avaliações)", rank: "4,4", clinic: "Vcare Clinic" },
    ];

    return (
        <View style={styles.container}>
          <Animated.ScrollView
            contentContainerStyle={{ paddingTop: EXPANDED_HEIGHT }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
          >
            <View style={styles.section}>
              <Category
                categories={categories}
                selected={"🔥 Todos"}
                onSelect={() => {}}
              />
              <Favorites items={favorites} />
              <TopDoctors items={topDoctors} />
            </View>
          </Animated.ScrollView>
    
          <Animated.View style={[styles.animatedHeader, { height: headerHeight }]}>
            <AppBar
              username="Leandro Mancini"
              avatarUrl="https://avatars.githubusercontent.com/u/8883746?v=4"
              onIconPress={() => {}}
              collapsedHeight={COLLAPSED_HEIGHT}
            />
          </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    animatedHeader: {
        position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
      },
    screen: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    section: {
        paddingVertical: 24,
        gap: 24,
    }
})