import { Text, View } from "react-native";
import { AppBar } from "../components/appbar";

export const HomeScreen = () => {
    return (
        <View>
            <AppBar 
                username="Leandro Mancini"
                avatarUrl="https://avatars.githubusercontent.com/u/8883746?v=4"
                onIconPress={() => console.log("Notificações pressionadas!")}
            />
            <Text>Home</Text>
        </View>
    );
}