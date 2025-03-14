import { StyleSheet, Text, View } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';
import { Avatar } from "./avatar";
import { Divider } from "./divider";

interface CardLocationProps {
    avatarUrl: string;
    name: string;
    specialty: string;
    review: string;
    time: string;
    kms: string;
}

export const CardLocation = ({ avatarUrl, name, specialty, review, time, kms }: CardLocationProps) => {
  return (
      <View style={styles.card}>
        <View style={styles.infoDoctor}>
          <Avatar source={avatarUrl} size={48} backgroundColor="white" />
          <View style={styles.doctor}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.specialty}>{specialty}</Text>
          </View>
          <View style={styles.infoKms}>
            <Ionicons name="location-outline" size={16} color="#8696BB" />
            <Text style={styles.kms}>{kms}</Text>
          </View>
        </View>
        <Divider color="#F5F5F5" marginVertical={16} />
        <View style={styles.infoContainer}>
          <View style={styles.infoDateTime}>
            <Ionicons name="star-half-outline" size={16} color="#FEB052" />
            <Text style={styles.dateTime}>{review}</Text>
          </View>
          <View style={styles.infoDateTime}>
            <Ionicons name="time-outline" size={16} color="#FEB052" />
            <Text style={styles.dateTime}>{time}</Text>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    boxShadow: "2 12 20 0 rgba(90, 117, 167, 0.06)"
    // shadowColor: "black",
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // elevation: 2,
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
    fontSize: 14,
    lineHeight: 14
  },
  name: {
    color: "#0D1B34",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 16
  },
  specialty: {
    color: "#8696BB",
    fontSize: 14,
    lineHeight: 14
  },
  dateTime: {
    color: "#FEB052",
    fontSize: 12,
    lineHeight: 12
  },
});