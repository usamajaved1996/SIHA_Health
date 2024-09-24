import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import * as style from "../../../assets/styles/styles";

const MapWithIcon = ({ navigation, route }) => {
    const originScreen = route.params?.originScreen;
    console.warn('origin', originScreen);

    const [address, setAddress] = useState(''); // Initialize with an empty address
    const [dataAddress, setDataAddress] = useState({}); // Initialize with an empty object
    const [markerPosition, setMarkerPosition] = useState({
        latitude: 24.854651, // Initial latitude
        longitude: 67.018049, // Initial longitude
    });

    useEffect(() => {
        // Initialize Geocoder with API key
        Geocoder.fallbackToGoogle('AIzaSyDvks2mcxQb-gukGtBQixkr3VY46s3uvVw');
        // Convert initial coordinates to address
        convertLatLngToAddress(markerPosition);
    }, []);

    const handleMarkerDragEnd = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarkerPosition({ latitude, longitude });
        let obj = {
            latitude: latitude,
            longitude: longitude
        }
        convertLatLngToAddress(obj); // Convert coordinates to address
    };

    const convertLatLngToAddress = async (obj) => {
        console.warn('obj convertLatLngToAddress', obj)
        // Position Geocoding
        let NY = {
            lat: obj.latitude,
            lng: obj.longitude
        };

        console.log(NY, 'our NY');
        Geocoder.geocodePosition(NY)
            .then((res) => {
                console.warn('res', res[0])
                let data = {
                    latitude: res[0].position.lat,
                    longitude: res[0].position.lng,
                    address: res[0].formattedAddress
                };
                setAddress(data.address); // Update the address state
                setDataAddress(data)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSubmit = () => {
        const { latitude, longitude } = markerPosition;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        // Navigate back to the origin screen and pass the address and Google Maps URL
        console.warn('googleMapsUrl')
        navigation.navigate(originScreen, { address, googleMapsUrl });
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: markerPosition.latitude != null ? markerPosition.latitude : 44.240304,
                    longitude: markerPosition.longitude != null ? markerPosition.longitude : -91.493768,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: markerPosition.latitude != null ? markerPosition.latitude : 44.240304,
                        longitude: markerPosition.longitude != null ? markerPosition.longitude : -91.493768,
                    }}
                    title="Drag Me"
                    description="This is a draggable marker"
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                />
            </MapView>

            <View style={styles.bottomContainer}>
                <Text style={styles.heading}>Pin Location</Text>
                <View style={styles.addressContainer}>
                    <TextInput
                        style={styles.addressTextInput}
                        value={address}
                        placeholder="Address"
                        multiline
                        onChangeText={(text) => setAddress(text)}
                    />
                </View>
                <TouchableOpacity onPress={handleSubmit}
                    style={{ backgroundColor: style.backgroundColors.yellow, width: '85%', borderRadius: 4, height: 55, marginTop: 25, alignSelf: 'center' }} >
                    <Text style={{ textAlign: 'center', padding: 16, color: 'white' }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 250, // Adjust the height as needed
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 6,
    },
    heading: {
        fontSize: 16,
        marginBottom: 20,
    },
    addressContainer: {
        width: '100%',
        height: 80,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#D7D7D7',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
    },
    addressTextInput: {
        fontSize: 16,
        color: '#333',
        width: '90%',
    },
    submitButton: {
        backgroundColor: 'red',
        width: '40%',
        borderRadius: 4,
        marginLeft: 30,
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default MapWithIcon;
