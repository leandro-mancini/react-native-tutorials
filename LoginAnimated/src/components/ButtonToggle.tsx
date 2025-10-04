import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { PressableProps } from "react-native-gesture-handler";

interface ButtonToggleProps extends PressableProps {
    onPress?: () => void;
}
export function ButtonToggle({ onPress }: ButtonToggleProps) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    return (
        <Pressable
            onPress={() => {
                setPasswordVisible((v) => !v);
                onPress?.();
            }}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
            hitSlop={8}
        >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </Pressable>
    );
}