import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, Platform, Image } from 'react-native';
import { fbicon } from "../../../assets/images/index"
var buttonWidth;
class RoundedButton extends Component {
	render() {
		const { text, onPress, buttonContainerStyle, buttonTextStyle } = this.props;
		return (
			<TouchableOpacity
				style={[buttonContainerStyle, styles.buttonStyle]}
				onPress={() => onPress()}
				disabled={this.props.isDisable}
			>
				{this.props.isFacebook &&
					<Image source={fbicon} style={{ width: 20, height: 20, backgroundColor: "transparent", position: "absolute", resizeMode: "contain", left: "5%" }} />}

				<Text style={buttonTextStyle}>{text}</Text>
			</TouchableOpacity>
		);
	}
}

RoundedButton.propTypes = {
	text: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	buttonContainerStyle: PropTypes.array,
	buttonTextStyle: PropTypes.object
};

const styles = StyleSheet.create({
	buttonStyle: {
		borderRadius:5
	}
});

export default RoundedButton;