// import React, { useEffect, useLayoutEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Home from '../features/homeScreen/component/home';
// import Listing from '../features/listingScreen/component/listing';
// import DetailsScreen from '../features/listingScreen/component/detailsScreen';
// import Profile from '../features/profileScreen/component/profile';
// import Setting from '../features/settingScreen/component/setting';
// import ChangeAddress from '../features/settingScreen/component/changeAddress';
// import Claim from '../features/modal/claim';
// import Consult from '../features/modal/consult';
// import Order from '../features/modal/order';
// import Appointment from '../features/modal/appointment';
// import ChangePassword from '../features/settingScreen/component/changePassword';

// const Stack = createNativeStackNavigator();

// const AppNavigator = ({ }) => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={Home} />
//       <Stack.Screen name="Listing" component={Listing} />
//       <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
//       <Stack.Screen name="Profile" component={Profile} />
//       <Stack.Screen name="Setting" component={Setting} />
//       <Stack.Screen name="ChangeAddress" component={ChangeAddress} />
//       <Stack.Screen name="Claim" component={Claim} />
//       <Stack.Screen name="Consult" component={Consult} />
//       <Stack.Screen name="Order" component={Order} />
//       <Stack.Screen name="Appointment" component={Appointment} />
//       <Stack.Screen name="ChangePassword" component={ChangePassword} />
//     </Stack.Navigator>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingVertical: 40,
//     paddingRight: 10,
//     flex: 1,
//   },
//   drawerBackground: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   closeDrawerButton: {
//     padding: 16,
//     backgroundColor: 'transparent',
//   },
//   userContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     marginBottom: 40,
//   },
//   userImageContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'lightgray',
//     borderWidth: 2,
//     borderColor: 'white',
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   userProfileImageContainer: {
//     width: 35,
//     height: 35,
//     borderRadius: 30,
//     backgroundColor: 'lightgray',
//     borderWidth: 2,
//     borderColor: 'white',
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10
//   },
//   userImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   userDetailsContainer: {
//     paddingLeft: 10,
//     width: '80%',
//     // width:200,
//   },
//   userName: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   userNumber: {
//     color: 'white',
//     fontSize: 16,
//     // width:'60%'
//   },
//   logoutButton: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderColor: 'white',
//     backgroundColor: 'white',
//     borderBottomRightRadius: 30,
//     borderTopRightRadius: 30,
//     marginTop: 10,
//     width: '80%',
//     marginBottom: 10,
//     // justifyContent: "center",
//     gap: 5,
//     alignItems: 'center',
//     flexDirection: 'row'
//   },
//   logoutButtonText: {
//     color: '#458F87',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   drawerStyles: {
//     width: '100%',
//     backgroundColor: 'transparent',
//   },
//   IconsMainContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//     marginRight: 20
//   }
// });

// export default AppNavigator;
