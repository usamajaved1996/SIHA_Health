import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import * as styles from "../../../assets/styles/styles"
import { ActivityIndicator, Colors } from 'react-native-paper';

export default class Loader extends Component {

    toggleOverlay = () => {
        this.setState({ visible: true });
    };
    render() {
        this.state = {
            visible: false,
        };
        return (
            <View style={styles.loadingLoadder}>
                <Overlay
                    isVisible={this.state._load}
                    onBackdropPress={this.toggleOverlay}
                    windowBackgroundColor={'white'}
                    overlayBackgroundColor={'white'}
                    width='auto'
                    height='auto'
                    overlayStyle={{ elevation: 0, shadowOpacity: 0 }}
                >
                    <ActivityIndicator size="large" animating={true} color={'#1d4e77'} />
                    <Text>Please wait...</Text>
                </Overlay>
            </View>
        );
    }
}