import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, SafeAreaView, ActivityIndicator, Image, TouchableOpacity, FlatList, ScrollView, TouchableWithoutFeedback,
} from "react-native";
import * as styles from "../../../assets/styles/styles";
import Header from "../../components/header/header";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
const Appointment = ({ route }) => {
    const [address, setAddress] = useState('');
    useEffect(() => {
        if (route.params?.address && route.params?.googleMapsUrl) {
            setAddress(route.params.address);
            setLocation(route.params.googleMapsUrl)
            console.warn('address', address, 'googleMapsUrl', location)
        }
    }, [route.params?.address, route.params?.googleMapsUrl]);
    const navigation = useNavigation();
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [isLoadingScreen, setIsLoadingScreen] = useState(true); // Add a new state for screen loading
    const [openPatient, setOpenPatient] = useState(false);
    const [numAttachedFiles, setNumAttachedFiles] = useState(0);
    const [attachments, setAttachments] = useState([]);
    const [attachmentsDetail, setattachmentsDetail] = useState([]);
    const [valuePatient, setValuePatientId] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDate, setShowDate] = useState('');
    const [loginToken, setLoginToken] = useState('');
    const [beneficiaryDataUser, setBeneficiaryDataUser] = useState('');
    const [patientName, setPatientName] = useState([]);
    const [BeneficiaryId, setBeneficiaryId] = useState(null);
    const [contactNumber, setContactNumber] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [onSubmitLoader, setSubmitLoader] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [testName, setTestName] = useState('');
    const [btnDisable, setBtnDisable] = useState(false);
    const [delievryAddress, setDelievryAddress] = useState("");
    const [location, setLocation] = useState("");
    const [value, setValue] = useState(null);

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

    //Visit
    const [VisitId, setVisitId] = useState(null);
    const [visit, setVisit] = useState(null);
    const [openVisit, setOpenVisit] = useState(false);
    const [valueVisit, setValueVisitId] = useState(null);

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
    const [isLoadDropDownVisit, setIsLoadDropDownVisit] = useState(true); // Loading state
    const [isLoadDropDownCities, setIsLoadDropDownCities] = useState(true); // Loading state
    const [isLoadDropDownVendor, setIsLoadDropDownVendor] = useState(true); // Loading state
    const [isLoadDropDownBranch, setIsLoadDropDownBranch] = useState(true); // Loading state
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
                let asynData = JSON.parse(response);
                let Data = asynData.Data;
                let BeneficiaryData = asynData.Data.Beneficiary[0];
                let phoneNumber = asynData.Data.Beneficiary[0].BeneficiaryMobileNumber;
                setLoginToken(Data.Token);
                setBeneficiaryDataUser(BeneficiaryData);
                getPatient(Data.Token);
                setContactNumber(phoneNumber);
                getVisitList(Data.Token)
                setDropdownState(prevState => ({
                    ...prevState,
                    Token: Data.Token
                }));
            } else {
                setIsLoadingScreen(false); // Set isLoadingScreen to false when data fetching is complete
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
    const getPatient = (token) => {
        let apiObj = {
            Token: token,
        };
        axios.post(BASE_URL + 'ClaimMobile/GetAllPatients', apiObj)
            .then(res => {
                let response = res.data;
                setIsLoadingScreen(false); // Set isLoadingScreen to false when data fetching is complete
                if (response.Status == 'OK') {
                    let asynData = response;
                    let Data = asynData.Data;
                    setPatientName(Data);
                }
            })
            .catch(error => {
                setIsLoadingScreen(false); // Set isLoadingScreen to false in case of an error
            });
    }
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
        // Reset errors
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

        if (isFieldEmpty(testName)) {
            setErrors((prevErrors) => ({ ...prevErrors, testName: "Please enter lab test names" }));
            hasErrors = true;
        }

        if (isFieldEmpty(valueVisit)) {
            setErrors((prevErrors) => ({ ...prevErrors, visit: "Please select a visit type" }));
            hasErrors = true;
        }

        // if (isFieldEmpty(remarks)) {
        //     setErrors((prevErrors) => ({ ...prevErrors, remarks: "Please enter address/remarks" }));
        //     hasErrors = true;
        // }

        if (isFieldEmpty(valueCity)) {
            setErrors((prevErrors) => ({ ...prevErrors, city: "Please select a city" }));
            hasErrors = true;
        }
        if (!hasErrors) {
            console.warn('attachm,e ng', attachments)
            // Continue with the form submission
            setBtnDisable(true); // Disable the button
            setSubmitLoader(true)
            setIsLoadingScreen(false); // Set isLoadingScreen to false when data fetching is complete
            if (!hasErrors) {
                const formData = new FormData();
                formData.append(`Files`, attachments);
                formData.append('Token', loginToken);
                formData.append('ClaimTypeId', 2);
                formData.append('BenefitStructureId', 3);
                formData.append('BeneficiaryId', selectedValue);
                formData.append('PatientContactNumber', contactNumber);
                formData.append('LabTestNames', testName);
                formData.append('VisitId', valueVisit);
                formData.append('DeliveryAddress', remarks);
                formData.append('CityId', CityId);
                formData.append('PreferredDateTime', showDate);
                formData.append('DoctorId', null);
                formData.append('SpecializationId', null);
                formData.append('VendorId', vendorId);
                formData.append('BranchId', branchId);
                formData.append('ConsultationPlatformId', null);
                formData.append('ConsultationTypeId', null);
                formData.append('LabPlatformId', VisitId);
                formData.append('PharmacyPlatformId', null);
                formData.append('MapUrl', location);
                console.warn('formData for aappointment', formData)
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
                        console.warn('data', data)
                        if (data.status === 'FAILED') {
                            setIsLoadingScreen(false); // Set isLoadingScreen to false when data fetching is complete
                            setSubmitLoader(false)
                            toastMsg('Token expired. Please login again');
                            await AsyncStorage.removeItem('logindetail');
                            navigation.navigate('Login')
                        }
                        else {
                            navigation.navigate('Home')
                            setIsLoadingScreen(false); // Set isLoadingScreen to false when data fetching is complete
                            setSubmitLoader(false)
                            toastMsg(data.msg_text);
                        }
                    }
                } catch (error) {
                    setIsLoadingScreen(false); // Set isLoadingScreen to false when data fetching is complete
                    setSubmitLoader(false)
                    setBtnDisable(false); // Disable the button
                }
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
    const openOverLay = () => {
        setIsVisible(true);
    };
    const hideDatePicker = () => {
        setIsVisible(false);
    };
    const handleConfirm = (date) => {
        let userSelectDate = moment(date).format('YYYY-MM-DD h:mm A');
        console.warn('userSelectDate', userSelectDate)
        setShowDate(userSelectDate);
        hideDatePicker();
    };
    useEffect(() => {
        dropDownApiCall(dropdownState.Token, '', true);
    }, [dropdownState]);
    const dropDownApiCall = (token, selectedDropdown, isLoadAll, value) => {
        console.warn(VisitId, 'token, selectedDropdown, isLoadAll, value', token, selectedDropdown, isLoadAll, value)
        if (isLoadAll) {
            console.warn('isLoadAll all dropdown')
            getCityList(token);
            getVendorList(token);
            getBranchList(token);
        }
        if (selectedDropdown == 'city' && isLoadAll == false) {
            console.warn('city')
            setIsLoadDropDownCities(true)
            setDropdownState(prevState => ({
                ...prevState,
                CityId: value
            }));
            setCityId(value)
            getVendorList(token);
            getBranchList(token);
        }
        if (selectedDropdown == 'vendor' && isLoadAll == false) {
            console.warn('vendor')
            setDropdownState(prevState => ({
                ...prevState,
                VendorId: value
            }));
            setVendorId(value)
            getCityList(token);
            getBranchList(token);
        }
        if (selectedDropdown == 'branch' && isLoadAll == false) {
            console.warn('branch')
            setDropdownState(prevState => ({
                ...prevState,
                BranchId: value
            }));
            setBranchId(value)
            getCityList(token);
            getVendorList(token);
        }
    }

    const handleOpenDropdown = (setOpenFn, isOpen) => {
        if (!isOpen) {
            setOpenPatient(false);
            setOpenCity(false);
            setOpenVendor(false);
            setOpenBranch(false);
            setOpenVisit(false);
        }
        setOpenFn(!isOpen);
    };

    const closeAllDropdowns = () => {
        setOpenPatient(false);
        setOpenCity(false);
        setOpenVendor(false);
        setOpenBranch(false);
        setOpenVisit(false);
    };
    const getVisitList = (token) => {
        setIsLoadDropDownVisit(true);
        let apiObj = {
            Token: token,
        };
        axios.post(BASE_URL + 'ClaimMobile/GetLabPlatform', apiObj)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == VisitId);
                        console.warn('index', index, Data)
                        if (index < 0) {
                            setVisitId(null)
                            setValueVisitId(null)
                        }
                    }
                    setVisit(Data);
                    setIsLoadDropDownVisit(false)
                }
            })
            .catch(error => {
                setIsLoadDropDownVisit(true);
            });
    }
    const getCityList = () => {
        setIsLoadDropDownCities(true);
        console.warn('GetAllCities', dropdownState)
        axios.post(BASE_URL + 'ClaimMobile/GetAllCities', dropdownState)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == CityId);
                        console.warn('index', index, Data)
                        if (index < 0) {
                            console.warn('setCityId', CityId, valueCity)
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
    const getVendorList = () => {
        setIsLoadDropDownVendor(true);
        console.warn('GetAllVendors', dropdownState)
        axios.post(BASE_URL + 'ClaimMobile/GetAllVendors', dropdownState)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == vendorId);
                        console.warn('index', index, Data)
                        if (index < 0) {
                            console.warn('setVendorId', vendorId, valueVendor)
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
    const getBranchList = () => {
        console.warn('GetAllBranches', dropdownState)
        setIsLoadDropDownBranch(true);
        axios.post(BASE_URL + 'ClaimMobile/GetAllBranches', dropdownState)
            .then(res => {
                let response = res.data;
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == branchId);
                        console.warn('index', index, Data)
                        if (index < 0) {
                            console.warn('setBranchId', branchId, valueBranch)
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
    const handleDropdown = (item, selectedDropdown) => {
        dropDownApiCall(loginToken, selectedDropdown, false, item.value)
    };
    const openMap = () => {
        navigation.navigate('Map', { originScreen: 'Appointment' })
    };
    return (
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
            <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
                <GestureHandlerRootView style={styles.container}>
                    <Header title={'Book Lab Appointment'} />
                    <ScrollView
                        scrollEnabled={
                            !openCity &&
                            !openVendor &&
                            !openBranch &&
                            !openPatient &&
                            !openVisit
                        }
                    >
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
                            <Text style={styles.subText}>LAB TEST NAMES</Text>
                            <TextInput
                                placeholder=""
                                placeholderTextColor="#637381"
                                style={styles.remarkTextInput}
                                multiline
                                maxLength={500}
                                value={testName}
                                onChangeText={(text) => {
                                    setTestName(text);
                                }}
                            />
                            {errors.testName && <Text style={styles.errorText}>{errors.testName}</Text>}
                        </View>

                        <View style={styles.mainView}>
                            <Text style={styles.subText}>VISIT</Text>
                            {isLoadDropDownVisit ? (
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
                                    open={openVisit}
                                    style={[
                                        styles.dropdownConatiner,
                                        {
                                            marginBottom: openVisit ? 110 : 0,
                                            height: 50,
                                            zIndex: 100, // Ensure dropdown appears above other content
                                        },
                                    ]}
                                    // style={[styles.dropdown]}
                                    ArrowDownIconComponent={({ style }) => (
                                        <Icon name={'angle-down'} color={'grey'} size={22} />
                                    )}
                                    ArrowUpIconComponent={({ style }) => (
                                        <Icon name={'angle-up'} color={'grey'} size={22} />
                                    )} placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    dropDownContainerStyle={styles.dropdownConatiner}
                                    value={valueVisit}
                                    items={visit.map((item) => ({
                                        label: item.value,
                                        value: item.id,
                                    }))}
                                    setOpen={() => handleOpenDropdown(setOpenVisit, openVisit)}
                                    setValue={(value) => {
                                        setValueVisitId(value);
                                        setVisitId(value); // Update VisitId when the value changes
                                    }}
                                    setItems={setVisit}
                                    onChangeItem={(item) => {
                                        setVisitId(item.value);
                                    }}
                                    onSelectItem={(item) => {
                                        handleDropdown(item, 'visit');
                                    }}
                                    placeholder={'Select Visit'}
                                />
                            )}

                            {errors.visit && <Text style={styles.errorText}>{errors.visit}</Text>}
                        </View>
                        {VisitId == 3 || VisitId == 4 ?
                            <>
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
                                </View>
                            </>
                            :
                            null
                        }
                        {VisitId == 4 ?
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
                            </View>
                            :
                            null
                        }
                        {VisitId == 3 || VisitId == 4 ?
                            <View style={styles.mainView}>
                                <Text style={styles.subText}>PREFERRED CALL TIME</Text>
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
                            :
                            null
                        }
                        {VisitId == 3 ?
                            <>
                                <View style={styles.mainView}>
                                    <Text style={styles.subText}>ADDRESS</Text>
                                    <TextInput
                                        placeholder=""
                                        placeholderTextColor="#637381"
                                        style={styles.remarkTextInput}
                                        multiline
                                        value={delievryAddress}
                                        maxLength={500}
                                        onChangeText={(text) => {
                                            setDelievryAddress(text);
                                        }}
                                    />
                                    {errors.delievryAddress && <Text style={styles.errorText}>{errors.delievryAddress}</Text>}
                                </View>
                                <TouchableOpacity style={styles.mainView} onPress={() => openMap()}>
                                    <Text style={styles.subText}>GOOGLE LOCATION</Text>
                                    <TextInput
                                        placeholder=""
                                        placeholderTextColor="#637381"
                                        style={styles.claimFormTextInput}
                                        value={address}
                                        multiline
                                        editable={false} // Disable the TextInput
                                        pointerEvents="none" // Ensure TextInput does not intercept touch events

                                    />
                                </TouchableOpacity>
                            </>
                            :
                            null
                        }
                        {/* <View> */}
                        <FlatList
                            data={attachmentsDetail.slice(0, 5)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View key={item.name}>
                                    {item.type === 'application/pdf' ? (
                                        <View style={{ padding: 15 }}>
                                            <Image source={pdf} style={{ width: 70, height: 70, alignSelf: 'center' }} />
                                            <Text style={{ textAlign: 'center', paddingTop: 8 }}>{item.name}</Text>
                                        </View>
                                    ) : item.type === 'image/jpeg' ? (
                                        <View style={{ padding: 20 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                <Image source={jpeg} style={{ width: 70, height: 70, alignSelf: 'center' }} />
                                                <TouchableOpacity onPress={() => removeFile(index)} style={{ marginTop: -3 }}>
                                                    <Icon color={'black'} name={'times'} size={25} />
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
                            )}
                        />
                        {imagesLoaded && // Display loader if images are not loaded
                            <ActivityIndicator size="large" color={"#1d4e77"} style={{ marginTop: 15, marginBottom: 15 }} />
                        }
                        {/* </View> */}
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
                    </ScrollView>
                </GestureHandlerRootView>
            </SafeAreaView >
        </TouchableWithoutFeedback>
    );
}
export default Appointment;
