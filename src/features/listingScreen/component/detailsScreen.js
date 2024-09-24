import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, SafeAreaView, RefreshControl, TouchableOpacity, Linking } from "react-native";
import { Card, Badge } from 'react-native-paper';
import * as styles from "../../../../assets/styles/styles";
import Header from "../../../components/header/header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, APIURLMORE } from "../../../utility/networklayer/endPoints";
import DocumentPicker from 'react-native-document-picker';
import { pdf, jpeg, pdfDown } from '../../../../assets/images/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import { toastMsg } from "../../../components/toast";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyDvks2mcxQb-gukGtBQixkr3VY46s3uvVw"); // Replace with your Google Maps API key

function DetailsScreen({ route }) {
    const navigation = useNavigation();
    const { screenName, screenId } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [numAttachedFiles, setNumAttachedFiles] = useState(0);
    const [detailData, setDetailData] = useState([]);
    const [DetailExtraData, setDetailExtraData] = useState([]);
    const [onRefreshing, setOnRefreshing] = useState(false);
    const [token, setToken] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [attachmentsDetail, setattachmentsDetail] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('logindetail').then((response) => {
            if (response != null) {
                let asynData = JSON.parse(response);
                let Data = asynData.Data;
                setToken(Data.Token);
                getClaimDetails(Data.Token);
            } else {
            }
        });
    }, []);

    const uploadImage = async () => {
        try {
            if (numAttachedFiles < 5) {
                const result = await DocumentPicker.pick({
                    type: [DocumentPicker.types.images, DocumentPicker.types.pdf], // Allow images and PDF files
                    mimeTypes: ['image/jpeg', 'image/jpg', 'application/pdf'], // Specify supported mime types
                });

                const file = result[0]; // Pick the first file (single upload)
                const formData = new FormData();
                const newAttachmentsDetail = [];
                const newAttachments = [];

                if (file.type === 'application/pdf') {
                    formData.append('FileNames', file.name);
                    formData.append('Files', {
                        uri: file.uri,
                        type: 'application/pdf',
                        name: file.name,
                    });

                    newAttachmentsDetail.push({ uri: file.uri, type: 'application/pdf', name: file.name });
                } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    formData.append('FileNames', file.name);
                    formData.append('Files', {
                        uri: file.uri,
                        type: 'image/jpeg',
                        name: file.name,
                    });

                    newAttachmentsDetail.push({ uri: file.uri, type: 'image/jpeg', name: file.name });
                } else {
                    toastMsg('Only JPEG, JPG, and PDF files are supported.');
                }

                const imageUrl = await uploadToCloud(file); // Upload the image to cloud and get the URL
                newAttachments.push(imageUrl);
                console.log("Uploaded Image URL: ", imageUrl);

                setattachmentsDetail([...attachmentsDetail, ...newAttachmentsDetail]);
                setAttachments([...attachments, ...newAttachments]);
                setNumAttachedFiles(numAttachedFiles + newAttachmentsDetail.length);
            } else {
                toastMsg('You can attach a maximum of 5 files.');
            }
        } catch (error) {
            console.error("Error picking or uploading file:", error);
        }
    };

    const uploadToCloud = async (file) => {
        console.warn('file', file);
        try {
            const formData = new FormData();
            formData.append('Token', token);
            formData.append('File', {
                uri: file.uri,
                type: file.type,
                name: file.name,
            });

            const response = await axios.post(`${BASE_URL}Blob/UploadFile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.warn('generateSasToken === response', response.data.url);
                return response.data.url;
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const getClaimDetails = async (token) => {
        let apiObj = {
            Token: token,
            ClaimId: screenId,
        };
        try {
            const res = await axios.post(BASE_URL + 'ClaimMobile/GetClientClaimDetail', apiObj);
            let response = res.data;
            if (response.Status === 'OK') {
                let Data = response.Data;
                let extraJson = response.Data.Extra;
                console.warn('detail data', Data)
                setDetailData(Data);
                setDetailExtraData(extraJson);
            } else if (response.status === 'FAILED') {
                toastMsg('Token expired. Please login again');
                await AsyncStorage.removeItem('logindetail');
                navigation.navigate('Login')
            }
        } catch (error) {
            // Handle errors
        }
    };

    const onRefresh = async () => {
        setOnRefreshing(true);
        let apiObj = {
            Token: token,
            ClaimId: screenId,
        };

        try {
            const res = await axios.post(BASE_URL + 'ClaimMobile/GetClientClaimDetail', apiObj);
            let response = res.data;

            if (response.Status === 'OK') {
                let Data = response.Data;
                let extraJson = response.Data.Extra;
                setDetailData(Data, extraJson);
                console.warn('Data', Data)
                setDetailExtraData(extraJson);
            } else if (response.status === 'FAILED') {
                toastMsg('Token expired. Please login again');
                await AsyncStorage.removeItem('logindetail');
                navigation.navigate('Login')
            }
        } catch (error) {
            // Handle errors
        } finally {
            setOnRefreshing(false);
        }
    };

    const removeFile = (index) => {
        const newAttachmentsDetail = [...attachmentsDetail];
        const newAttachments = [...attachments];

        newAttachmentsDetail.splice(index, 1);
        newAttachments.splice(index, 1);

        setattachmentsDetail(newAttachmentsDetail);
        setAttachments(newAttachments);
        setNumAttachedFiles(newAttachmentsDetail.length);
    };

    const onSubmitData = async () => {
        if (attachments.length != 0) {
            const formData = new FormData();
            formData.append(`Files`, attachments);
            formData.append('Token', token);
            formData.append('ClaimId', screenId);
            try {
                const response = await fetch(BASE_URL + APIURLMORE, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'FAILED') {
                        setIsLoading(false);
                        toastMsg('Token expired. Please login again');
                        await AsyncStorage.removeItem('logindetail');
                        navigation.navigate('Login')
                    }
                    else {
                        setIsLoading(false);
                        toastMsg('Data submit successful');
                        navigation.navigate('Home')

                    }
                }
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }
        else {
            setIsLoading(false);
            toastMsg('Please select attachment')
        }
    }

    const handlePdfDownload = (pdfUrl) => {
        Linking.openURL(pdfUrl);
    };

    const openMap = async (location) => {
        try {
            const coords = location.split('?q=')[1];
            const [lat, lng] = coords.split(',');
            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            Linking.openURL(url);
        } catch (error) {
            console.error("Error in opening map: ", error);
            toastMsg('Failed to open map');
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Header title={'Claim Detail'} />
                <ScrollView
                    style={{ marginBottom: 35 }}
                    refreshControl={
                        <RefreshControl refreshing={onRefreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={{ flexDirection: 'row', width: '100%', paddingTop: 20, paddingLeft: 20 }}>
                        <View>
                            <Text style={styles.firstTextContact}>Status: </Text>
                        </View>
                        <View>
                            <Badge style={[styles.badgeStyle, { backgroundColor: detailData.StatusColor }]}>
                                {detailData.Status}
                            </Badge>
                        </View>
                    </View>
                    {detailData.Extra &&
                        Object.entries(detailData.Extra[0]).map(([key, value]) => (
                            <View key={key} style={styles.mainViewDetail}>
                                <Text style={styles.firstTextDetailView}>{key}:</Text>
                                {key === 'Location' && value !== 'N/A' ? (
                                    <TouchableOpacity onPress={() => openMap(value)}>
                                        <Text style={[styles.firstTextDetailView2, { color: 'blue', textDecorationLine: 'underline' }]}>
                                            {String(value)}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text style={styles.firstTextDetailView2}>{String(value)}</Text>
                                )}
                            </View>
                        ))}
                    {detailData.AllowAttachment == 1 ?
                        <View style={{ width: '100%', flexDirection: 'row', marginTop: 12, marginLeft: 20 }}>
                            <TouchableOpacity onPress={uploadImage} style={{ backgroundColor: '#637381', width: '45%', borderRadius: 4, marginLeft: 0 }}>
                                <Text style={[styles.font.regular, { textAlign: 'center', padding: 13, color: 'white' }]}>More Attachment(s)</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    <View>
                        {attachmentsDetail.slice(0, 5).map((item, index) => (
                            <View key={item.name}>
                                {item.type === "application/pdf" ? (
                                    <View style={{ padding: 15 }}>
                                        <Image
                                            source={pdf}
                                            style={{ width: 70, height: 70, alignSelf: "center" }}
                                        />
                                        <Text style={{ textAlign: "center", paddingTop: 8 }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                ) : item.type === "image/jpeg" ? (
                                    <View style={{ padding: 20, }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <Image
                                                source={jpeg}
                                                style={{ width: 70, height: 70, alignSelf: "center" }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeFile(index)} // Add this line to call the removeFile function
                                                style={{ marginTop: -3 }}
                                            >
                                                <Icon color={'black'} name={"times"} size={25} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ textAlign: 'center', width: '90%' }}>{item.name}</Text>

                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text>{item.name}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                    {attachments.length != 0 ?
                        <View style={{ width: '100%', flexDirection: 'row', marginTop: 12, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={onSubmitData} style={{ backgroundColor: styles.backgroundColors.yellow, width: '45%', borderRadius: 4, marginLeft: 0 }}>
                                <Text style={{ textAlign: 'center', padding: 13, color: 'white' }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    <View style={{ width: '95%', paddingLeft: 20, paddingTop: 40 }}>
                        <Text style={styles.firstTextDetailView}>ATTACHMENTS</Text>
                    </View>
                    {detailData.Attachments &&
                        detailData.Attachments.map((item, index) => {
                            const parts = item.FileUrl.split('/');
                            const fileName = parts[parts.length - 1];
                            const fileExtension = fileName.split('.').pop().toLowerCase();
                            console.warn('File Extension:', fileExtension);
                            return (
                                <View key={index} style={{ marginTop: 20 }}>
                                    {['jpg', 'jpeg'].includes(fileExtension) ? (
                                        <Image
                                            source={{ uri: item.FileUrl }}
                                            key={index}
                                            style={styles.UploadImage}
                                        />
                                    ) : fileExtension === 'pdf' ? (
                                        <TouchableOpacity onPress={() => handlePdfDownload(item.FileUrl)}>
                                            <Image
                                                source={pdfDown}
                                                key={index}
                                                style={{
                                                    width: '50%',
                                                    height: 150,
                                                    marginLeft: 20,
                                                    marginRight: 40,
                                                    marginBottom: 20,
                                                    borderRadius: 5
                                                }}
                                            />
                                        </TouchableOpacity>
                                    ) : (
                                        <Text>Unsupported file type</Text>
                                    )}
                                </View>
                            );
                        })}
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default DetailsScreen;
