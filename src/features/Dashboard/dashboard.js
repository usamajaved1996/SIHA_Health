import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl, Modal, TextInput, DeviceEventEmitter, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as styles from "../../../assets/styles/styles";
import * as font from "../../../assets/styles/styles";
import RoundedButton from "../../components/roundedButton/roundedButton";
import { Card } from 'react-native-paper';
import { reimbusIcon, appointment, times, consultant, mainScreenLogo } from '../../../assets/images/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from "../../utility/networklayer/endPoints";
import { toastMsg } from "../../components/toast";

const Dashboard = ({ navigation }) => {
  const [dataUser, setDataUser] = useState('');
  const [beneficiaryDataUser, setBeneficiaryDataUser] = useState('');
  const [dependentDataUser, setDependentDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onRefreshing, setOnRefreshing] = useState(false);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [loginToken, setLoginToken] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [errors, setErrors] = useState({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('logindetail').then((response) => {
      if (response != null) {
        let asynData = JSON.parse(response);
        let Data = asynData.Data;
        let BeneficiaryData = asynData.Data.Beneficiary[0];
        let DependentData = asynData.Data.Dependents;
        if (Data.IsFirstLogin == 1) {
          setModalVisible(true)
        }
        setDataUser(Data);
        setBeneficiaryDataUser(BeneficiaryData);
        setDependentDataUser(DependentData);
        setIsLoading(false);
        setLoginToken(Data.Token);

      } else {
        setIsLoading(false);
      }
    });
  }, []);
  const _onRefresh = async () => {
    setOnRefreshing(true);
    let apiObj = {
      Token: loginToken,
    };
    try {
      const res = await axios.post(BASE_URL + "LoginMobile/SyncData", apiObj);
      let response = res.data;
      setOnRefreshing(false);
      if (response.Status === 'OK') {
        let asynData = response;
        let Data = asynData.Data;
        let BeneficiaryData = asynData.Data.Beneficiary[0];
        let DependentData = asynData.Data.Dependents;
        setDataUser(Data);
        setBeneficiaryDataUser(BeneficiaryData);
        setDependentDataUser(DependentData);
        setIsLoading(false);
        setLoginToken(Data.Token);
      } else if (response.status === 'FAILED') {
        setOnRefreshing(false);
        toastMsg('Token expired. Please login again');
        await AsyncStorage.removeItem('logindetail');
        navigation.navigate('Login')
      } else {
        setOnRefreshing(false);
      }
    } catch (error) {
      setOnRefreshing(false);
    }
  };
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
        UserName: beneficiaryDataUser.BeneficiaryCNIC,
        Password: oldPassword,
        Token: loginToken,
        NewPassword: newPassword
      };
      try {
        const res = await axios.post(BASE_URL + 'LoginMobile/ChangePassword', apiObj);
        const response = res.data;
        if (response.Status === 'OK') {
          setModalVisible(false)
          await AsyncStorage.removeItem("logindetail");
          DeviceEventEmitter.emit("refreshApp");
          navigation.navigate('Login')
          toastMsg(response.Message);
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
    <SafeAreaView style={styles.container}>
      <Modal animationType="slide" visible={modalVisible} transparent>
        <View
          style={{
            flex: 0.9,
            backgroundColor: 'white',
            marginTop: 100,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 10,
            elevation: 8,
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
          }}
        >
          <View style={{ width: "80%", flexDirection: "column", alignSelf: "center", marginTop: 30 }}>
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

          <View style={{ width: "80%", flexDirection: "column", alignSelf: "center", marginTop: 10 }}>
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
          <View style={{ width: "80%", flexDirection: "column", alignSelf: "center", marginTop: 10 }}>
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
      </Modal>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={onRefreshing}
            onRefresh={_onRefresh}
          />
        }
      >
        {isLoading == true ? (
          <View style={{ justifyContent: 'center', alignContent: 'center', marginTop: '70%' }}>
            <ActivityIndicator size="large" color="#1d4e77" />
          </View>
        ) : (
          <View>
            <View style={styles.HealthLogoContainerHeader}>
              <Image source={mainScreenLogo} style={styles.HealthLogoHeader} />
              <View style={{ width: '100%', flexDirection: 'row', position: 'absolute', top: 90, left: 7 }}>
                <View style={{ width: '65%' }}>
                  <Text style={{ fontSize: 8.5, fontWeight: 'bold', color: 'white', paddingLeft: 10 }}>
                    BENEFICIARY: {beneficiaryDataUser.Cap_InsuredName}
                  </Text>
                  <View style={{ paddingTop: '0%', width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '32%', paddingLeft: 7 }}>
                      <Text style={styles.HealthCardText}> Card No </Text>
                      <Text style={styles.HealthCardText}> Client's Name</Text>
                      <Text style={styles.HealthCardText}> CNIC Number</Text>
                      <Text style={styles.HealthCardText}> Valid Upto</Text>
                      <Text style={styles.HealthCardText}> Benefit Covered</Text>
                      <Text style={styles.HealthCardText}> Allocated Limit</Text>
                    </View>
                    <View style={{ width: '65%' }}>
                      <Text style={styles.HealthCardText}>: {beneficiaryDataUser.CardNumber} </Text>
                      <Text style={styles.HealthCardText}>: {beneficiaryDataUser.ClientName}</Text>
                      <Text style={styles.HealthCardText}>: {beneficiaryDataUser.BeneficiaryCNIC}</Text>
                      <Text style={styles.HealthCardText}>: {beneficiaryDataUser.ValidUpto}</Text>
                      <Text style={styles.HealthCardText}>: {beneficiaryDataUser.BenefitStructureName}</Text>
                      <Text style={styles.HealthCardText}>: {dataUser.AllocatedLimit}</Text>
                    </View>
                  </View>
                </View>
                {dependentDataUser != null ? (
                  <View style={{ width: '35%', paddingTop: '4%' }}>
                    <Text style={styles.listCover}> List of Covered Dependents</Text>
                    {dependentDataUser.map((item, index) => (
                      <View key={index} style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '80%' }}>
                          <Text style={styles.HealthCardText2}>{item['Insured Name']}</Text>
                        </View>
                        <View style={{ width: '20%', position: 'absolute', right: 10 }}>
                          <Text style={styles.HealthCardText2}>{item.Age}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', paddingLeft: 5 }}>
              <Card style={styles.CardStyle}>
                <View style={styles.CardTopPart}>
                  <Text style={styles.TopTextStyle}>Allocated Limit</Text>
                </View>
                <View style={styles.CartBottomPart}>
                  <Text style={styles.BottomTextStyle}>{dataUser.AllocatedLimit}</Text>
                  <Text style={styles.BottomTextStyle2}>{dataUser.AllocatedText}</Text>
                </View>
              </Card>
              <Card style={styles.CardStyle3}>
                <View style={styles.BorderCardStyle}>
                  <View style={styles.CardTopPart}>
                    <Text style={styles.TopTextStyle}>Consumed Limit</Text>
                  </View>
                  <View style={styles.CartBottomPart}>
                    <Text style={styles.BottomTextStyle}>{dataUser.ConsumedLimit}</Text>
                    <Text style={styles.BottomTextStyle2}>{dataUser.ConsumedText}</Text>
                  </View>
                </View>
              </Card>
            </View>
            <View style={styles.secondViewCard}>
              <Card style={styles.CardStyle}>
                <View style={styles.CardTopPart}>
                  <Text style={styles.TopTextStyle}>Available Limit</Text>
                </View>
                <View style={styles.CartBottomPart}>
                  <Text style={styles.BottomTextStyle}>{dataUser.AvailableLimit}</Text>
                  <Text style={styles.BottomTextStyle2}>{dataUser.AvailableText}</Text>
                </View>
              </Card>
              <Card style={styles.CardStyle3}>
                <TouchableOpacity style={styles.BorderCardStyle} onPress={() => navigation.navigate('Claim')}>
                  <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 14 }}>
                    <Image source={reimbusIcon} style={{ width: 30, height: 30 }} />
                  </View>
                  <View>
                    <Text style={styles.claimText}>New Claim</Text>
                  </View>
                </TouchableOpacity>
              </Card>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', paddingBottom: 0, marginTop: 15, height: 100 }}>
              {beneficiaryDataUser.AllowConsultations = 1 ? (
                <Card style={styles.CardStyle5}>
                  <TouchableOpacity style={[styles.LastCardStyle, { paddingBottom: 0 }]} onPress={() => navigation.navigate('Consult')}>
                    <View style={{ alignItems: 'center', paddingTop: 10 }}>
                      <Image source={consultant} style={{ width: 30, height: 30 }} />
                    </View>
                    <View>
                      <Text style={styles.LastCardText}>Consult Doctor</Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              ) : null}
              {beneficiaryDataUser.AllowLabs = 1 ? (
                <Card style={styles.CardStyle6}>
                  <TouchableOpacity style={styles.LastCardStyle} onPress={() => navigation.navigate('Appointment')}>
                    <View style={{ alignItems: 'center', paddingTop: 10 }}>
                      <Icon color={'white'} style={{ alignItems: 'center' }} name={"calendar-check-o"} size={30} />
                    </View>
                    <View>
                      <Text style={styles.LastCardText}>Book Lab</Text>
                      <Text style={styles.LastCardText2}>Appointment</Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              ) : null}
              {beneficiaryDataUser.AllowPharmacy = 1 ? (
                <Card style={styles.CardStyle4}>
                  <TouchableOpacity style={[styles.LastCardStyle, { paddingBottom: 0 }]} onPress={() => navigation.navigate('Order')}>
                    <View style={{ alignItems: 'center', paddingTop: 10 }}>
                      <Image source={times} style={{ width: 36, height: 36 }} />
                    </View>
                    <View>
                      <Text style={styles.LastCardText}>Order Medicine</Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              ) : null}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
