import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Card, Badge } from 'react-native-paper';
import * as styles from '../../../../assets/styles/styles';
import { back } from '../../../../assets/images/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../../utility/networklayer/endPoints';
import { toastMsg } from '../../../components/toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default Cashless  = () => {
  const navigation = useNavigation();

  const [loginToken, setLoginToken] = useState('');
  const [cashlessData, setCashlessData] = useState([]);
  const [idToFind] = useState(2);
  const [onRefreshing, setOnRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('logindetail').then((response) => {
      if (response != null) {
        const asynData = JSON.parse(response);
        const Data = asynData.Data;
        setLoginToken(Data.Token);
        getClaimsData(Data.Token);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const getClaimsData = async (token) => {
    const apiObj = {
      Token: token,
    };

    try {
      const res = await axios.post(BASE_URL + 'ClaimMobile/GetAllClientClaim', apiObj);
      const response = res.data;
      if (response.Status === 'OK') {
        const jsonData = response.Data;
        const item = jsonData.filter((item) => item.ClaimTypeId === idToFind);
        setCashlessData(item);
        setIsLoading(false);
      } else if (response.status === 'FAILED' && response.message !== "Value cannot be null. (Parameter 'value')") {
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const renderItem = (item, index) => {
    return (
      <Card style={styles.reimbursementCard}>
        <View style={styles.headerStyle}>
          <View style={{ width: '85%' }}>
            <Text style={styles.headerText}>{item.ClaimId} - {item.InsuredName}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DetailsScreen', { screenName: 'cashless', screenId: item.ClaimId });
            }}
            style={{ width: '100%', marginTop: 0 }}>
            <Image source={back} style={{ width: 30, height: 22 }} />
          </TouchableOpacity>
        </View>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <View style={styles.benefitView}>
            <Text style={styles.benefitText}>Benefit: </Text>
          </View>
          <View style={{ width: '80%', paddingTop: 10 }}>
            <Text style={styles.benefitTextItem}> {item.Benefit}</Text>
          </View>
        </View>
        <View style={styles.mainViewContact}>
          <View style={styles.secondViewContact}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.firstTextContact}>Relation:</Text>
              <Text style={styles.relationItem}>{item.Relation} </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.firstTextContact}>Contact:</Text>
              <Text style={styles.relationItem}>{item.Contact} </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.firstTextContact}>Claim Date:</Text>
              <Text style={styles.relationItem}>{item.ClaimDate} </Text>
            </View>
            {Object.entries(item.Extra[0]).map(([key, value]) => (
              <View key={key} style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={styles.firstTextContact}>{key}:</Text>
                <Text style={styles.relationItem}>{value} </Text>
              </View>
            ))}
          </View>
          <View style={{ width: '45%', paddingTop: 6 }}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <View>
                <Text style={styles.firstTextContact}>Status: </Text>
              </View>
              <View>
              <Badge style={[styles.badgeStyle, { backgroundColor: item.StatusColor }]}>
                  {item.Status}
                </Badge>
              </View>
            </View>
            <View style={styles.contributionView}>
              <Text style={styles.contributionText}>Amount</Text>
              <View style={styles.borderStyle}>
                <Text style={[styles.font.regular,{ fontSize: 11, paddingTop: 2,color: styles.fontColors.grey }]}>Approved: {item.Approved}</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const _onRefresh = async () => {
    setOnRefreshing(true);
    const apiObj = {
      Token: loginToken,
    };

    try {
      const res = await axios.post(BASE_URL + 'ClaimMobile/GetAllClientClaim', apiObj);
      const response = res.data;

      if (response.Status === 'OK') {
        const jsonData = response.Data;
        const item = jsonData.filter((item) => item.ClaimTypeId === idToFind);
        setCashlessData(item);
        setOnRefreshing(false);
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

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading == true ? (
        <View style={styles.loadingLoadder}>
          <ActivityIndicator size="large" color="#1d4e77" />
        </View>
      ) : (
        <FlatList
          data={cashlessData}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={onRefreshing} onRefresh={_onRefresh} />
          }
          initialNumToRender={10}
        />
      )}
    </GestureHandlerRootView>
  );
}
