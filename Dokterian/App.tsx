import * as React from 'react';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

function HomeScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Details')}>
        <Text>Go to Details</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
        <Ionicons name="accessibility" color="#ff0000" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const RootTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Schedule: ScheduleScreen,
    Messages: MessagesScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}







// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer, useLinkBuilder, useTheme } from '@react-navigation/native';
// import { PlatformPressable } from '@react-navigation/elements';

// const HomeScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Home</Text>
//   </View>
// );

// const ProfileScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Profile</Text>
//   </View>
// );

// function MyTabBar({ state, descriptors, navigation }: any) {
//   const { colors } = useTheme();
//   const { buildHref } = useLinkBuilder();

//   return (
//     <View style={{ flexDirection: 'row' }}>
//       {state.routes.map((route: any, index: any) => {
//         const { options } = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//               ? options.title
//               : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };

//         return (
//           <PlatformPressable
//             href={buildHref(route.name, route.params)}
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarButtonTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{ flex: 1 }}
//           >
//             <Text style={{ color: isFocused ? colors.primary : colors.text }}>
//               {label}
//             </Text>
//           </PlatformPressable>
//         );
//       })}
//     </View>
//   );
// }

// const MyTabs = createBottomTabNavigator({
//   tabBar: (props) => <MyTabBar {...props} />,
//   screens: {
//     Home: HomeScreen,
//     Profile: ProfileScreen,
//   },
// });

// function App(): React.JSX.Element {
//   return (
//     <NavigationContainer>
//       <MyTabs.Navigator>
//         <MyTabs.Screen name='Home' component={HomeScreen} />
//         <MyTabs.Screen name='Profile' component={ProfileScreen} />
//       </MyTabs.Navigator>
//     </NavigationContainer>
//     // <View>
//     //   <ScrollView>
//     //     <View>
//     //       <Header/>
//     //     </View>
//     //     <View>
//     //       <LearnMoreLinks />
//     //     </View>
//     //   </ScrollView>
//     // </View>
//   );
// }

// export default App;
