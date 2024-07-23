import React, {useEffect, useMemo, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  View,
  Keyboard,
  Platform,
  Linking,
} from 'react-native';
import {utils} from 'ethers';

import useStore from '../../zustand/store';
import Button from '../Button';
import TextInput from '../TextInput';
import {convertGasCostToEth, formatBalance, isValidAddress} from '../../utils';

interface Props {
  visible: boolean;
  onClose: (status: boolean) => void;
  network: any;
}

const color = '#ffffff';

function SendTokenModal({visible, onClose, network}: Props) {
  const {signer, ethereumPrice, wallet, tokenBalance} = useStore(
    state => state,
  );

  const [amount, setAmount] = useState<any>(0);
  const [address, setAddress] = useState('');
  const [padding, setPadding] = useState(0);
  const [gasFee, setGasFee] = useState(0);
  const [gasFeeError, setGasFeeError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGasFeeError('');
    setGasFee(0);
  }, [address, amount]);

  const error = useMemo(() => {
    const isValidAmount =
      amount === 0 || amount === ''
        ? false
        : amount > 0
        ? amount < tokenBalance
        : false;
    const isValid = address === '' ? false : isValidAddress(address);

    if (isValidAmount && isValid) {
      return false;
    }
    return true;
  }, [address, amount, tokenBalance]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  const _keyboardDidShow = (e: {
    endCoordinates: {height: React.SetStateAction<number>};
  }) => {
    Platform.OS === 'ios' && setPadding(e.endCoordinates.height);
  };

  const _keyboardDidHide = () => {
    setPadding(0);
  };

  const estimateGasFee = async () => {
    setLoading(true);
    try {
      const estimatedGasUnits = await signer?.estimateGas({
        from: wallet?.address,
        to: address,
        value: utils.parseUnits(amount, 'ether'),
      });

      const gasPrice: any = await signer?.getGasPrice();
      const gasPriceInGwei = utils.formatUnits(gasPrice, 'gwei');

      const gasCostInEth: any = convertGasCostToEth(
        estimatedGasUnits ?? 0,
        gasPriceInGwei,
      );
      setGasFee(gasCostInEth);
      setLoading(false);
    } catch (e: any) {
      setGasFeeError(e.message);
      setLoading(false);
    }
  };

  const executeTransaction = async () => {
    setLoading(true);
    try {
      const tx = await signer?.sendTransaction({
        to: address,
        value: utils.parseUnits(amount, 'ether'),
      });
      console.log('Mining transaction...');

      await tx?.wait();

      Linking.openURL(network.explorerUrl + tx?.hash);

      setLoading(false);
    } catch (e: any) {
      setGasFeeError(e.message);
      setLoading(false);
    }
  };

  const fee = formatBalance(gasFee, ethereumPrice) || '';

  return (
    <Modal transparent visible={visible}>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.bckBtn}
          activeOpacity={0}
          onPress={() => onClose(false)}
        />

        <View style={[styles.container, {bottom: padding}]}>
          <Text style={styles.title}>Send {network?.name}</Text>
          <Text style={styles.title}>to</Text>

          <TextInput
            isNumberInput
            title={'Amount'}
            onChangeText={setAmount}
            value={amount}
            placeholder={'0.0'}
            maxValue={tokenBalance}
          />

          <TextInput
            title={'Address'}
            onChangeText={setAddress}
            value={address}
            placeholder={'0x...'}
          />

          <Text style={[styles.gasFee, !!gasFeeError && styles.redClr]}>
            {gasFeeError
              ? gasFeeError
              : `Gas Fee: ${Number(gasFee)?.toFixed(5)} ETH ` +
                (fee ? `(${fee})` : '')}
          </Text>

          <Button
            isLoading={loading}
            isDisabled={error}
            title={gasFee ? 'Send' : 'Estimate'}
            onClick={gasFee ? executeTransaction : estimateGasFee}
            style={styles.btn}
          />
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
    marginTop: '10%',
    marginBottom: '5%',
    width: '100%',
  },
  title: {fontSize: 20, color, fontWeight: 'bold', marginBottom: '7%'},
  gasFee: {fontSize: 14, color, fontWeight: 'bold', marginTop: '3%'},
  addressTxt: {fontSize: 14, color: color + 'DD', fontWeight: 'bold'},
  bckBtn: {flex: 1},
  redClr: {color: 'red'},
});
export default SendTokenModal;
