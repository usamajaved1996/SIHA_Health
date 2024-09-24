import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, KeyboardAvoidingView, TouchableOpacity, Platform, PermissionsAndroid } from "react-native";
import * as styles from "../../../assets/styles/styles";
import RoundedButton from "../../components/roundedButton/roundedButton";
import { logo, newLogo } from "../../../assets/images/index";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toastMsg } from '../../components/toast';
import { ActivityIndicator } from "react-native-paper";
import { BASE_URL } from "../../utility/networklayer/endPoints";
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginToken, setLoginToken] = useState('');

  useEffect(() => {
    requestUserPermissionNotification();
    checkApplicationPermission();
    getToken();
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(token => {
      console.warn('Token refreshed:', token);
      setLoginToken(token);
    });

    return unsubscribe;
  }, []);
  async function requestUserPermissionNotification() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.warn('token', token)
      setLoginToken(token);
    } catch (error) {
      console.error('Error while requesting user permission:', error);
    }
  }
  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {
      }
    }
  };
  const onLoginAction = () => {
    setIsLoading(true);
    const apiObj = {
      UserName: email,
      Password: password,
      AndroidId: Platform.OS === 'android' ? loginToken : "-",
      AppleId: Platform.OS === 'ios' ? loginToken : "-"
    };
    console.warn('obj', apiObj);
    axios.post(`${BASE_URL}LoginMobile/SignIn`, apiObj)
      .then(res => {
        const response = res.data;
        setIsLoading(false);
        if (response.Status === 'OK') {
          AsyncStorage.setItem('logindetail', JSON.stringify(response));
          toastMsg(response.Message);
          navigation.navigate('Home');
        } else {
          setIsLoading(false);
          toastMsg('User not found');
        }
      })
      .catch(error => {
        setIsLoading(false);
        toastMsg('Error logging in. Please try again.');
        console.error(error);
      });
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior="height">
      <View style={styles.LogoContainerHeader}>
        <Image source={logo} style={styles.LogoHeader} />
      </View>
      <View>
        <Image source={newLogo} style={{
          alignSelf: "center",
          width: '29%',
          height: 65,
          position: 'absolute', right: 45, top: 15
        }} />
      </View>
      <View style={{ flexDirection: "column", marginTop: 50 }}>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <View style={{ width: "80%", flexDirection: "column", alignSelf: "center", justifyContent: "center" }}>
            <Text style={styles.InputBoxHeaderText}>CNIC Number</Text>
            <TextInput
              placeholder="CNIC number here"
              placeholderTextColor="#637381"
              style={styles.InputBox}
              value={email}
              onChangeText={text => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={{ width: "80%", flexDirection: "column", alignSelf: "center", paddingTop: 10 }}>
            <Text style={styles.InputBoxHeaderText}>Password</Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                placeholder="**************"
                placeholderTextColor="#637381"
                style={styles.InputBox}
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={text => setPassword(text)}
              />
              <TouchableOpacity
                style={styles.PasswordToggleIcon}
                onPress={togglePasswordVisibility}>
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#637381"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: "column", marginTop: 20 }}>
            {isLoading ?
              <ActivityIndicator
                size="large"
                color="#1d4e77" />
              :
              <View style={{ width: "80%", height: "40%", alignSelf: "center" }}>
                <RoundedButton
                  text={'Sign in'}
                  buttonContainerStyle={[styles.LoginButton]}
                  buttonTextStyle={styles.ButtonTextTyleWithBackground}
                  onPress={onLoginAction}
                />
              </View>
            }
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Login;