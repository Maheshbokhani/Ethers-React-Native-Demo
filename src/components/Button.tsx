import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

interface Props {
  title: string;
  isDisabled?: boolean;
  onClick: () => void;
  isLoading?: boolean;
  style?: any;
}

function Button({
  title,
  isDisabled = false,
  onClick,
  isLoading = false,
  style,
}: Props) {
  return (
    <TouchableOpacity
      disabled={isDisabled || isLoading}
      onPress={onClick}
      style={[styles.btn, isDisabled && styles.opacity, style]}>
      {isLoading ? (
        <ActivityIndicator size={'small'} color={'#fff'} />
      ) : (
        <Text style={styles.btnTxt}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: {
    borderRadius: 50,
    width: '80%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  btnTxt: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  opacity: {opacity: 0.2},
});
export default Button;
