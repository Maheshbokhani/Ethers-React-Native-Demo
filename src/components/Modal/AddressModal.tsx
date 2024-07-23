import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Modal, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import storageServices from '../../services/storage';
import useStore from '../../zustand/store';

interface Props {
  visible: boolean;
  onClose: (status: boolean) => void;
}

const color = '#ffffff';

function AddressModal({visible, onClose}: Props) {
  const {navigate}: any = useNavigation();
  const {reset} = useStore(state => state);

  const onBackupBtn = () => {
    navigate('Backup');
    onClose(false);
  };

  const onLogOut = async () => {
    await storageServices.removeAll();
    await reset();
    navigate('FirstPage');
    onClose(false);
  };

  return (
    <Modal transparent visible={visible}>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.flex}
          activeOpacity={0}
          onPress={() => onClose(false)}
        />
        <View style={styles.container}>
          <TouchableOpacity style={styles.btn} onPress={onBackupBtn}>
            <Text style={styles.btnTxt}>Backup Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={onLogOut}>
            <Text style={[styles.btnTxt, styles.redColor]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  flex: {flex: 1},
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
  },
  btn: {
    marginTop: '5%',
  },
  btnTxt: {fontSize: 18, color, fontWeight: 'bold'},
  opacity: {opacity: 0.2},
  redColor: {color: 'red'},
});
export default AddressModal;
