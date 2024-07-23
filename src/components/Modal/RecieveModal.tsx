import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  View,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';

import useStore from '../../zustand/store';
import Button from '../Button';
import {shortAddress} from '../../utils';

interface Props {
  visible: boolean;
  onClose: (status: boolean) => void;
}

const color = '#ffffff';

function RecieveModal({visible, onClose}: Props) {
  const {wallet} = useStore(state => state);

  const onCopyBtn = async () => {
    await Clipboard.setString(wallet?.address ?? '');
    Alert.alert('', 'Copied wallet address.');
    onClose(false);
  };

  return (
    <Modal transparent visible={visible}>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.bckBtn}
          activeOpacity={0}
          onPress={() => onClose(false)}
        />

        <View style={styles.container}>
          <Text style={styles.title}>Recieve</Text>

          <View style={styles.addressContainer}>
            <Text style={styles.addressTxt}>
              {shortAddress(wallet?.address ?? '', 12)}
            </Text>
          </View>

          <Button title={'Copy'} onClick={onCopyBtn} style={styles.btn} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    minHeight: 150,
    backgroundColor: '#555',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: '5%',
    alignItems: 'center',
  },
  btn: {
    borderWidth: 0,
  },
  title: {fontSize: 20, color, fontWeight: 'bold'},
  addressContainer: {
    padding: '4.5%',
    borderWidth: 1.5,
    borderRadius: 8,
    borderColor: color + '80',
    marginVertical: '8%',
  },
  addressTxt: {fontSize: 16, color: color + 'DD', fontWeight: 'bold'},
  bckBtn: {flex: 1},
});
export default RecieveModal;
