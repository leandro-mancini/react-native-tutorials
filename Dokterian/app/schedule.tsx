import { Animated, FlatList, StyleSheet, View } from "react-native";
import { CardSchedule } from "../components/card-schedule";
import { useRef } from "react";
import { CategorySchedule } from "../components/category-schedule";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const ScheduleScreen = () => {
  const categories = [
    { id: "1", name: "Cronograma cancelado" },
    { id: "2", name: "Cronograma futuro" },
    { id: "3", name: "Cronograma concluído" },
  ];

  const doctors = [
    { id: "1", name: "Dr. João Souza", specialty: "Cardiologista", available_date: "20 de Março", available_time: "10:00", avatarUrl: "https://img.freepik.com/fotos-gratis/confiante-olhando-para-a-camera-jovem-medico-vestindo-uniforme-de-medico-com-estetoscopio-isolado-na-parede-rosa-com-espaco-de-copia_141793-90966.jpg?t=st=1741985186~exp=1741988786~hmac=8aa5bfb68f77ddffd8f57132e398103db5f5447558565f9fd7e779f67210d938&w=1800" },
    { id: "2", name: "Dra. Ana Lima", specialty: "Dermatologista", available_date: "22 de Março", available_time: "14:30", avatarUrl: "https://img.freepik.com/fotos-gratis/medica-no-hospital-com-estetoscopio_23-2148827774.jpg?t=st=1742011460~exp=1742015060~hmac=1d2b373da5bf024fb98d037a0023c664aa67aa0640ebd68037d3110ace5f8385&w=1380" },
    { id: "3", name: "Dr. Pedro Mendes", specialty: "Ortopedista", available_date: "25 de Março", available_time: "09:00", avatarUrl: "https://img.freepik.com/fotos-gratis/medico-homem-barbudo-vestindo-jaleco-branco-com-estetoscopio-no-pescoco-usando-oculos-olhando-para-a-camera-sorrindo-confiante-em-pe-sobre-um-fundo-laranja_141793-110795.jpg?t=st=1741985259~exp=1741988859~hmac=2bbe8e0705922d8513db5386905dc1b05add0b34679959941696b9010f1893b1&w=2000" },
    { id: "4", name: "Dra. Beatriz Castro", specialty: "Pediatra", available_date: "27 de Março", available_time: "15:00", avatarUrl: "https://img.freepik.com/fotos-gratis/medico-jovem-de-jaleco-branco-com-estetoscopio-em-pe-com-um-grande-sorriso-olhando-para-a-camera-sobre-fundo-azul-isolado_141793-9841.jpg?t=st=1742011498~exp=1742015098~hmac=0638bf04b47dc2182726d2ae022b8055efd67def6b4027cde4d719e0ef83314d&w=2000" },
    { id: "5", name: "Dr. Ricardo Silva", specialty: "Neurologista", available_date: "30 de Março", available_time: "11:00", avatarUrl: "https://img.freepik.com/fotos-gratis/medico-alegre-em-um-retrato-de-vestido-branco_53876-105121.jpg?t=st=1741995564~exp=1741999164~hmac=ec0df99c0ca0c32bb9eebf6a37cae3124d5c4d1644046a5a4024b2becd0251b1&w=2000" },
    { id: "6", name: "Dra. Marina Santos", specialty: "Ginecologista", available_date: "2 de Abril", available_time: "16:30", avatarUrl: "https://img.freepik.com/fotos-gratis/jovem-medica-satisfeita-usando-manto-medico-com-estetoscopio-isolado-na-parede-rosa_141793-106254.jpg?t=st=1742011532~exp=1742015132~hmac=beaf1494ba0eed645b14180ec4f2ecd3949a2fc1795c656d3ab5f49a3e4375d4&w=1800" },
    { id: "7", name: "Dr. Eduardo Almeida", specialty: "Oftalmologista", available_date: "5 de Abril", available_time: "08:45", avatarUrl: "https://img.freepik.com/fotos-gratis/retrato-de-um-medico-homem-confiante_171337-1490.jpg?t=st=1741995611~exp=1741999211~hmac=a47f25760e347706e154bebe1fe69c18492cd5bcd7a8a084b74c40f4ed85bd56&w=2000" },
    { id: "8", name: "Dra. Gabriela Rocha", specialty: "Endocrinologista", available_date: "7 de Abril", available_time: "13:15", avatarUrl: "https://img.freepik.com/fotos-gratis/jovem-medica-confiante-com-roupao-medico-e-estetoscopio-olhando-para-a-camera-em-um-fundo-laranja-isolado-com-espaco-de-copia_141793-34390.jpg?t=st=1742011584~exp=1742015184~hmac=d8fd097f30f290bef51b863f9333e210d5e66506ba6bd88011a707485cac1e71&w=1800" },
    { id: "9", name: "Dr. Felipe Martins", specialty: "Urologista", available_date: "10 de Abril", available_time: "17:00", avatarUrl: "https://img.freepik.com/fotos-gratis/dia-dos-medicos-bonitao-moreno-bonito-em-vestido-medico-com-as-maos-no-bolso_140725-162944.jpg?t=st=1742011734~exp=1742015334~hmac=d13e405d787111876790e9ea548c87f6f1a97ddd2be5fd6c9dfda0222d4bcf61&w=2000" },
    { id: "10", name: "Dra. Carolina Oliveira", specialty: "Psiquiatra", available_date: "12 de Abril", available_time: "12:30", avatarUrl: "https://img.freepik.com/fotos-gratis/linda-mulher-oculista-caucasiana-vestindo-roupao-e-oculos-de-optometria-com-expressao-seria-no-rosto-olhar-simples-e-natural-para-a-camera_839833-6929.jpg?t=st=1742011613~exp=1742015213~hmac=4b201fb15d7709734077f03c2cd626698bc9f1a35f903a9066132d8518185009&w=2000" },
  ];

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
        <CategorySchedule categories={categories} onSelect={(category) => console.log(`Selecionado: ${category}`)} />
      </Animated.View>
      <AnimatedFlatList
        style={styles.doctorsList}
        data={doctors}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <View style={styles.container}>
            <CardSchedule
                key={item.id}
                avatarUrl={item.avatarUrl}
                name={item.name}
                specialty={item.specialty}
                available_date={item.available_date}
                available_time={item.available_time}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{ paddingTop: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(99,180,255,0.10)",
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 8
  },
  header: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 10,
    zIndex: 10,
    paddingTop: 20
  },
  section: {
    flexDirection: "column",
    gap: 20
  },
});