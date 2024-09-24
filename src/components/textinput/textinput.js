
import { TextInput } from 'react-native';
import * as styles from "../../../assets/styles/styles";
const Textinput = ({ value, onChangeText, maxLength, placeholder }) => {
    const handleTextChange = (text) => {
        // Remove any non-numeric characters using a regular expression
        const numericValue = text.replace(/[^0-9]/g, '');
        onChangeText('');
        onChangeText(numericValue);
    };

    return (
        <TextInput
            placeholder={placeholder} // Add the placeholder prop here
            maxLength={maxLength}
            placeholderTextColor={'#637381'}
            onChangeText={handleTextChange}
            value={value}
            style={styles.claimFormTextInput}
            keyboardType="phone-pad" // Use keyboardType="phone-pad"
        />
    );
};
export default Textinput;