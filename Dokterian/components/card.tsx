import { StyleSheet, Text, View } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';
import { Avatar } from "./avatar";
import { Divider } from "./divider";

interface CardProps {
    avatarUrl: string;
    name: string;
    specialty: string;
    date: string;
    time: string;
}

export const Card = ({ avatarUrl, name, specialty, date, time }: CardProps) => {
    return (
        <View style={styles.card}>
          <View style={styles.infoDoctor}>
            <Avatar source={avatarUrl} size={48} backgroundColor="white" />
            <View style={styles.doctor}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.specialty}>{specialty}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </View>
          <Divider color="rgba(255,255,255,0.15)" marginVertical={16} />
          <View style={styles.infoContainer}>
            <View style={styles.infoDateTime}>
              <Ionicons name="calendar-outline" size={16} color="white" />
              <Text style={styles.dateTime}>{date}</Text>
            </View>
            <View style={styles.infoDateTime}>
              <Ionicons name="time-outline" size={16} color="white" />
              <Text style={styles.dateTime}>{time}</Text>
            </View>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
      backgroundColor: "#4894FE",
      borderRadius: 16,
      padding: 20
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
    name: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      lineHeight: 16
    },
    specialty: {
      color: "#CBE1FF",
      fontSize: 14,
      lineHeight: 14
    },
    dateTime: {
      color: "white",
      fontSize: 12,
      lineHeight: 12
    },
});