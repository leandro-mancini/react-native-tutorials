import { ScrollView, StyleSheet, View } from "react-native";
import Ripple from 'react-native-material-ripple';
import { Card } from "../components/card";
import { SearchButton } from "../components/search-button";
import { CategoryCarousel } from "../components/category-carousel";
import { HeaderUser } from "../components/header-user";
import { NearDoctor } from "../components/near-doctor";

export const HomeScreen = () => {
  const categories = [
    { id: "1", name: "Cardiologia", icon: "fitness" },
    { id: "2", name: "Dermatologia", icon: "body" },
    { id: "3", name: "Pediatria", icon: "people-sharp" },
    { id: "4", name: "Ortopedia", icon: "bandage" },
    { id: "5", name: "Neurologia", icon: "medical" },
    { id: "6", name: "Otorrino", icon: "ear" },
  ];

  const doctors = [
    { id: "1", avatarUrl: "https://img.freepik.com/fotos-gratis/confiante-olhando-para-a-camera-jovem-medico-vestindo-uniforme-de-medico-com-estetoscopio-isolado-na-parede-rosa-com-espaco-de-copia_141793-90966.jpg?t=st=1741985186~exp=1741988786~hmac=8aa5bfb68f77ddffd8f57132e398103db5f5447558565f9fd7e779f67210d938&w=1800", name: "Dr. Pedro Lima", specialty: "Cardiologista", review: "4,8 (120 Reviews)", time: "Aberto às 10h00", kms: "1.2 km" },
    { id: "2", avatarUrl: "https://img.freepik.com/fotos-gratis/jovem-medico-barbudo-vestindo-jaleco-branco-com-estetoscopio-olhando-para-a-camera-confuso_141793-28210.jpg?t=st=1741985214~exp=1741988814~hmac=abaf2e35cad4b6dfb54e079fc9dc8ae57d51e879bf326776eb03aaa29e95cdea&w=1800", name: "Dr. André Santos", specialty: "Dermatologista", review: "4,5 (240 Reviews)", time: "Aberto às 14h00", kms: "1.2 km" },
    { id: "3", avatarUrl: "https://img.freepik.com/fotos-gratis/medico-homem-barbudo-vestindo-jaleco-branco-com-estetoscopio-no-pescoco-usando-oculos-olhando-para-a-camera-sorrindo-confiante-em-pe-sobre-um-fundo-laranja_141793-110795.jpg?t=st=1741985259~exp=1741988859~hmac=2bbe8e0705922d8513db5386905dc1b05add0b34679959941696b9010f1893b1&w=2000", name: "Dr. Carlos Mendes", specialty: "Pediatra", review: "4,4 (98 Reviews)", time: "Aberto às 09h30", kms: "1.2 km" },
  ];

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <HeaderUser name="Leandro" avatarUrl="https://avatars.githubusercontent.com/u/8883746?v=4" />
        <View style={styles.section}>
          <Ripple rippleContainerBorderRadius={16}>
            <Card
              avatarUrl="https://img.freepik.com/fotos-gratis/jovem-medico-bonito-usando-jaleco-branco-luvas-medicas-e-estetoscopio-olhando-pensativo-em-pe-sobre-a-parede-laranja_141793-30631.jpg?t=st=1741981903~exp=1741985503~hmac=c21402cd15854e88001a2d7916b7fb648aa2aa426f12123a5f99b2f7a7c51fde&w=1800"
              name="Dr. João Souza"
              specialty="Ortopedista"
              date="15 de Março"
              time="16:30"
            />
          </Ripple>
          <SearchButton placeholder="Procure um médico ou problema de saúde" />
          <CategoryCarousel categories={categories} onSelect={(category) => console.log(`Selecionado: ${category}`)} />
        </View>
        <NearDoctor doctors={doctors} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(99,180,255,0.10)",
  },
  container: {
    flexDirection: "column",
    gap: 32,
    paddingHorizontal: 24,
    paddingVertical: 24
  },
  section: {
    flexDirection: "column",
    gap: 20
  },
});