import React from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons'

const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return 'home-outline';
      case 'Schedule':
        return 'calendar-outline';
      case 'Messages':
        return 'chatbubble-outline';
      case 'Profile':
        return 'person-outline';
      default:
        return 'circle-outline';
    }
};

export const CustomNavBar = ({ accessibilityState, onPress, route }: any) => {
    const isSelected = accessibilityState.selected;
    const animation = React.useRef(new Animated.Value(0)).current;
  
    React.useEffect(() => {
      Animated.timing(animation, {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isSelected]);
  
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 16,
          backgroundColor: isSelected ? 'rgba(99, 180, 255, 0.10)' : 'transparent',
          borderRadius: 8,
          height: 48,
          paddingHorizontal: 12,
        }}
      >
        <Animated.View
          style={{
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0],
                }),
              },
            ],
          }}
        >
          <Ionicons name={getIconName(route.name)} size={24} color={isSelected ? '#63B4FF' : '#8696BB'} />
        </Animated.View>
  
        <Animated.View
          style={{
            opacity: animation,
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
            ],
          }}
        >
          {isSelected && <Text style={{ color: '#63B4FF', fontWeight: 'bold', fontSize: 14 }}>{route.name}</Text>}
        </Animated.View>
      </TouchableOpacity>
    );
}