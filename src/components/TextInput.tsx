import React from 'react';
import {StyleSheet, Text, View, TextInput as RNTextInput} from 'react-native';
import {isValidAddress, normalizeValue} from '../utils';

type Props = {
  isNumberInput?: boolean;
  title: string;
  maxValue?: number;
  value: any;
  placeholder?: string;
  onChangeText: (value: any) => void;
};

const numberInProgressRegex = /^\d*\.?\d*$/;

function TextInput({
  isNumberInput,
  title,
  maxValue,
  value,
  onChangeText,
  placeholder,
  ...rest
}: Props) {
  const onChange = (text: any) => {
    if (isNumberInput) {
      const normalizedValue = normalizeValue(text);
      if (!numberInProgressRegex.test(normalizedValue)) {
        return;
      }
      onChangeText(normalizedValue);
    } else {
      onChangeText(text);
    }
  };

  const amountError =
    title === 'Amount' ? Number(value) > (maxValue ?? 0) : false;
  const addressError =
    title === 'Address' && value !== '' ? !isValidAddress(value) : false;

  return (
    <View style={[styles.inputContainer, addressError && styles.redBorder]}>
      {title && <Text style={styles.title}>{title}</Text>}

      <RNTextInput
        value={value}
        editable={!(maxValue === 0)}
        keyboardType={isNumberInput ? 'decimal-pad' : 'default'}
        onChangeText={onChange}
        style={styles.txtInput}
        placeholder={placeholder}
        placeholderTextColor={'#ffffff60'}
        {...rest}
      />

      {!!maxValue && (
        <Text style={[styles.maxValue, amountError && styles.redColor]}>
          Max {maxValue?.toFixed(5)}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    position: 'absolute',
    lineHeight: 20,
    backgroundColor: '#555',
    top: -10,
    left: '3%',
    paddingHorizontal: '2%',
  },
  inputContainer: {
    padding: '5%',
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#fff',
    marginTop: '7%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  maxValue: {fontSize: 12, fontWeight: 'bold', color: '#ffffff90'},
  txtInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffCB',
    flex: 1,
  },
  redBorder: {borderColor: 'red'},
  redColor: {color: 'red'},
});
export default TextInput;
