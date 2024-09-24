import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from '../../Dashboard/dashboard';
import ProfileScreen from '../../profileScreen/component/profile';
import SettingScreen from '../../settingScreen/component/setting';
import Listing from '../../listingScreen/component/listing';
import { } from "react-native-gesture-handler";
import * as styles from "../../../../assets/styles/styles";


const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={{ flexDirection: 'row', height: 65, backgroundColor: styles.backgroundColors.yellow, paddingTop: 7 }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;
                const isFocused = state.index === index;
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };
                const spaceStyle = index > 0 ? { marginLeft: 20 } : {};
                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', ...spaceStyle }}
                    >
                        {/* Customize your tab icons here */}
                        {route.name === 'Dashboard' && <Icon color={'white'} name="home" size={26} />}
                        {route.name === 'Listing' && <FontAwesome color={'white'} name="bookmark" size={26} />}
                        {route.name === 'Profile' && <Ionicons color={'white'} name="people-sharp" size={28} />}
                        {route.name === 'Setting' && <FontAwesome color={'white'} name="sliders" size={28} />}

                        {/* Customize your tab labels here */}
                        {/* {isFocused && <Text style={{ color: 'white' }}>{label}</Text>} */}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};


const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name='Dashboard' component={Dashboard} />
            <Tab.Screen name='Listing' component={Listing} />
            <Tab.Screen name='Profile' component={ProfileScreen} />
            <Tab.Screen name='Setting' component={SettingScreen} />
        </Tab.Navigator>
    );
};

export default AppNavigator;