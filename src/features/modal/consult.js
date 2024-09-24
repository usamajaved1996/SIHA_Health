import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, ActivityIndicator, Image, ScrollView, TouchableWithoutFeedback } from "react-native";
import * as styles from "../../../assets/styles/styles";
import Header from "../../components/header/header";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Overlay, ListItem } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import { pdf, jpeg } from '../../../assets/images/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { toastMsg } from "../../components/toast";
import DropDownPicker from 'react-native-dropdown-picker';
import { BASE_URL, APIURL } from "../../utility/networklayer/endPoints";
import Textinput from "../../components/textinput/textinput";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';

export default function Consult() {
    const navigation = useNavigation();
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [numAttachedFiles, setNumAttachedFiles] = useState(0);
    const [attachments, setAttachments] = useState([]);
    const [attachmentsDetail, setattachmentsDetail] = useState([]);
    const [value, setValue] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openDate, setOpenDate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showDate, setShowDate] = useState('');
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [imgLoader, setImgLoader] = useState(false);
    const [filePath, setFilePath] = useState([]);
    const [loginToken, setLoginToken] = useState('');
    const [beneficiaryDataUser, setBeneficiaryDataUser] = useState('');
    const [patientName, setPatientName] = useState([]);
    const [beneficiaryId, setBeneficiaryId] = useState(null);
    const [contactNumber, setContactNumber] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [btnDisable, setBtnDisable] = useState(false);
    const [currentComplaint, setCurrentComplaint] = useState('');
    const [onSubmitLoader, setSubmitLoader] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [openPatient, setOpenPatient] = useState(false);
    const [isLoadDropDownDoctor, setIsLoadDropDownDoctor] = useState(true); // Loading state
    const [isLoadDropDownSpecialize, setIsLoadDropDownSpecialize] = useState(true); // Loading state
    const [isLoadDropDownCities, setIsLoadDropDownCities] = useState(true); // Loading state
    const [isLoadDropDownVendor, setIsLoadDropDownVendor] = useState(true); // Loading state
    const [isLoadDropDownBranch, setIsLoadDropDownBranch] = useState(true); // Loading state
    const [isLoadDropDownPlatform, setIsLoadDropDownPlatform] = useState(true); // Loading state
    const [isLoadDropDownType, setIsLoadDropDownType] = useState(true); // Loading state


    //Doctor
    const [doctor, setDoctor] = useState([]);
    const [doctorId, setDoctorId] = useState(null);
    const [openDoctor, setOpenDoctor] = useState(false);
    const [valueDoctor, setValueDoctorId] = useState(null);


    //Specialization
    const [specialize, setSpecialize] = useState([]);
    const [specializeId, setSpecializeId] = useState(null);
    const [openSpecialize, setOpenSpecialize] = useState(false);
    const [valueSpecialize, setValueSpecializeId] = useState(null);

    //Cities
    const [cities, setCities] = useState([]);
    const [CityId, setCityId] = useState(null);
    const [openCity, setOpenCity] = useState(false);
    const [valueCity, setValueCityId] = useState(null);

    // Vendor
    const [vendor, setVendor] = useState([]);
    const [vendorId, setVendorId] = useState(null);
    const [openVendor, setOpenVendor] = useState(false);
    const [valueVendor, setValueVendor] = useState(null);

    // Branch/Outlet
    const [branch, setBranch] = useState([]);
    const [branchId, setBranchId] = useState(null);
    const [openBranch, setOpenBranch] = useState(false);
    const [valueBranch, setValueBranch] = useState(null);

    // Consultation Platform
    const [platform, setPlatform] = useState([]);
    const [platformId, setPlatformId] = useState(null);
    const [openPlatform, setOpenPlatform] = useState(false);
    const [valuePlatform, setValuePlatform] = useState(null);

    // Consultation Type
    const [consultationType, setConsultationType] = useState([]);
    const [consultationTypeId, setConsultationTypeId] = useState(null);
    const [openConsultationType, setOpenConsultationType] = useState(false);
    const [valueConsultationType, setValueConsultationType] = useState(null);
    const [dropdownState, setDropdownState] = useState({
        Token: '',
        DoctorId: null,
        SpecializationId: null,
        CityId: null,
        VendorId: null,
        BranchId: null,
        ConsultationPlatformId: null,
        ConsultationTypeId: null,
    });
    const [errors, setErrors] = useState({
        patient: null,
        contactNumber: null,
        complain: null,
        visit: null,
        remarks: null,
        city: null
    });

    useEffect(() => {
        AsyncStorage.getItem('logindetail').then((response) => {
            if (response != null) {
                let asynData = JSON.parse(response);
                let Data = asynData.Data;
                let BeneficiaryData = asynData.Data.Beneficiary[0];
                let phoneNumber = asynData.Data.Beneficiary[0].BeneficiaryMobileNumber;
                setContactNumber(phoneNumber);
                setBeneficiaryDataUser(BeneficiaryData);
                setLoginToken(Data.Token);
                getPatient(Data.Token);
                setDropdownState(prevState => ({
                    ...prevState,
                    Token: Data.Token
                }));

            } else {
                setIsLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        dropDownApiCall(dropdownState.Token, '', true);
    }, [dropdownState]);

    const dropDownApiCall = (token, selectedDropdown, isLoadAll, value) => {
        if (isLoadAll) {
            getDoctorList(token);
            getSpecializeList(token);
            getCityList(token);
            getVendorList(token);
            getBranchList(token);
            getPlatformList(token);
            getConsultantTypeList(token);
        }
        if (selectedDropdown == 'doctor' && isLoadAll == false) {
            setIsLoadDropDownDoctor(true)
            setDoctorId(value)
            setDropdownState(prevState => ({
                ...prevState,
                DoctorId: value
            }));
            getSpecializeList(token);
            getCityList(token);
            getVendorList(token);
            getBranchList(token);
            getPlatformList(token);
            getConsultantTypeList(token);
        }
        if (selectedDropdown == 'specialize' && isLoadAll == false) {
            setSpecializeId(value)
            setIsLoadDropDownSpecialize(true)
            setDropdownState(prevState => ({
                ...prevState,
                SpecializationId: value
            }));
            getDoctorList(token);
            getCityList(token);
            getVendorList(token);
            getBranchList(token);
            getPlatformList(token);
            getConsultantTypeList(token);
        }
        if (selectedDropdown == 'city' && isLoadAll == false) {
            setIsLoadDropDownCities(true)
            setDropdownState(prevState => ({
                ...prevState,
                CityId: value
            }));
            setCityId(value)
            getDoctorList(token);
            getSpecializeList(token);
            getVendorList(token);
            getBranchList(token);
            getPlatformList(token);
            getConsultantTypeList(token);
        }
        if (selectedDropdown == 'vendor' && isLoadAll == false) {
            setDropdownState(prevState => ({
                ...prevState,
                VendorId: value
            }));
            setVendorId(value)
            getDoctorList(token);
            getSpecializeList(token);
            getCityList(token);
            getBranchList(token);
            getPlatformList(token);
            getConsultantTypeList(token);
        }
        if (selectedDropdown == 'branch' && isLoadAll == false) {
            setDropdownState(prevState => ({
                ...prevState,
                BranchId: value
            }));
            setBranchId(value)
            getDoctorList(token);
            getSpecializeList(token);
            getCityList(token);
            getVendorList(token);
            getPlatformList(token);
            getConsultantTypeList(token);
        }
        if (selectedDropdown == 'platform' && isLoadAll == false) {
            setDropdownState(prevState => ({
                ...prevState,
                ConsultationPlatformId: value
            }));
            setPlatformId(value)
            setConsultationTypeId(null);
            getDoctorList(token);
            getSpecializeList(token);
            getCityList(token);
            getVendorList(token);
            getBranchList(token);
            getConsultantTypeList(token);
        }
        if (selectedDropdown == 'consultant' && isLoadAll == false) {
            setConsultationTypeId(value)
            setDropdownState(prevState => ({
                ...prevState,
                ConsultationTypeId: value
            }));
            getDoctorList(token);
            getSpecializeList(token);
            getCityList(token);
            getVendorList(token);
            getBranchList(token);
            getPlatformList(token);
        }
    }
    useEffect(() => {
        if (patientName.length > 0) {
            const initialValue = patientName[0].BeneficiaryId;
            setSelectedValue(initialValue);
            setValue(initialValue); // Set the initial value for the API call
        }
    }, [patientName]);

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
    const handleOpenDropdown = (setOpenFn, isOpen) => {
        if (!isOpen) {
            setOpenPatient(false);
            setOpenCity(false);
            setOpenVendor(false);
            setOpenBranch(false);
            setOpenConsultationType(false);
            setOpenPlatform(false);
            setOpenDoctor(false);
            setOpenSpecialize(false);
        }
        setOpenFn(!isOpen);
    };

    const closeAllDropdowns = () => {
        setOpenPatient(false);
        setOpenCity(false);
        setOpenVendor(false);
        setOpenBranch(false);
        setOpenConsultationType(false);
        setOpenPlatform(false);
        setOpenDoctor(false);
        setOpenSpecialize(false);

    };
    const getDoctorList = (token) => {
        setIsLoadDropDownDoctor(true);
        axios.post(BASE_URL + 'ClaimMobile/GetAllDoctors', dropdownState)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == doctorId);
                        if (index < 0) {
                            setDoctorId(null)
                            setValueDoctorId(null)
                        }
                    }
                    setDoctor(Data);
                    setIsLoadDropDownDoctor(false)
                }
            })
            .catch(error => {
                setIsLoadDropDownDoctor(true);
            });
    }
    const getSpecializeList = (token) => {
        setIsLoadDropDownSpecialize(true)
        axios.post(BASE_URL + 'ClaimMobile/GetAllSpecializations', dropdownState)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == specializeId);
                        if (index < 0) {
                            setSpecializeId(null)
                            setValueSpecializeId(null)
                        }
                    }
                    setSpecialize(Data);
                    setIsLoadDropDownSpecialize(false)
                }
            })
            .catch(error => {
                setIsLoadDropDownSpecialize(true);
            });
    }
    const getCityList = () => {
        setIsLoadDropDownCities(true);
        axios.post(BASE_URL + 'ClaimMobile/GetAllCities', dropdownState)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == CityId);
                        if (index < 0) {
                            setCityId(null)
                            setValueCityId(null)
                        }
                    }
                    setCities(Data);
                    setIsLoadDropDownCities(false)
                }
            })
            .catch(error => {
                setIsLoadDropDownCities(true);
            });
    }
    const getVendorList = (token) => {
        console.warn('dropdownState getVendorList', dropdownState)

        setIsLoadDropDownVendor(true);
        axios.post(BASE_URL + 'ClaimMobile/GetAllVendors', dropdownState)
            .then(res => {
                let response = res.data;
                console.warn('response GetAllVendors', response)
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == vendorId);
                        if (index < 0) {
                            setVendorId(null)
                            setValueVendor(null)
                        }
                    }
                    setVendor(Data);
                    setIsLoadDropDownVendor(false)
                }
            })
            .catch(error => {
                setIsLoadDropDownVendor(true);
            });


    }
    const getBranchList = (token) => {
        setIsLoadDropDownBranch(true);
        axios.post(BASE_URL + 'ClaimMobile/GetAllBranches', dropdownState)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == branchId);
                        if (index < 0) {
                            setBranchId(null)
                            setValueBranch(null)
                        }
                    }
                    setBranch(Data);
                    setIsLoadDropDownBranch(false)
                }
            })
            .catch(error => {
                setIsLoadDropDownBranch(true);
            });
    }
    const getPlatformList = (token) => {
        console.warn('dropdownState', dropdownState)
        setIsLoadDropDownPlatform(true);
        axios.post(BASE_URL + 'ClaimMobile/GetConsultationPlatform', dropdownState)
            .then(res => {
                let response = res.data;
                console.warn('res', response)
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == platformId);
                        if (index < 0) {
                            setPlatformId(null)
                            setValuePlatform(null)
                        }
                    }
                    setPlatform(Data);
                    setIsLoadDropDownPlatform(false)
                }
            })
            .catch(error => {
                console.error('error', error)
                setIsLoadDropDownPlatform(true);
            });
    }
    const getConsultantTypeList = (token) => {
        setIsLoadDropDownType(true);
        axios.post(BASE_URL + 'ClaimMobile/GetConsultationType', dropdownState)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == consultationTypeId);
                        if (index < 0) {
                            setConsultationTypeId(null)
                            setValueConsultationType(null)
                        }
                    }
                    setConsultationType(Data);
                    setIsLoadDropDownType(false)
                }
            })
            .catch(error => {
                setIsLoadDropDownType(true);
            });
    }
    const openOverLay = () => {
        setIsVisible(true);
    };
    const hideDatePicker = () => {
        setIsVisible(false);
    };
    const handleConfirm = (date) => {
        let userSelectDate = moment(date).format('YYYY-MM-DD h:mm A');
        setShowDate(userSelectDate);
        hideDatePicker();
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
                setImagesLoaded(false)
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
    const isFieldEmpty = (value) => {
        return value === null || value === "";
    }
    const onSubmitData = async () => {
        setErrors({
            patient: null,
            contactNumber: null,
            complain: null,
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

        if (isFieldEmpty(currentComplaint)) {
            setErrors((prevErrors) => ({ ...prevErrors, complain: "Please enter complain" }));
            hasErrors = true;
        }

        // if (isFieldEmpty(showDate)) {
        //     setErrors((prevErrors) => ({ ...prevErrors, visit: "Please select a date/time" }));
        //     hasErrors = true;
        // }

        // if (isFieldEmpty(remarks)) {
        //     setErrors((prevErrors) => ({ ...prevErrors, remarks: "Please enter remarks" }));
        //     hasErrors = true;
        // }
        if (!hasErrors) {
            setBtnDisable(true); // Disable the button
            setSubmitLoader(true)
            setIsLoading(true);
            const formData = new FormData();
            formData.append(`Files`, attachments);
            formData.append('Token', loginToken);
            formData.append('ClaimTypeId', 2);
            formData.append('BenefitStructureId', 1);
            formData.append('BeneficiaryId', selectedValue);
            formData.append('CurrentComplaint', currentComplaint);
            formData.append('PatientContactNumber', contactNumber);
            formData.append('Remarks', remarks);
            formData.append('CityId', CityId);
            formData.append('PreferredDateTime', showDate);
            formData.append('DoctorId', doctorId);
            formData.append('SpecializationId', specializeId);
            formData.append('VendorId', vendorId);
            formData.append('BranchId', branchId);
            formData.append('ConsultationPlatformId', platformId);
            formData.append('ConsultationTypeId', consultationTypeId);
            formData.append('LabPlatformId', null);
            formData.append('PharmacyPlatformId', null);
            formData.append('MapUrl', '');
            console.warn('form data', formData)
            try {
                const response = await fetch(BASE_URL + APIURL, {
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
                        setSubmitLoader(false);
                        toastMsg('Token expired. Please login again');
                        await AsyncStorage.removeItem('logindetail');
                        navigation.navigate('Login')
                    }
                    else {
                        navigation.navigate('Home')
                        setIsLoading(false);
                        setSubmitLoader(false);
                        toastMsg(data.msg_text);
                    }
                }
            } catch (error) {
                setSubmitLoader(false);
                setIsLoading(false);
                setBtnDisable(false); // Disable the button
            }
        }
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
    const handleDropdown = (item, selectedDropdown) => {
        dropDownApiCall(loginToken, selectedDropdown, false, item.value)
    };
    return (
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
            <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
                <GestureHandlerRootView style={styles.container}>
                    <Header title={'Consult Doctor'} />
                    <ScrollView
                        scrollEnabled={
                            !openCity &&
                            !openVendor &&
                            !openBranch &&
                            !openPatient &&
                            !openConsultationType &&
                            !openPlatform &&
                            !openDoctor &&
                            !openSpecialize
                        }
                    >
                        {/* <KeyboardAwareScrollView> */}
                        {/* <View style={styles.container}> */}
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>PATIENT NAME</Text>
                            <DropDownPicker
                                open={openPatient}
                                value={selectedValue}
                                items={patientName.map((item) => ({
                                    label: item.InsuredName,
                                    value: item.BeneficiaryId,
                                }))}
                                setOpen={() => handleOpenDropdown(setOpenPatient, openPatient)}
                                setValue={setSelectedValue}
                                setItems={setPatientName}
                                searchable={true}
                                searchablePlaceholder="Search Patient"
                                style={[
                                    styles.dropdownConatiner,
                                    {
                                        marginBottom: openPatient ? 150 : 0,
                                        height: 50,
                                        zIndex:100000, // Ensure dropdown appears above other content
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
                            // onChangeItem={handleDropdownChange}
                            />
                            {errors.patient && <Text style={styles.errorText}>{errors.patient}</Text>}
                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>PATIENT CONTACT NUMBER</Text>
                            <Textinput
                                maxLength={11}
                                value={contactNumber}
                                onChangeText={(text) => {
                                    setContactNumber(text);
                                }}
                            />
                            {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>CURRENT COMPLAINT</Text>
                            <TextInput
                                placeholder=""
                                placeholderTextColor="#637381"
                                style={styles.remarkTextInput}
                                multiline
                                value={currentComplaint}
                                maxLength={500}
                                onChangeText={(text) => {
                                    setCurrentComplaint(text);
                                }}
                            />
                            {errors.complain && <Text style={styles.errorText}>{errors.complain}</Text>}

                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>DOCTOR</Text>
                            {isLoadDropDownDoctor ? (
                                <View style={{
                                    borderRadius: 10,
                                    borderColor: '#c4cdd5',
                                    borderWidth: 1, // Add borderWidth to make the border visible
                                    padding: 15, // Adjust padding to ensure content is properly spaced
                                    marginVertical: 10,
                                    width: '100%',
                                    justifyContent: 'center', // Center the ActivityIndicator vertically
                                    alignItems: 'center', // Center the ActivityIndicator horizontally
                                    height: 50
                                }}>
                                    <ActivityIndicator size="large" color="#1d4e77" />
                                </View>
                            ) : (
                                <DropDownPicker
                                    open={openDoctor}
                                    style={[
                                        styles.dropdownConatiner,
                                        {
                                            marginBottom: openDoctor ? 175 : 0 ,
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
                                    dropDownContainerStyle={styles.dropdownConatiner}
                                    value={valueDoctor}
                                    items={[
                                        { label: 'Please Select', value: null },
                                        ...doctor.map((item) => ({
                                            label: item.value,
                                            value: item.id,
                                        })),
                                    ]}
                                    searchable={true}
                                    searchablePlaceholder="Search Doctor"
                                    setOpen={() => handleOpenDropdown(setOpenDoctor, openDoctor)}
                                    setValue={setValueDoctorId}
                                    setItems={setDoctor}
                                    placeholder={'Please Select'}
                                    onChangeItem={(item) => {
                                        setValueDoctor(item.value);
                                    }}
                                    onSelectItem={(item) => {
                                        handleDropdown(item, 'doctor');
                                    }}
                                />
                            )}
                            {/* {errors.city && <Text style={styles.errorText}>{errors.city}</Text>} */}
                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>SPECIALIZATION</Text>
                            {isLoadDropDownSpecialize ? (
                                <View style={{
                                    borderRadius: 10,
                                    borderColor: '#c4cdd5',
                                    borderWidth: 1, // Add borderWidth to make the border visible
                                    padding: 15, // Adjust padding to ensure content is properly spaced
                                    marginVertical: 10,
                                    width: '100%',
                                    justifyContent: 'center', // Center the ActivityIndicator vertically
                                    alignItems: 'center', // Center the ActivityIndicator horizontally
                                    height: 50
                                }}>
                                    <ActivityIndicator size="large" color="#1d4e77" />
                                </View>
                            ) : (
                                <DropDownPicker
                                    open={openSpecialize}
                                    style={[
                                        styles.dropdownConatiner,
                                        {
                                            marginBottom: openSpecialize ? 200 : 0,
                                            height: 50,
                                            // zIndex: 1000, // Ensure dropdown appears above other content
                                        },
                                    ]}
                                    ArrowDownIconComponent={({ style }) => (
                                        <Icon name={'angle-down'} color={'grey'} size={22} />
                                    )}
                                    ArrowUpIconComponent={({ style }) => (
                                        <Icon name={'angle-up'} color={'grey'} size={22} />
                                    )}
                                    placeholderStyle={styles.placeholderStyle}
                                    dropDownContainerStyle={styles.dropdownConatiner}
                                    value={valueSpecialize}
                                    items={[
                                        { label: 'Please Select', value: null },
                                        ...specialize.map((item) => ({
                                            label: item.value,
                                            value: item.id,
                                        }))
                                    ]}
                                    searchable={true}
                                    searchablePlaceholder="Search City"
                                    setOpen={() => handleOpenDropdown(setOpenSpecialize, openSpecialize)}
                                    setValue={setValueSpecializeId}
                                    setItems={setSpecializeId}
                                    placeholder={'Please Select'}
                                    onChangeItem={(item) => {
                                        setSpecializeId(item.value);
                                    }}
                                    onSelectItem={(item) => {
                                        handleDropdown(item, 'specialize');
                                    }}
                                />
                            )}
                            {/* {errors.city && <Text style={styles.errorText}>{errors.city}</Text>} */}
                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>CITY</Text>
                            {isLoadDropDownCities ? (
                                <View style={{
                                    borderRadius: 10,
                                    borderColor: '#c4cdd5',
                                    borderWidth: 1, // Add borderWidth to make the border visible
                                    padding: 15, // Adjust padding to ensure content is properly spaced
                                    marginVertical: 10,
                                    width: '100%',
                                    justifyContent: 'center', // Center the ActivityIndicator vertically
                                    alignItems: 'center', // Center the ActivityIndicator horizontally
                                    height: 50

                                }}>
                                    <ActivityIndicator size="large" color="#1d4e77" />
                                </View>
                            ) : (
                                <DropDownPicker
                                    open={openCity}
                                    // style={styles.dropdown}
                                    style={[
                                        styles.dropdownConatiner,
                                        {
                                            marginBottom: openCity ? 200 : 0,
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
                                    dropDownContainerStyle={styles.dropdownConatiner}
                                    value={valueCity}
                                    items={[
                                        { label: 'Please Select', value: null },
                                        ...cities.map((item) => ({
                                            label: item.value,
                                            value: item.id,
                                        }))
                                    ]}
                                    searchable={true}
                                    searchablePlaceholder="Search City"
                                    setOpen={() => handleOpenDropdown(setOpenCity, openCity)}
                                    setValue={setValueCityId}
                                    setItems={setCityId}
                                    placeholder={'Select City'}
                                    onChangeItem={(item) => {
                                        setCityId(item.value);
                                    }}
                                    onSelectItem={(item) => {
                                        handleDropdown(item, 'city');
                                    }}
                                />
                            )}
                            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>VENDOR</Text>
                            {isLoadDropDownVendor ? (
                                <View style={{
                                    borderRadius: 10,
                                    borderColor: '#c4cdd5',
                                    borderWidth: 1, // Add borderWidth to make the border visible
                                    padding: 15, // Adjust padding to ensure content is properly spaced
                                    marginVertical: 10,
                                    width: '100%',
                                    justifyContent: 'center', // Center the ActivityIndicator vertically
                                    alignItems: 'center', // Center the ActivityIndicator horizontally
                                    height: 50

                                }}>
                                    <ActivityIndicator size="large" color="#1d4e77" />
                                </View>
                            ) : (
                                <DropDownPicker
                                    open={openVendor}
                                    style={[
                                        styles.dropdownConatiner,
                                        {
                                            marginBottom: openVendor ? 160 : 0,
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
                                    dropDownContainerStyle={styles.dropdownConatiner}
                                    value={valueVendor}
                                    items={[
                                        { label: 'Please Select', value: null },
                                        ...vendor.map((item) => ({
                                            label: item.value,
                                            value: item.id,
                                        }))
                                    ]}
                                    searchable={true}
                                    searchablePlaceholder="Please Select"
                                    setOpen={() => handleOpenDropdown(setOpenVendor, openVendor)}
                                    setValue={setValueVendor}
                                    setItems={setVendorId}
                                    placeholder={'Please Select'}
                                    onChangeItem={(item) => {
                                        setVendorId(item.value);
                                    }}
                                    onSelectItem={(item) => {
                                        handleDropdown(item, 'vendor');
                                    }}
                                />
                            )}
                            {/* {errors.city && <Text style={styles.errorText}>{errors.city}</Text>} */}
                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>BRANCH/OUTLET</Text>
                            {isLoadDropDownBranch ? (
                                <View style={{
                                    borderRadius: 10,
                                    borderColor: '#c4cdd5',
                                    borderWidth: 1, // Add borderWidth to make the border visible
                                    padding: 15, // Adjust padding to ensure content is properly spaced
                                    marginVertical: 10,
                                    width: '100%',
                                    justifyContent: 'center', // Center the ActivityIndicator vertically
                                    alignItems: 'center', // Center the ActivityIndicator horizontally
                                    height: 50

                                }}>
                                    <ActivityIndicator size="large" color="#1d4e77" />
                                </View>
                            ) : (
                                <DropDownPicker
                                    open={openBranch}
                                    style={[
                                        styles.dropdownConatiner,
                                        {
                                            marginBottom: openBranch ? 160 : 0,
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
                                    dropDownContainerStyle={styles.dropdownConatiner}
                                    value={valueBranch}
                                    items={[
                                        { label: 'Please Select', value: null },
                                        ...branch.map((item) => ({
                                            label: item.value,
                                            value: item.id,
                                        }))
                                    ]}
                                    searchable={true}
                                    searchablePlaceholder="Please Select"
                                    setOpen={() => handleOpenDropdown(setOpenBranch, openBranch)}
                                    setValue={setValueBranch}
                                    setItems={setBranchId}
                                    placeholder={'Please Select'}
                                    onChangeItem={(item) => {
                                        setBranch(item.value);
                                    }}
                                    onSelectItem={(item) => {
                                        handleDropdown(item, 'branch');
                                    }}
                                />
                            )}
                            {/* {errors.city && <Text style={styles.errorText}>{errors.city}</Text>} */}
                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>CONSULTATION PLATFORM</Text>
                            {isLoadDropDownPlatform ? (
                                <View style={{
                                    borderRadius: 10,
                                    borderColor: '#c4cdd5',
                                    borderWidth: 1, // Add borderWidth to make the border visible
                                    padding: 15, // Adjust padding to ensure content is properly spaced
                                    marginVertical: 10,
                                    width: '100%',
                                    justifyContent: 'center', // Center the ActivityIndicator vertically
                                    alignItems: 'center', // Center the ActivityIndicator horizontally
                                    height: 50

                                }}>
                                    <ActivityIndicator size="large" color="#1d4e77" />
                                </View>
                            ) : (
                                <DropDownPicker
                                    open={openPlatform}
                                    style={[
                                        styles.dropdownConatiner,
                                        {
                                            marginBottom: openPlatform ? 160 : 0,
                                            height: 50,
                                            // zIndex: 1000, // Ensure dropdown appears above other content

                                        },
                                    ]}
                                    ArrowDownIconComponent={({ style }) => (
                                        <Icon name={'angle-down'} color={'grey'} size={22} />
                                    )}
                                    ArrowUpIconComponent={({ style }) => (
                                        <Icon name={'angle-up'} color={'grey'} size={22} />
                                    )}
                                    placeholderStyle={styles.placeholderStyle}
                                    dropDownContainerStyle={styles.dropdownConatiner}
                                    value={valuePlatform}
                                    items={[
                                        { label: 'Please Select', value: null },
                                        ...platform.map((item) => ({
                                            label: item.value,
                                            value: item.id,
                                        }))
                                    ]}
                                    searchable={true}
                                    searchablePlaceholder="Please Select"
                                    setOpen={() => handleOpenDropdown(setOpenPlatform, openPlatform)}
                                    setValue={setValuePlatform}
                                    setItems={setPlatformId}
                                    placeholder={'Please Select'}
                                    onChangeItem={(item) => {
                                        setPlatformId(item.value);
                                    }}
                                    onSelectItem={(item) => {
                                        handleDropdown(item, 'platform');
                                    }}
                                />
                            )}
                            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                        </View>
                        {platformId != null ?
                            <View style={styles.mainView}>
                                <Text style={styles.subText}>CONSULTATION TYPE</Text>
                                {isLoadDropDownType ? (
                                    <View style={{
                                        borderRadius: 10,
                                        borderColor: '#c4cdd5',
                                        borderWidth: 1, // Add borderWidth to make the border visible
                                        padding: 15, // Adjust padding to ensure content is properly spaced
                                        marginVertical: 10,
                                        width: '100%',
                                        justifyContent: 'center', // Center the ActivityIndicator vertically
                                        alignItems: 'center', // Center the ActivityIndicator horizontally
                                        height: 50

                                    }}>
                                        <ActivityIndicator size="large" color="#1d4e77" />
                                    </View>
                                ) : (
                                    <DropDownPicker
                                        open={openConsultationType}
                                        style={[
                                            styles.dropdownConatiner,
                                            {
                                                marginBottom: openConsultationType ? 160 : 10,
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
                                        dropDownContainerStyle={styles.dropdownConatiner}
                                        value={valueConsultationType}
                                        items={[
                                            { label: 'Please Select', value: null },
                                            ...consultationType.map((item) => ({
                                                label: item.value,
                                                value: item.id,
                                            }))
                                        ]}
                                        searchable={true}
                                        searchablePlaceholder="Please Select"
                                        setOpen={() => handleOpenDropdown(setOpenConsultationType, openConsultationType)}
                                        setValue={setValueConsultationType}
                                        setItems={setConsultationTypeId}
                                        placeholder={'Please Select'}
                                        onChangeItem={(item) => {
                                            setConsultationTypeId(item.value);
                                        }}
                                        onSelectItem={(item) => {
                                            handleDropdown(item, 'consultant');
                                        }}
                                    />
                                )}
                                {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                            </View>
                            :
                            null}
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>PREFERRED DATE & TIME</Text>
                            <TouchableOpacity onPress={openOverLay}>
                                <View style={{
                                    width: "100%",
                                    height: 50,
                                    borderWidth: 0.6,
                                    borderColor: styles.borderColors.dropdownBorder,
                                    paddingLeft: 10,
                                    color: styles.fontColors.black,
                                    marginTop: 10
                                }}>
                                    <Text style={{ padding: 6, color: styles.fontColors.grey, paddingTop: 15 }}>{showDate} </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.modalView}>
                                <View style={{ flexDirection: 'row', marginTop: 0, alignSelf: 'center' }}>
                                    <DateTimePickerModal
                                        date={selectedDate}
                                        isVisible={isVisible}
                                        mode="datetime"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                    />
                                </View>
                            </View>
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
                            {/* {errors.remarks && <Text style={styles.errorText}>{errors.remarks}</Text>} */}
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
                        {/* </View> */}
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
                        {/* </KeyboardAwareScrollView> */}
                    </ScrollView>
                </GestureHandlerRootView>
            </SafeAreaView>
         </TouchableWithoutFeedback>
    );
}
