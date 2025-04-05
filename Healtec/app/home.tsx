import { Animated, StyleSheet, View } from "react-native";
import { AppBar } from "../components/appbar";
import { Category } from "../components/category";
import { useRef, useState } from "react";
import { Favorites } from "../components/favorites";
import { TopDoctors } from "../components/top-doctors";

const EXPANDED_HEIGHT = 180;
const COLLAPSED_HEIGHT = 92;

const favorites = [
  {
    id: "1",
    name: "Dr. Pedro Lima",
    specialty: "Cardiologista",
    rank: "4.8",
    image: "https://img.freepik.com/fotos-gratis/medico-sorridente-com-estretoscopio-isolado-em-cinza_651396-974.jpg?t=st=1743869584~exp=1743873184~hmac=0069f8ed3421cc64eea081bec3156d848f23f8605e56b46e41e97281787898ac&w=1800",
  },
  {
    id: "2",
    name: "Dra. Ana Beatriz",
    specialty: "Dermatologista",
    rank: "4.9",
    image: "https://img.freepik.com/fotos-gratis/mulher-medica-vestindo-jaleco-com-estetoscopio-isolado_1303-29791.jpg?t=st=1743870548~exp=1743874148~hmac=a1b4b1366d07d1f517c08878029b55ac7074c07fe146a9a447b8c1ec284a50e0&w=2000",
  },
  {
    id: "3",
    name: "Dr. Carlos Mendes",
    specialty: "Pediatra",
    rank: "4.7",
    image: "https://img.freepik.com/fotos-gratis/trabalhadores-de-saude-medicina-covid-19-e-conceito-de-auto-quarentena-pandemica-enfermeira-hispanica-sorridente-alegre-medico-do-pronto-socorro-usando-uniforme-e-oculos-conversando-com-o-paciente-na-clinica_1258-58757.jpg?t=st=1743870586~exp=1743874186~hmac=ef5cee4a1dc01186c07d395b2cfade183960519dacd3419885733849e7bf45e0&w=2000",
  },
  {
    id: "4",
    name: "Dra. Juliana Torres",
    specialty: "Neurologista",
    rank: "4.6",
    image: "https://img.freepik.com/fotos-gratis/trabalhadores-de-saude-prevenindo-o-conceito-de-campanha-de-quarentena-de-virus-medico-asiatico-alegre-e-amigavel-com-prancheta-durante-o-check-up-diario-em-pe-fundo-branco_1258-107867.jpg?t=st=1743870620~exp=1743874220~hmac=039b7fc868fe4726868fdb365ff183d58ddf38403907b83c2d2f2095bd2e76d5&w=2000",
  },
  {
    id: "5",
    name: "Dr. Rafael Souza",
    specialty: "Ortopedista",
    rank: "4.5",
    image: "https://img.freepik.com/fotos-gratis/retrato-do-doutor-adulto-meados-de-bem-sucedido-com-bracos-cruzados_1262-12865.jpg?t=st=1743870638~exp=1743874238~hmac=4fb6eaaa113329dfc63966e88d593144beb325c60357d775137fbeaa8fcd6976&w=2000",
  },
];

const topDoctors = [
  {
    id: "1",
    name: "Dr. Henrique Castro",
    clinic: "Vitta Saúde",
    specialty: "Oftalmologista",
    review: "(85 avaliações)",
    rank: "4.7",
    image: "https://img.freepik.com/fotos-premium/jovem-medico-masculino-em-estetoscopio-uniforme-sorridente-na-camera_1187-7603.jpg?w=2000",
  },
  {
    id: "2",
    name: "Dra. Mariana Ribeiro",
    clinic: "Clin Vida",
    specialty: "Ginecologista",
    review: "(132 avaliações)",
    rank: "4.9",
    image: "https://img.freepik.com/fotos-premium/retrato-de-medico-sorridente-no-hospital_1048944-32456617.jpg?w=2000",
  },
  {
    id: "3",
    name: "Dr. Felipe Nunes",
    clinic: "Centro Med+",
    specialty: "Urologista",
    review: "(98 avaliações)",
    rank: "4.6",
    image: "https://img.freepik.com/fotos-gratis/jovem-medico-de-tiro-medio-sorridente_23-2149870590.jpg?w=2000",
  },
];

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