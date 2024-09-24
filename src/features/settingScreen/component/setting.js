import React, { useState, useEffect } from "react";
import {
  View,
  DeviceEventEmitter,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import * as styles from "../../../../assets/styles/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userIcon, reset, logout } from "../../../../assets/images/index";
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import { BASE_URL } from "../../../utility/networklayer/endPoints";
import { toastMsg } from "../../../components/toast";
import RNRestart from "react-native-restart";


export default Setting = ({ navigation }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [imgLoader, setImgLoader] = useState(false);
  const [beneficiaryDataUser, setBeneficiaryDataUser] = useState("");
  const [loginToken, setLoginToken] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [imageUrl, setImageUrl] = useState(
    ""
  );

  useEffect(() => {
    AsyncStorage.getItem("logindetail").then((response) => {
      if (response != null) {
        let asynData = JSON.parse(response);
        let BeneficiaryData = asynData.Data.Beneficiary[0];
        const Data = asynData.Data;
        _onRefresh(Data.Token)
        setLoginToken(Data.Token);
        // setImageUrl(Data.PhotoURL)
        setBeneficiaryDataUser(BeneficiaryData);
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
        setImageUrl(Data.PhotoURL)
      } else if (response.status === 'FAILED') {
        toastMsg('Token expired. Please login again');
        await AsyncStorage.removeItem('logindetail');
      }
    } catch (error) {
      console.log(error, 'status code work');
    }
  };
  const uploadImage = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        mimeTypes: ['image/jpeg', 'image/jpg'],
      });

      // Create a copy of the current attachments array
      const newAttachments = [...attachments];

      result.forEach((image) => {
        // Check if the image is of supported type
        if (image.type === 'image/jpeg' || image.type === 'image/jpg') {
          attachments.push({
            uri: image.uri,
            type: 'image/jpeg',
            name: image.name,
          });
        } else {
          toastMsg('Only JPEG and JPG files are supported.');
        }
      });
      // Set the updated attachments array in state
      setAttachments(attachments);

      // Call onSubmitData to process the selected image(s) automatically
      await onSubmitData();
    } catch (error) {
      console.error('Error selecting images:', error);
    }
  };
  const onSubmitData = async () => {
    setImgLoader(true);
    const formData = new FormData();
    attachments.forEach((attachment, index) => {
      formData.append(`Files`, {
        uri: attachment.uri,
        type: attachment.type,
        name: attachment.name,
      });
    });
    formData.append('Token', loginToken);
    try {
      const response = await fetch(BASE_URL + 'LoginMobile/ChangePhoto', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'FAILED') {
          setImgLoader(false);
          toastMsg('Token expired. Please login again');
          await AsyncStorage.removeItem('logindetail');
          navigation.navigate('Login')
        }
        else {
          setImgLoader(false);
          setAttachments([]); // Clear the attachments state here
          toastMsg(data.Message);
          _onRefresh(loginToken)
        }
      }
    } catch (error) {
      setImgLoader(false);
    }
  };
  const onLogout = async () => {
    await AsyncStorage.removeItem("logindetail");
    RNRestart.Restart(); // Restart the app
    navigation.navigate('Login')

  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignSelf: "center", width: "97%", marginBottom: 0 }}
    >
      <View style={styles.profileHeader}>
        <View style={styles.profileHeaderContent}>
          {imgLoader == false ? (
            // <Image style={styles.avatar} source={userIcon} />
            <Image style={styles.avatar} source={imageUrl ? { uri: imageUrl } : userIcon} />
          ) : (
            <View style={styles.avatar}>
              <ActivityIndicator style={{ marginTop: 45 }} size="large" color="#0000ff" />
            </View>
          )}
          <Text style={styles.profileName}>{beneficiaryDataUser.Cap_InsuredName}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{ flexDirection: "row", padding: 15, borderBottomColor: styles.borderColors.grey, borderBottomWidth: 1 }}
        onPress={uploadImage}
      >
        <Icon color={"black"} name={"camera"} size={21} />
        <Text style={[styles.font.regular, { padding: 2, paddingLeft: 8, color: styles.fontColors.grey }]}>Change Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChangePassword')}
        style={{ flexDirection: "row", padding: 15, borderBottomColor: styles.borderColors.grey, borderBottomWidth: 1 }}
      >
        <Image source={reset} style={{ width: 23, height: 22 }} />
        <Text style={[styles.font.regular, { padding: 2, paddingLeft: 8, color: styles.fontColors.grey }]}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChangeAddress')}
        style={{ flexDirection: "row", padding: 15, borderBottomColor: styles.borderColors.grey, borderBottomWidth: 1 }}
      >
        <Icon color={"black"} name={"address-card-o"} size={22} />
        <Text style={[styles.font.regular, { padding: 2, paddingLeft: 8, color: styles.fontColors.grey }]}>Change Address & Number</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onLogout}
        style={{ flexDirection: "row", padding: 15, borderBottomColor: styles.borderColors.grey, borderBottomWidth: 1 }}
      >
        <Image source={logout} style={{ width: 23, height: 22 }} />
        <Text style={[styles.font.regular, { padding: 2, paddingLeft: 8, color: styles.fontColors.grey }]}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
