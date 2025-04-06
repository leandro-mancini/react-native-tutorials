import { Animated, StyleSheet, View } from "react-native";
import { AppBar } from "../components/appbar";
import { Category } from "../components/category";
import { useRef } from "react";
import { Favorites } from "../components/favorites";
import { TopDoctors } from "../components/top-doctors";

const EXPANDED_HEIGHT = 180;
const COLLAPSED_HEIGHT = 92;

const favorites = [
  {
    id: "1",
    name: "Dr. Pedro Lima",
    specialty: "Cardiologista",
    rating: "4.8",
    patients: "1.2k",
    yearsExp: "10",
    reviews: "120",
    aboutMe: "Sou um cardiologista apaixonado por ajudar meus pacientes a manterem um coração saudável. Com mais de 10 anos de experiência, acredito que a escuta atenta e o cuidado contínuo são fundamentais para um tratamento eficaz.",
    image: "https://img.freepik.com/fotos-gratis/medico-sorridente-com-estretoscopio-isolado-em-cinza_651396-974.jpg?t=st=1743869584~exp=1743873184~hmac=0069f8ed3421cc64eea081bec3156d848f23f8605e56b46e41e97281787898ac&w=1800",
  },
  {
    id: "2",
    name: "Dra. Ana Beatriz",
    specialty: "Dermatologista",
    rating: "4.9",
    patients: "980",
    yearsExp: "8",
    reviews: "97",
    aboutMe: "Sou especialista em dermatologia clínica e estética. Tenho como objetivo promover a saúde da pele e elevar a autoestima dos meus pacientes através de tratamentos modernos e humanizados.",
    image: "https://img.freepik.com/fotos-gratis/mulher-medica-vestindo-jaleco-com-estetoscopio-isolado_1303-29791.jpg?t=st=1743870548~exp=1743874148~hmac=a1b4b1366d07d1f517c08878029b55ac7074c07fe146a9a447b8c1ec284a50e0&w=2000",
  },
  {
    id: "3",
    name: "Dr. Carlos Mendes",
    specialty: "Pediatra",
    rating: "4.7",
    patients: "1.4k",
    yearsExp: "12",
    reviews: "143",
    aboutMe: "Como pediatra há mais de 12 anos, minha missão é garantir o bem-estar e desenvolvimento saudável das crianças, sempre com atenção, paciência e um sorriso acolhedor para os pequenos e seus familiares.",
    image: "https://img.freepik.com/fotos-gratis/trabalhadores-de-saude-medicina-covid-19-e-conceito-de-auto-quarentena-pandemica-enfermeira-hispanica-sorridente-alegre-medico-do-pronto-socorro-usando-uniforme-e-oculos-conversando-com-o-paciente-na-clinica_1258-58757.jpg?t=st=1743870586~exp=1743874186~hmac=ef5cee4a1dc01186c07d395b2cfade183960519dacd3419885733849e7bf45e0&w=2000",
  },
  {
    id: "4",
    name: "Dra. Juliana Torres",
    specialty: "Neurologista",
    rating: "4.6",
    patients: "860",
    yearsExp: "9",
    reviews: "110",
    aboutMe: "Trabalho com foco na prevenção e tratamento de doenças neurológicas. Acredito na combinação entre conhecimento técnico, escuta ativa e empatia como base para um atendimento de excelência.",
    image: "https://img.freepik.com/fotos-gratis/trabalhadores-de-saude-prevenindo-o-conceito-de-campanha-de-quarentena-de-virus-medico-asiatico-alegre-e-amigavel-com-prancheta-durante-o-check-up-diario-em-pe-fundo-branco_1258-107867.jpg?t=st=1743870620~exp=1743874220~hmac=039b7fc868fe4726868fdb365ff183d58ddf38403907b83c2d2f2095bd2e76d5&w=2000",
  },
  {
    id: "5",
    name: "Dr. Rafael Souza",
    specialty: "Ortopedista",
    rating: "4.5",
    patients: "1.1k",
    yearsExp: "11",
    reviews: "85",
    aboutMe: "Sou ortopedista com experiência em lesões esportivas e reabilitação funcional. Meu compromisso é oferecer tratamentos que devolvam mobilidade, conforto e qualidade de vida aos meus pacientes.",
    image: "https://img.freepik.com/fotos-gratis/retrato-do-doutor-adulto-meados-de-bem-sucedido-com-bracos-cruzados_1262-12865.jpg?t=st=1743870638~exp=1743874238~hmac=4fb6eaaa113329dfc63966e88d593144beb325c60357d775137fbeaa8fcd6976&w=2000",
  },
];

const topDoctors = [
  {
    id: "1",
    name: "Dra. Mariana Ribeiro",
    clinic: "Clin Vida",
    specialty: "Ginecologista",
    reviews: "132",
    patients: "980",
    yearsExp: "8",
    rating: "4.9",
    aboutMe: "Sou ginecologista especializada em saúde da mulher. Acompanho minhas pacientes com cuidado e escuta ativa, oferecendo um atendimento acolhedor e baseado em evidências para cada fase da vida feminina.",
    image: "https://img.freepik.com/fotos-gratis/jovem-medica-satisfeita-usando-tunica-medica-e-estetoscopio-ao-redor-do-pescoco-em-pe-com-postura-fechada_409827-254.jpg?t=st=1743888335~exp=1743891935~hmac=205a0e91b7e80d514e487b86a31517ee808aa3ed7a850ac265c5ba35989940be&w=2000",
  },
  {
    id: "2",
    name: "Dr. Henrique Castro",
    clinic: "Vitta Saúde",
    specialty: "Oftalmologista",
    reviews: "85",
    patients: "1.2k",
    yearsExp: "10",
    rating: "4.7",
    aboutMe: "Tenho mais de 10 anos de experiência em oftalmologia, atuando com foco na prevenção e tratamento de doenças oculares. A visão é um dos sentidos mais preciosos, e meu papel é cuidar dela com dedicação e precisão.",
    image: "https://img.freepik.com/fotos-gratis/medico-jovem-vestindo-jaleco-branco-e-estetoscopio-olhando-confiante-com-bracos-cruzados_141793-12596.jpg?t=st=1743888391~exp=1743891991~hmac=5c3cbb3cdb41c36066fc5e056df44ce6ab2c34ff910f61d4c1f29571d26d72bd&w=2000",
  },
  {
    id: "3",
    name: "Dr. Felipe Nunes",
    clinic: "Centro Med+",
    specialty: "Urologista",
    reviews: "98",
    patients: "890",
    yearsExp: "7",
    rating: "4.6",
    aboutMe: "Sou urologista e busco proporcionar um atendimento humano e ético, focado no bem-estar dos meus pacientes. A saúde urinária e reprodutiva é essencial e merece atenção especializada.",
    image: "https://img.freepik.com/fotos-gratis/estudante-de-medicina-internacional-homem-de-uniforme-azul-medico-com-estetoscopio_1157-44779.jpg?t=st=1743904317~exp=1743907917~hmac=eb436a8e9abb481c5e737d7f768dc5c379d733619821b3ad5152f30298f4ade0&w=2000",
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