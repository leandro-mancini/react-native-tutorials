import { StyleSheet, Text, View } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';
import { Avatar } from "./avatar";
import { Divider } from "./divider";
import Ripple from "react-native-material-ripple";

interface CardScheduleProps {
    avatarUrl: string;
    name: string;
    specialty: string;
    available_date: string;
    available_time: string;
}

export const CardSchedule = ({ name, specialty, avatarUrl, available_date, available_time }: CardScheduleProps) => {
    return (
        <View style={styles.card}>
          <View style={styles.infoDoctor}>
            <Avatar source={avatarUrl} size={48} backgroundColor="white" />
            <View style={styles.doctor}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.specialty}>{specialty}</Text>
            </View>
          </View>
          <Divider color="#F5F5F5" />
          <View style={styles.infoContainer}>
            <View style={styles.infoDateTime}>
              <Ionicons name="calendar-outline" size={16} color="#8696BB" />
              <Text style={styles.dateTime}>{available_date}</Text>
            </View>
            <View style={styles.infoDateTime}>
              <Ionicons name="time-outline" size={16} color="#8696BB" />
              <Text style={styles.dateTime}>{available_time}</Text>
            </View>
          </View>
          <Ripple style={styles.button} rippleContainerBorderRadius={40}>
            <Text style={styles.buttonText}>Detalhes</Text>
          </Ripple>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
      backgroundColor: "white",
      borderRadius: 16,
      padding: 20,
      boxShadow: "2 12 20 0 rgba(90, 117, 167, 0.06)",
      gap: 16
    },
    infoDoctor: {
      flexDirection: "row",
      alignItems: "center"
    },
    doctor: {
      flex: 1,
      marginLeft: 12,
      gap: 8
    },
    infoContainer: {
      flexDirection: "row",
      gap: 12
    },
    infoDateTime: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center"
    },
    infoKms: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    },
    kms: {
      color: "#8696BB",
      fontSize: 12,
      lineHeight: 14,
      fontFamily: "Poppins-Regular"
    },
    name: {
      color: "#0D1B34",
      fontFamily: "Poppins-Bold",
      fontSize: 16,
      lineHeight: 16
    },
    specialty: {
      color: "#8696BB",
      fontSize: 14,
      lineHeight: 18,
      fontFamily: "Poppins-Regular"
    },
    dateTime: {
      color: "#8696BB",
      fontSize: 12,
      lineHeight: 12,
      fontFamily: "Poppins-Regular"
    },
    button: {
        backgroundColor: "rgba(99,180,255,0.10)",
        borderRadius: 40,
        height: 40,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "#4894FE",
        fontSize: 14,
        lineHeight: 16,
        fontFamily: "Poppins-Medium"
    }
  });