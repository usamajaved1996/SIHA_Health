import React, { useState, useEffect } from "react";
import { View, Text, TextInput, DeviceEventEmitter, SafeAreaView, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import * as styles from "../../../../assets/styles/styles";
import RoundedButton from "../../../components/roundedButton/roundedButton";
import Header from "../../../components/header/header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../../utility/networklayer/endPoints";
import { toastMsg } from "../../../components/toast";
import axios from 'axios';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default  ChangePassword = ({ navigation })=> {
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginToken, setLoginToken] = useState('');
  const [UserName, setUserName] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [errors, setErrors] = useState({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

  useEffect(() => {
    AsyncStorage.getItem('logindetail').then((response) => {
      if (response != null) {
        const asynData = JSON.parse(response);
        const Data = asynData.Data;
        let BeneficiaryData = asynData.Data.Beneficiary[0].BeneficiaryCNIC;
        setLoginToken(Data.Token);
        setUserName(BeneficiaryData);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const onChangePassword = async () => {
    setErrors({
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
    });
    let hasErrors = false;

    if (isFieldEmpty(oldPassword)) {
      setErrors((prevErrors) => ({ ...prevErrors, oldPassword: "Please enter Old Password" }));
      hasErrors = true;
    }

    if (isFieldEmpty(newPassword)) {
      setErrors((prevErrors) => ({ ...prevErrors, newPassword: "Please enter New Password" }));
      hasErrors = true;
    }

    if (isFieldEmpty(confirmPassword)) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Please enter Confirm Password" }));
      hasErrors = true;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, newPassword: "New Password and Confirm Password do not match" }));
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "New Password and Confirm Password do not match" }));
      hasErrors = true;
    }
    if (!hasErrors) {
      setIsLoading(true);
      const apiObj = {
        UserName: UserName,
        Password: oldPassword,
        Token: loginToken,
        NewPassword: newPassword
      };
      try {
        const res = await axios.post(BASE_URL + 'LoginMobile/ChangePassword', apiObj);
        const response = res.data;
        if (response.Status === 'OK') {
          toastMsg('Your password has been changed, Please Login again');
          await AsyncStorage.removeItem("logindetail");
          DeviceEventEmitter.emit("refreshApp");
          navigation.navigate('Login')
        } else if (response.Status === 'FAILED') {
          setIsLoading(false);
          toastMsg(response.Message);
        }
        else if (response.status === 'FAILED') {
          setIsLoading(false);
          toastMsg('Token expired. Please login again');
          await AsyncStorage.removeItem('logindetail');
          navigation.navigate('Login')
        }
        else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  }

  const isFieldEmpty = (value) => {
    return value === null || value === "";
  }
  return (
    <GestureHandlerRootView style={styles.container}>

    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior="height">
      <SafeAreaView>
        <Header title={'Change Password'} />
        <View style={{ flexDirection: "column", marginTop: 40 }}>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <View style={{ width: "80%", flexDirection: "column", alignSelf: "center", justifyContent: "center" }}>
              <Text style={styles.InputBoxHeaderText}>Old Password</Text>
              <TextInput
                placeholder="**************"
                placeholderTextColor="#637381"
                style={styles.InputBox}
                value={oldPassword}
                secureTextEntry={true}
                onChangeText={text => setOldPassword(text)}
              />
            </View>
            {errors.oldPassword && <Text style={styles.errorText2}>{errors.oldPassword}</Text>}

            <View style={{ width: "80%", flexDirection: "column", alignSelf: "center", marginTop: 20 }}>
              <Text style={styles.InputBoxHeaderText}> New Password</Text>
              <TextInput
                placeholder="**************"
                placeholderTextColor="#637381"
                style={styles.InputBox}
                value={newPassword}
                secureTextEntry={true}
                onChangeText={text => setNewPassword(text)}
              />
            </View>
            {errors.newPassword && <Text style={styles.errorText2}>{errors.newPassword}</Text>}

            <Text style={{ color: 'red', marginTop: 10 }}>{validationMessage}</Text>
            <View style={{ width: "80%", flexDirection: "column", alignSelf: "center", marginTop: 0 }}>
              <Text style={styles.InputBoxHeaderText}> Confirm Password</Text>
              <TextInput
                placeholder="**************"
                placeholderTextColor="#637381"
                style={styles.InputBox}
                value={confirmPassword}
                secureTextEntry={true}
                onChangeText={text => setConfirmPassword(text)}
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText2}>{errors.confirmPassword}</Text>}
            <View style={{ flexDirection: "column", marginTop: 20 }}>
              {isLoading ?
                <ActivityIndicator
                  size="large"
                  color="#1d4e77" />
                :
                <View style={{ width: "80%", height: "35%", alignSelf: "center" }}>
                  <RoundedButton
                    text={'Submit'}
                    buttonContainerStyle={[styles.LoginButton]}
                    buttonTextStyle={styles.ButtonTextTyleWithBackground}
                    onPress={onChangePassword}
                  />
                </View>
              }
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
