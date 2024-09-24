import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback
} from "react-native";
import * as styles from "../../../assets/styles/styles";
import Header from "../../components/header/header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import { pdf, jpeg } from "../../../assets/images/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { toastMsg } from "../../components/toast";
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BASE_URL, APIURL } from "../../utility/networklayer/endPoints";
import TextinputComponent from "../../components/textinput/textinput";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';

const Order = ({ route }) => {
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
    const [openPatient, setOpenPatient] = useState(false);
    const [numAttachedFiles, setNumAttachedFiles] = useState(0);
    const [attachments, setAttachments] = useState([]);
    const [attachmentsDetail, setattachmentsDetail] = useState([]);
    const [valuePatient, setValuePatientId] = useState(null);
    const [imgLoader, setImgLoader] = useState(false);
    const [loginToken, setLoginToken] = useState("");
    const [beneficiaryDataUser, setBeneficiaryDataUser] = useState("");
    const [patientName, setPatientName] = useState([]);
    const [BeneficiaryId, setBeneficiaryId] = useState(null);
    const [contactNumber, setContactNumber] = useState(null);
    const [delievryAddress, setDelievryAddress] = useState("");
    const [onSubmitLoader, setSubmitLoader] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [btnDisable, setBtnDisable] = useState(false);
    const [medicineName, setMedicineName] = useState("");
    const [selectedValue, setSelectedValue] = useState(null);
    const [location, setLocation] = useState("");
    const [comment, setComment] = useState("");

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
    const [isLoadDropDownPlatform, setIsLoadDropDownPlatform] = useState(true); // Loading state
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
        AsyncStorage.getItem("logindetail").then((response) => {
            if (response != null) {
                let asynData = JSON.parse(response);
                let Data = asynData.Data;
                let BeneficiaryData = asynData.Data.Beneficiary[0];
                let phoneNumber = asynData.Data.Beneficiary[0].BeneficiaryMobileNumber;
                setContactNumber(phoneNumber)
                setLoginToken(Data.Token);
                setBeneficiaryDataUser(BeneficiaryData);
                getPatient(Data.Token);
                getPlatformList(Data.Token);
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
        if (patientName.length > 0) {
            const initialValue = patientName[0].BeneficiaryId;
            setSelectedValue(initialValue);
            setValuePatientId(initialValue); // Set the initial value for the API call
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
            // medicineName: null,
            delievryAddress: null,
            remarks: null,
            city: null
        });

        let hasErrors = false;
        console.warn('has', hasErrors)
        if (isFieldEmpty(valuePatient)) {
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
        // if (isFieldEmpty(medicineName)) {
        //     setErrors((prevErrors) => ({ ...prevErrors, medicineName: "Please enter medicine names" }));
        //     hasErrors = true;
        // }
        // if (isFieldEmpty(delievryAddress)) {
        //     setErrors((prevErrors) => ({ ...prevErrors, delievryAddress: "Please add address" }));
        //     hasErrors = true;
        // }
        if (isFieldEmpty(valueCity)) {
            setErrors((prevErrors) => ({ ...prevErrors, city: "Please select a city" }));
            hasErrors = true;
        }
        if (!hasErrors) {
            setBtnDisable(true); // Disable the button
            setSubmitLoader(true)
            setIsLoading(true);
            const formData = new FormData();
            formData.append(`Files`, attachments);
            formData.append('Token', loginToken);
            formData.append("ClaimTypeId", 2);
            formData.append("BenefitStructureId", 2);
            formData.append("BeneficiaryId", selectedValue);
            formData.append("PatientContactNumber", contactNumber);
            formData.append("MedicineNames", medicineName);
            formData.append("DeliveryAddress", delievryAddress);
            formData.append("CityId", CityId);
            formData.append('DoctorId', null);
            formData.append('SpecializationId', null);
            formData.append('VendorId', vendorId);
            formData.append('BranchId', branchId);
            formData.append('ConsultationPlatformId', null);
            formData.append('ConsultationTypeId', null);
            formData.append('LabPlatformId', null);
            formData.append('PharmacyPlatformId', platformId);
            formData.append('MapUrl', location);
            console.warn('formdata', formData)
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
                        setSubmitLoader(false)
                        setIsLoading(false);
                        toastMsg('Token expired. Please login again');
                        await AsyncStorage.removeItem('logindetail');
                        navigation.navigate('Login')
                    }
                    else {
                        navigation.navigate('Home')
                        setSubmitLoader(false)
                        setIsLoading(false);
                        toastMsg(data.msg_text);
                    }
                }
            } catch (error) {
                setSubmitLoader(false)
                setIsLoading(false);
                setBtnDisable(false); // Disable the button
            }
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
    }
    useEffect(() => {
        dropDownApiCall(dropdownState.Token, '', true);
    }, [dropdownState]);
    const dropDownApiCall = (token, selectedDropdown, isLoadAll, value) => {
        console.warn('token, selectedDropdown, isLoadAll, value', token, selectedDropdown, isLoadAll, value)
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
    const getPlatformList = (token) => {
        setIsLoadDropDownPlatform(true);
        let apiObj = {
            Token: token,
        };
        axios.post(BASE_URL + 'ClaimMobile/GetPharmacyPlatform', apiObj)
            .then(res => {
                let response = res.data;
                console.warn('response', response)
                if (response.status == 'OK') {
                    let Data = response.data;
                    if (Data != null && Data != undefined) {
                        let index = Data.findIndex(f => f.id == platformId);
                        console.warn('index', index, Data)
                        if (index < 0) {
                            console.warn('setBranchId', platformId, valuePlatform)
                            setPlatformId(null)
                            setValuePlatform(null)
                        }
                    }
                    setPlatform(Data);
                    setIsLoadDropDownPlatform(false)
                }
            })
            .catch(error => {
                setIsLoadDropDownPlatform(true);
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
    const getVendorList = (token) => {
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
    const getBranchList = (token) => {
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
        navigation.navigate('Map', { originScreen: 'Order' })
    };
    const handleOpenDropdown = (setOpenFn, isOpen) => {
        if (!isOpen) {
            setOpenPatient(false);
            setOpenCity(false);
            setOpenVendor(false);
            setOpenBranch(false);
            setOpenPlatform(false);
        }
        setOpenFn(!isOpen);
    };

    const closeAllDropdowns = () => {
        setOpenPatient(false);
        setOpenCity(false);
        setOpenVendor(false);
        setOpenBranch(false);
        setOpenPlatform(false);

    };
    return (
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>

            <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 20 : 0 }} >
                <GestureHandlerRootView style={styles.container}>
                    <Header title={"Order Medicine"} />
                    {/* <ScrollView> */}
                    <ScrollView scrollEnabled={!openCity && !openVendor && !openBranch && !openPlatform && !openPatient}>
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
                                        marginBottom: openPatient ? 150 : 10,
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
                            <TextinputComponent
                                maxLength={11}
                                value={contactNumber}
                                onChangeText={(text) => {
                                    setContactNumber(text);
                                }}
                            />
                            {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}
                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>MEDICINE NAMES</Text>
                            <TextInput
                                placeholder=""
                                placeholderTextColor="#637381"
                                style={styles.remarkTextInput}
                                multiline
                                maxLength={500}
                                value={medicineName}
                                onChangeText={(text) => {
                                    setMedicineName(text);
                                }}
                            />
                            {/* {errors.medicineName && <Text style={styles.errorText}>{errors.medicineName}</Text>} */}
                        </View>
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>DELIVERY PLATFORM</Text>
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
                                    height: 50,

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
                                    setValue={(value) => {
                                        setValuePlatform(value);
                                        setPlatformId(value); // Update VisitId when the value changes
                                    }}
                                    setItems={setPlatform}
                                    placeholder={'Please Select'}
                                    onChangeItem={(item) => {
                                        setPlatformId(item.value);
                                    }}
                                    onSelectItem={(item) => {
                                        handleDropdown(item, 'platform');
                                    }}
                                />
                            )}
                        </View>
                        {platformId == 5 || platformId == 6 ?
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
                                        height: 50,

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
                                        // dropDownDirection="BOTTOM" // Set the dropdown direction to TOP
                                    />
                                )}
                                {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                            </View>
                            :
                            null
                        }
                        {platformId == 6 ?
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
                                </View>
                                {/* {errors.delievryAddress && <Text style={styles.errorText}>{errors.delievryAddress}</Text>} */}
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
                        {platformId == 5 ?
                            <>
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
                                            height: 50,
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
                                            dropDownDirection="TOP" // Set the dropdown direction to TOP

                                        />
                                    )}
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
                                            height: 50,

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
                                                    zIndex: 1000
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
                            </>
                            :
                            null}
                        <View style={styles.mainView}>
                            <Text style={styles.subText}>COMMENT</Text>
                            <TextInput
                                placeholder=""
                                placeholderTextColor="#637381"
                                style={styles.remarkTextInput}
                                multiline
                                value={comment}
                                maxLength={500}
                                onChangeText={(text) => {
                                    setComment(text);
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
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};
export default Order;
