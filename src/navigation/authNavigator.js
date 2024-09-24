import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../features/login/login';
import Home from '../features/homeScreen/component/home';
import Listing from '../features/listingScreen/component/listing';
import DetailsScreen from '../features/listingScreen/component/detailsScreen';
import Profile from '../features/profileScreen/component/profile';
import Setting from '../features/settingScreen/component/setting';
import ChangeAddress from '../features/settingScreen/component/changeAddress';
import Claim from '../features/modal/claim';
import Consult from '../features/modal/consult';
import Order from '../features/modal/order';
import Appointment from '../features/modal/appointment';
import ChangePassword from '../features/settingScreen/component/changePassword';
import Dashboard from '../features/Dashboard/dashboard';
import MapWithIcon from '../features/mapScreen';
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}}/>
      <Stack.Screen name="Listing" component={Listing} options={{headerShown: false}}/>
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
      <Stack.Screen name="Setting" component={Setting} options={{headerShown: false}}/>
      <Stack.Screen name="ChangeAddress" component={ChangeAddress}options={{headerShown: false}} />
      <Stack.Screen name="Claim" component={Claim} options={{headerShown: false}}/>
      <Stack.Screen name="Consult" component={Consult} options={{headerShown: false}}/>
      <Stack.Screen name="Order" component={Order} options={{headerShown: false}}/>
      <Stack.Screen name="Appointment" component={Appointment} options={{headerShown: false}}/>
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{headerShown: false}}/>
      <Stack.Screen name="Map" component={MapWithIcon} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
};
export default AuthNavigator;