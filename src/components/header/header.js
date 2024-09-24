import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as styles from "../../../assets/styles/styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={{ backgroundColor: styles.backgroundColors.blue, padding: 15, paddingTop: 15, flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons color={'white'} name={"arrow-back-outline"} size={22} />
      </TouchableOpacity>
      <Text style={[styles.font.bold, { color: 'white', fontSize: 18, paddingLeft: 20 }]}>{title}</Text>
    </View>
  );
};

export default Header;
