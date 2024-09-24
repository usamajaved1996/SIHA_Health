import React, { useState, useEffect } from "react";
import { Text, View, Image, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import * as styles from "../../../../assets/styles/styles";
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { userIcon } from '../../../../assets/images/index';
import { BASE_URL } from "../../../utility/networklayer/endPoints";
import { toastMsg } from "../../../components/toast";
import { useNavigation } from '@react-navigation/native';

export default function DetailsScreen() {
  const navigation = useNavigation();

  const [dataUser, setDataUser] = useState('');
  const [beneficiaryDataUser, setBeneficiaryDataUser] = useState('');
  const [dependentDataUser, setDependentDataUser] = useState([]);
  const [beneficiaryExtraDataUser, setBeneficiaryExtraDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loginToken, setLoginToken] = useState('');
  const [onRefreshing, setOnRefreshing] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    ""
  );
  useEffect(() => {
    AsyncStorage.getItem('logindetail').then((response) => {
      if (response != null) {
        let asynData = JSON.parse(response);
        let Data = asynData.Data;
        let BeneficiaryData = asynData.Data.Beneficiary[0];
        let DependentData = asynData.Data.Dependents;
        let ExtraBeneficiaryData = Data.BeneficiaryExtra;
        console.warn('beneficiaryDataUser', BeneficiaryData)
        _onRefresh(Data.Token)
        setDataUser(Data);
        setImageUrl(Data.PhotoURL)
        setBeneficiaryDataUser(BeneficiaryData);
        setDependentDataUser(DependentData);
        setBeneficiaryExtraDataUser(ExtraBeneficiaryData);
        setIsLoading(false);
        setLoginToken(Data.Token);

      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const _onRefresh = async (token) => {
    setOnRefreshing(true);
    let apiObj = {
      Token: token != null ? token : loginToken,
    };
    try {
      const res = await axios.post(BASE_URL + 'LoginMobile/SyncData', apiObj);
      let response = res.data;
      setOnRefreshing(false);
      if (response.Status === 'OK') {
        let asynData = res.data;
        let Data = asynData.Data;
        let BeneficiaryData = asynData.Data.Beneficiary[0];
        let DependentData = asynData.Data.Dependents;
        let ExtraBeneficiaryData = Data.BeneficiaryExtra;
        setImageUrl(Data.PhotoURL)
        setDataUser(Data);
        setBeneficiaryDataUser(BeneficiaryData);
        setDependentDataUser(DependentData);
        setBeneficiaryExtraDataUser(ExtraBeneficiaryData);
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
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignSelf: 'center', width: '97%', marginBottom: 0 }}>
      {isLoading == true ? (
        <View style={styles.loadingLoadder}>
          <ActivityIndicator size="large" color="#1d4e77" />
        </View>
      ) : (
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={onRefreshing}
            onRefresh={_onRefresh}
          />
        }>
          <View style={styles.profileHeader}>
            <View style={styles.profileHeaderContent}>
              <Image style={styles.avatar} source={imageUrl ? { uri: imageUrl } : userIcon} />
              <Text style={styles.profileName}>{beneficiaryDataUser.Cap_InsuredName}</Text>
            </View>
          </View>
          <Card style={styles.profileCard}>
            <View style={styles.profileMainView}>
              <View style={styles.profileCardFirstPart}>
                <Text style={styles.profileCardFont1}>CNIC:</Text>
                <Text style={styles.profileCardFont2}> {beneficiaryDataUser.BeneficiaryCNIC}</Text>
              </View>
              <View style={styles.profileCardSecondPart}>
                <Text style={styles.profileCardFont1}>Effective From:</Text>
                <Text style={styles.profileCardFont2}> {beneficiaryDataUser.EffectiveDate}</Text>
              </View>
            </View>
            <View style={styles.profileMainView}>
              <View style={styles.profileCardFirstPart}>
                <Text style={styles.profileCardFont1}>DOB:</Text>
                <Text style={styles.profileCardFont2}> {beneficiaryDataUser.BirthDate}</Text>
              </View>
              <View style={styles.profileCardSecondPart}>
                <Text style={styles.profileCardFont1}>Age:</Text>
                <Text style={styles.profileCardFont2}> {beneficiaryDataUser.Age}</Text>
              </View>
            </View>
            <View style={styles.profileMainView}>
              <View style={styles.profileCardFirstPart}>
                <Text style={styles.profileCardFont1}>Gender:</Text>
                <Text style={styles.profileCardFont2}> {beneficiaryDataUser.GenderId == 2 ? 'Female' : 'Male'}</Text>
              </View>
              <View style={styles.profileCardSecondPart}>
                <Text style={styles.profileCardFont1}>Martial Status:</Text>
                <Text style={styles.profileCardFont2}> {beneficiaryDataUser.MaritalStatusName}</Text>
              </View>
            </View>
            <View style={styles.profileMainView}>
              <View style={styles.profileCardFirstPart}>
                <Text style={styles.profileCardFont1}>Plan:</Text>
                <Text style={styles.profileCardFont2}> {beneficiaryDataUser.PlanName}</Text>
              </View>
              <View style={styles.profileCardSecondPart}>
                <Text style={styles.profileCardFont1}>Limit:</Text>
                <Text style={styles.profileCardFont2}> {beneficiaryDataUser.BenefitLimit}</Text>
              </View>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', paddingTop: 0, paddingLeft: 10 }}>
              <Text style={styles.profileCardFont1}>Card Number:</Text>
              <Text style={styles.profileCardFont2}> {beneficiaryDataUser.CardNumber}</Text>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', paddingTop: 0, paddingLeft: 10 }}>
              <Text style={styles.profileCardFont1}>Mobile Number:</Text>
              <Text style={styles.profileCardFont2}> {beneficiaryDataUser.BeneficiaryMobileNumber}</Text>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', paddingTop: 0, paddingLeft: 10 }}>
              <Text style={styles.profileCardFont1}>Address:</Text>
              <Text style={styles.profileCardFont2}> {beneficiaryDataUser.Address}</Text>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', paddingTop: 0, paddingLeft: 10 }}>
              <Text style={styles.profileCardFont1}>Bank Name:</Text>
              <Text style={styles.profileCardFont2}> {beneficiaryDataUser.BankName}</Text>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', paddingTop: 0, paddingLeft: 10 }}>
              <Text style={styles.profileCardFont1}>Account/IBAN #:</Text>
              <Text style={styles.profileCardFont2}>  {beneficiaryDataUser.AccountIBAN}</Text>
            </View>
            {Object.entries(beneficiaryExtraDataUser[0]).map(([key, value]) => (
              <View key={key} style={{ width: '100%', flexDirection: 'row', paddingTop: 0, paddingLeft: 10 }}>
                <Text style={styles.profileCardFont1}>{key}:</Text>
                <Text style={styles.profileCardFont2}> {value}</Text>
              </View>
            ))}
          </Card>
          {dependentDataUser != null ? (
            <View>
              {dependentDataUser.map((item, index) => (
                <Card style={{ width: '100%', marginTop: 15, alignSelf: 'center', marginBottom: 5 }}>
                  <View>
                    <View style={styles.cardViewBackgroundColor}>
                      <Text style={[styles.font.bold, { color: 'white', fontSize: 12 }]}>{item['Insured Name']}</Text>
                    </View>
                    <View style={styles.profileSecondCardView}>
                      {Object.entries(item.DependentExtra[0]).map(([key, value]) => (
                        <View key={key} style={{ width: '100%', flexDirection: 'row', paddingTop: 5, paddingLeft: 10 }}>
                          <Text style={styles.profileCardFont1}>{key}:</Text>
                          <Text style={styles.profileCardFont2}> {value} </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
