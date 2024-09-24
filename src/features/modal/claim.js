import React, { useState, useEffect } from "react";
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";
import * as styles from "../../../assets/styles/styles";
import Header from "../../components/header/header";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import { pdf, jpeg } from '../../../assets/images/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { toastMsg } from "../../components/toast";
import DropDownPicker from 'react-native-dropdown-picker';
import { BASE_URL, APIURL } from "../../utility/networklayer/endPoints";
import Textinput from "../../components/textinput/textinput";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { BlobServiceClient } from "@azure/storage-blob";
import 'react-native-get-random-values';

function Claim() {
    const navigation = useNavigation();
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [numAttachedFiles, setNumAttachedFiles] = useState(0);
    const [attachments, setAttachments] = useState([]);
    const [attachmentsDetail, setattachmentsDetail] = useState([]);
    const [value, setValue] = useState(null);
    const [onSubmitLoader, setSubmitLoader] = useState(false);
    const [loginToken, setLoginToken] = useState('');
    const [beneficiaryDataUser, setBeneficiaryDataUser] = useState('');
    const [patientName, setPatientName] = useState([]);
    const [BeneficiaryId, setBeneficiaryId] = useState(null);
    const [contactNumber, setContactNumber] = useState(null);
    const [pharmacyAmount, setPharmacyAmount] = useState('');
    const [consultantAmount, setConsultantAmount] = useState('');
    const [labAmount, setLabAmount] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [openPatient, setOpenPatient] = useState(false);
    const [btnDisable, setBtnDisable] = useState(false);

    const [errors, setErrors] = useState({
        patient: null,
        contactNumber: null,
        testName: null,
        visit: null,
        remarks: null,
        city: null
    });
    useEffect(() => {
        AsyncStorage.getItem('logindetail').then((response) => {
            if (response != null) {
                let asynData = JSON.parse(response)
                let Data = asynData.Data
                let BeneficiaryData = asynData.Data.Beneficiary[0]
                let phoneNumber = asynData.Data.Beneficiary[0].BeneficiaryMobileNumber;
                setContactNumber(phoneNumber)
                setLoginToken(Data.Token);
                setBeneficiaryDataUser(BeneficiaryData);
                getPatient(Data.Token);
            } else {
                setIsLoading(false);
            }
        });
    }, []);
    useEffect(() => {
        if (patientName.length > 0) {
            const initialValue = patientName[0].BeneficiaryId;
            setSelectedValue(initialValue);
            setValue(initialValue); // Set the initial value for the API call
        }
    }, [patientName]);
    useEffect(() => {
        // Calculate the total whenever there's a change in pharmacyAmount, consultantAmount, or labAmount
        sumOfTotalAmount();
    }, [pharmacyAmount, consultantAmount, labAmount]);
    const sumOfTotalAmount = () => {
        const num1 = parseFloat(pharmacyAmount) || 0;
        const num2 = parseFloat(consultantAmount) || 0;
        const num3 = parseFloat(labAmount) || 0;
        const totalSum = num1 + num2 + num3;
        setTotalAmount(totalSum);
    }
    const getPatient = async (token) => {
        let apiObj = {
            Token: token,
        };
        try {
            const res = await axios.post(BASE_URL + 'ClaimMobile/GetAllPatients', apiObj);
            let response = res.data;
            setIsLoading(false);
            if (response.Status === 'OK') {
                let asynData = response;
                let Data = asynData.Data;
                setPatientName(Data);
            }
            else {
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
        }
    };
    const uploadImage = async () => {
        setImagesLoaded(true)
        try {
            if (numAttachedFiles < 5) {
                const result = await DocumentPicker.pick({
                    type: [DocumentPicker.types.images, DocumentPicker.types.pdf], // Allow images and PDF files
                    mimeTypes: ['image/jpeg', 'image/jpg', 'application/pdf'], // Specify supported mime types
                    allowMultiSelection: true,
                    multiple: 5 - numAttachedFiles, // Limit selection to the remaining available slots
                });

                const newAttachmentsDetail = [];
                const newAttachments = [];

                for (const file of result) {
                    if (
                        file.type === 'application/pdf' ||
                        file.type === 'image/jpeg' ||
                        file.type === 'image/jpg'
                    ) {
                        newAttachmentsDetail.push({
                            uri: file.uri,
                            type: file.type,
                            name: file.name
                        });

                        const imageUrl = await uploadToCloud(file); // Upload the image to cloud and get the URL
                        newAttachments.push(imageUrl);
                    } else {
                        toastMsg('Only JPEG, JPG, and PDF files are supported.');
                    }
                }
                setattachmentsDetail([...attachmentsDetail, ...newAttachmentsDetail]);
                setAttachments([...attachments, ...newAttachments]);
                setNumAttachedFiles(numAttachedFiles + newAttachmentsDetail.length);
                setImagesLoaded(false)

            } else {
                toastMsg('You can attach a maximum of 5 files.');
            }
        } catch (error) {
            console.error('Error picking or uploading file:', error);
            setImagesLoaded(false)

        }
    };
    const uploadToCloud = async (file) => {
        try {
            let apiObj = {
                Token: loginToken,
                FileExtension: file.type
            };
            let sasTokenResponse = await axios.post(`${BASE_URL}/Blob/GenerateSasToken`, apiObj);
            let sasUrl = sasTokenResponse.data.sasUri;
            let blobUrl = sasTokenResponse.data.blobUrl;

            const response = await fetch(sasUrl, {
                method: 'PUT',
                headers: {
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': file.type,
                },
                body: file,
            });

            if (response.status === 201) {
                return blobUrl;
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };
    const onSubmitData = async () => {
        setErrors({
            patient: null,
            contactNumber: null,
            testName: null,
            visit: null,
            remarks: null,
            city: null
        });
        let hasErrors = false;

        if (isFieldEmpty(value)) {
            setErrors((prevErrors) => ({ ...prevErrors, patient: "Please select a patient" }));
            hasErrors = true;
        }
        if (isFieldEmpty(contactNumber)) {
            setErrors((prevErrors) => ({ ...prevErrors, contactNumber: "Please enter a contact number" }));
            hasErrors = true;
        } else if (contactNumber.length < 11) {
            setErrors((prevErrors) => ({ ...prevErrors, contactNumber: "Contact number should not exceed 11 digits" }));
            hasErrors = true;
        }
        if (isFieldEmpty(pharmacyAmount)) {
            setErrors((prevErrors) => ({ ...prevErrors, testName: "Please enter amount" }));
            hasErrors = true;
        }
        if (isFieldEmpty(consultantAmount)) {
            setErrors((prevErrors) => ({ ...prevErrors, visit: "Please enter amount" }));
            hasErrors = true;
        }
        if (isFieldEmpty(labAmount)) {
            setErrors((prevErrors) => ({ ...prevErrors, remarks: "Please enter amount" }));
            hasErrors = true;
        }
        if (!hasErrors) {
            setBtnDisable(true); // Disable the button
            setIsLoading(true);
            setSubmitLoader(true)
            if (attachments.length != 0) {
                console.warn('attachments', attachments)
                const formData = new FormData();
                formData.append(`Files`, attachments);
                formData.append('Token', loginToken);
                formData.append('ClaimTypeId', 1);
                formData.append('BenefitStructureId', 0);
                formData.append('BeneficiaryId', selectedValue);
                formData.append('ClaimRequestedPharmacyAmount', pharmacyAmount);
                formData.append('ClaimRequestedConsultationAmount', consultantAmount);
                formData.append('ClaimRequestedLabAmount', labAmount);
                formData.append('ClaimRequestedTotalAmount', totalAmount);
                formData.append('PatientContactNumber', contactNumber);
                formData.append('Remarks', remarks);
                console.warn('formData for claim', formData)
                try {
                    const response = await fetch(BASE_URL + APIURL, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    if (response.ok) {
                        const data = await response.json();
                        console.warn('data', data)
                        if (data.status === 'FAILED') {
                            setIsLoading(false);
                            setSubmitLoader(false)
                            toastMsg('Token expired. Please login again');
                            await AsyncStorage.removeItem('logindetail');
                            navigation.navigate('Login')
                        }
                        else {
                            navigation.navigate('Home')
                            setIsLoading(false);
                            setSubmitLoader(false)
                            toastMsg(data.msg_text);
                        }
                    }
                } catch (error) {
                    setIsLoading(false);
                    setSubmitLoader(false)
                }
            }
            else {
                setIsLoading(false);
                setSubmitLoader(false)
                setBtnDisable(false); // Disable the button
                toastMsg('Please select attachment')
            }
        }
    };
    const isFieldEmpty = (value) => {
        return value === null || value === "";
    }
    const removeFile = (index) => {
        const newAttachmentsDetail = [...attachmentsDetail];
        const newAttachments = [...attachments];

        newAttachmentsDetail.splice(index, 1);
        newAttachments.splice(index, 1);

        setattachmentsDetail(newAttachmentsDetail);
        setAttachments(newAttachments);
        setNumAttachedFiles(newAttachmentsDetail.length);
    }
    const handleDropdownChange = (item) => {
        setSelectedValue(item.value);
        // setOpenPatient(false); // Close the dropdown
    };
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
            <GestureHandlerRootView style={styles.container}>
                <Header title={'New Claim'} />
                <ScrollView
                    scrollEnabled={
                        !openPatient 
                    }
                >
                    <View style={styles.mainView}>
                        <Text style={styles.subText}>PATIENT NAME</Text>
                        <DropDownPicker
                            open={openPatient}
                            value={selectedValue}
                            items={patientName.map((item) => ({
                                label: item.InsuredName,
                                value: item.BeneficiaryId,
                            }))}
                            setOpen={setOpenPatient}
                            setValue={setSelectedValue}
                            setItems={setPatientName}
                            searchable={true}
                            searchablePlaceholder="Search Patient"
                            style={[
                                styles.dropdownConatiner,
                                {
                                    marginBottom: openPatient ? 130 : 0,
                                    height: 50,
                                    zIndex: 1000, // Ensure dropdown appears above other content

                                },
                            ]}
                            ArrowDownIconComponent={({ style }) => (
                                <Icon name={'angle-down'} color={'grey'} size={22} />
                            )}
                            ArrowUpIconComponent={({ style }) => (
                                <Icon name={'angle-up'} color={'grey'} size={22} />
                            )}
                            placeholderStyle={styles.placeholderStyle}
                            // dropDownContainerStyle={styles.dropdownConatiner}
                            dropDownMaxHeight={10000} // Set the same value as maxHeight for compatibility           
                            onChangeItem={handleDropdownChange}
                        />
                        {errors.patient && <Text style={styles.errorText}>{errors.patient}</Text>}
                    </View>
                    <View style={styles.mainView}>
                        <Text style={styles.subText}>PATIENT CONTACT NUMBER</Text>
                        <Textinput
                            maxLength={11}
                            value={contactNumber}
                            onChangeText={(text) => setContactNumber(text)}

                        />
                        {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}
                    </View>
                    {beneficiaryDataUser.AllowPharmacy = 1 ? (
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>PHARMACY</Text>
                            <Textinput
                                placeholder="Amount"
                                maxLength={10}
                                value={pharmacyAmount}
                                onChangeText={(text) => {
                                    setPharmacyAmount(text);
                                    sumOfTotalAmount();
                                }}
                            />

                            {errors.testName && <Text style={styles.errorText}>{errors.testName}</Text>}
                        </View>
                    ) : null}
                    {beneficiaryDataUser.AllowConsultations = 1 ? (
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>CONSULTATION</Text>
                            <Textinput
                                placeholder="Amount"
                                maxLength={10}
                                value={consultantAmount}
                                onChangeText={(text) => {
                                    setConsultantAmount(text);
                                    sumOfTotalAmount();
                                }}
                            />

                            {errors.visit && <Text style={styles.errorText}>{errors.visit}</Text>}
                        </View>
                    ) : null}
                    {beneficiaryDataUser.AllowLabs = 1 ? (
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>LAB</Text>
                            <Textinput
                                placeholder="Amount"
                                maxLength={10}
                                value={labAmount}
                                onChangeText={(text) => {
                                    setLabAmount(text);
                                    sumOfTotalAmount();
                                }}
                            />
                            {errors.remarks && <Text style={styles.errorText}>{errors.remarks}</Text>}

                        </View>
                    ) : null}
                    <View style={styles.mainView}>
                        <Text style={styles.subText}>TOTAL</Text>
                        <TextInput
                            placeholderTextColor="#637381"
                            style={styles.claimFormTextInput}
                            value={totalAmount.toString()}
                            editable={false}
                            selectTextOnFocus={false}
                        />
                    </View>
                    <View style={styles.mainView}>
                        <Text style={styles.subText}>REMARKS</Text>
                        <TextInput
                            placeholder=""
                            placeholderTextColor="#637381"
                            style={styles.remarkTextInput}
                            multiline
                            value={remarks}
                            maxLength={500}
                            onChangeText={(text) => {
                                setRemarks(text);
                            }}
                        />
                    </View>
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
                    {imagesLoaded && // Display loader if images are not loaded
                        <ActivityIndicator size="large" color={"#1d4e77"} style={{ marginTop: 15, marginBottom: 15 }} />
                    }
                    {onSubmitLoader ?
                        <ActivityIndicator size="large" color={"#1d4e77"} />
                        :
                        <View style={{ width: '100%', flexDirection: 'row', marginTop: 0, marginBottom: 10, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => uploadImage()} style={{ backgroundColor: '#637381', width: '40%', borderRadius: 4, height: 55 }}>
                                <Text style={[styles.font.bold, { textAlign: 'center', padding: 16, color: 'white' }]}>Attachment(s)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onSubmitData()} style={{ backgroundColor: styles.backgroundColors.yellow, width: '40%', borderRadius: 4, marginLeft: 30 }} >
                                <Text style={[styles.font.bold, { textAlign: 'center', padding: 16, color: 'white' }]}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ScrollView>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}
export default Claim;
