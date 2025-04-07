import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "../components/icon";
import { IconButton } from "../components/icon-button";
import { CardDetail } from "../components/card-detail";
import { Experience } from "../components/experience";
import { AboutMe } from "../components/about-me";
import { Button } from "../components/button";

type Doctor = {
    name: string;
    specialty: string;
    rating: string;
    image: string;
    patients: string;
    yearsExp: string;
    reviews: string;
    aboutMe: string;
    isFavorite: boolean;
};
  
type DetailRouteParams = {
    Detail: {
      doctor: Doctor;
    };
};

export const DetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<DetailRouteParams, "Detail">>();
    const { doctor } = route.params;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.appBar}>
                <IconButton onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="ArrowLeftIcon" size={24} color="#101010" />
                </IconButton>
                <Text style={styles.title}>Médico</Text>
            </View>

            <View style={styles.content}>
                <CardDetail
                    name={doctor.name}
                    image={doctor.image}
                    specialty={doctor.specialty}
                    isFavorite={doctor.isFavorite}
                />
                <Experience
                    patients={doctor.patients}
                    rating={doctor.rating}
                    reviews={doctor.reviews}
                    yearsExp={doctor.yearsExp}
                />
                <AboutMe text={doctor.aboutMe} />
                <Button label="Chamada de voz" onPress={() => navigation.navigate("VoiceCall", { doctor })}>
                  <Icon name="CallIcon" color="#fff" />
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 24
  },
  appBar: {
    marginTop: 24,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  title: {
    fontFamily: "Inter_18pt-SemiBold",
    fontSize: 16,
    lineHeight: 18,
    color: "#101010",
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 24
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});