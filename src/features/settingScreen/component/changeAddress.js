import React, { useState, useEffect } from "react";
import { View, Dimensions, Text, SafeAreaView, TextInput, ActivityIndicator } from "react-native";
import * as styles from "../../../../assets/styles/styles";
import Header from "../../../components/header/header";
import RoundedButton from "../../../components/roundedButton/roundedButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../../utility/networklayer/endPoints";
import { toastMsg } from "../../../components/toast";
import axios from 'axios';
import Textinput from "../../../components/textinput/textinput";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default  ChangeAddress = ({ navigation })=> {
  const [fullAddress, setFullAddress] = useState('');
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginToken, setLoginToken] = useState('');
  const [UserName, setUserName] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [errors, setErrors] = useState({
    fullAddress: null,
    number: null
  });
  useEffect(() => {
    AsyncStorage.getItem('logindetail').then((response) => {
      if (response != null) {
        const asynData = JSON.parse(response);
        const Data = asynData.Data;
        _onRefresh(Data.Token)
      } else {
        setIsLoading(false);
      }
    });
  }, []);
  const _onRefresh = async (token) => {
    let apiObj = {
      Token: token,
    };
    try {
      const res = await axios.post(BASE_URL + "LoginMobile/SyncData", apiObj);
      let response = res.data;
      if (response.Status === 'OK') {
        const asynData = response;
        const Data = asynData.Data;
        let userAddress = asynData.Data.Beneficiary[0].Address;
        let phoneNumber = asynData.Data.Beneficiary[0].BeneficiaryMobileNumber;
        setLoginToken(Data.Token);
        setFullAddress(userAddress);
        setNumber(phoneNumber)
      } else if (response.status === 'FAILED') {
        toastMsg('Token expired. Please login again');
        await AsyncStorage.removeItem('logindetail');
        navigation.navigate('Login')
      }
    } catch (error) {
      console.log(error, 'status code work');
    }
  };
  const onChangeAddress = async () => {
    setErrors({
      fullAddress: null,
      number: null
    });
    let hasErrors = false;

    if (isFieldEmpty(fullAddress)) {
      setErrors((prevErrors) => ({ ...prevErrors, fullAddress: "Please enter Address" }));
      hasErrors = true;
    }
    if (isFieldEmpty(number)) {
      setErrors((prevErrors) => ({ ...prevErrors, number: "Please enter Phone Number" }));
      hasErrors = true;
    }
    else if (number.length < 11) {
      setErrors((prevErrors) => ({ ...prevErrors, number: "Contact number should not exceed 11 digits" }));
      hasErrors = true;
    }
    if (!hasErrors) {
      setIsLoading(true);
      const apiObj = {
        Number: number,
        Address: fullAddress,
        Token: loginToken,
      };
      try {
        const res = await axios.post(BASE_URL + 'LoginMobile/ChangeAddressPhone', apiObj);
        const response = res.data;
        if (response.Status === 'OK') {
          toastMsg(response.Message);
          navigation.navigate('Home')
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
    <GestureHandlerRootView>
      <SafeAreaView>
        <Header title={'Change Address'} />
        <View style={{ alignSelf: 'center', marginTop: '10%', width: '90%' }}>
          <Text style={[styles.font.bold,{
            fontSize: 15,
            color: styles.fontColors.grey,
            paddingBottom: 10
          }]}>PHONE NUMBER</Text>
          <Textinput
            maxLength={11}
            value={number}
            onChangeText={(text) => {
              setNumber(text);
            }}
          />
          {errors.number && <Text style={{ paddingLeft: 0, paddingTop: 8, color: 'red' }}>{errors.number}</Text>}
        </View>
        <View style={{ alignSelf: 'center', marginTop: '10%', width: '90%' }}>
          <Text style={[styles.font.bold,{
            fontSize: 15,
            color: styles.fontColors.grey,
            paddingBottom: 10
          }]}>ADDRESS
          </Text>
          <TextInput
            value={fullAddress}
            onChangeText={text => setFullAddress(text)}
            placeholder=""
            placeholderTextColor="#637381"
            style={styles.remarkTextInput}
            multiline
          />
          {errors.fullAddress && <Text style={{ paddingLeft: 0, paddingTop: 8, color: 'red' }}>{errors.fullAddress}</Text>}
        </View>
        <View style={{ flexDirection: "column", marginTop: 20 }}>
          {isLoading ?
            <ActivityIndicator
              size="large"
              color="#1d4e77" />
            :
            <View style={{ width: "80%", height: "35%", alignSelf: "center" }}>
              <RoundedButton
                text={'Update'}
                buttonContainerStyle={[styles.LoginButton]}
                buttonTextStyle={styles.ButtonTextTyleWithBackground}
                onPress={onChangeAddress}
              />
            </View>
          }
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
