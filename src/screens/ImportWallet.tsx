import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

import Layout from '../components/Layout';
import Button from '../components/Button';

import ethersServices from '../services/ethers';
import useStore from '../zustand/store';

const color = '#ffffff';

function ImportWallet(): React.JSX.Element {
  const {goBack, reset}: any = useNavigation();
  const [phrases, setPhrases] = useState('');
  const [invalidPhrasesError, setInvalidPhrasesError] = useState('');
  const [loading, setLoading] = useState(false);
  const {setWallet, setSigner} = useStore(state => state);

  const trimmedPhrase = phrases?.split(' ').filter(Boolean);
  const emptyInput = trimmedPhrase?.length === 0;
  const disabled = !(
    trimmedPhrase?.length === 0 || trimmedPhrase?.length === 12
  );

  const handlePaste = async () => {
    const value = await Clipboard.getString();

    const trimmedPhraseValue = value?.split(' ').filter(Boolean);

    if (trimmedPhraseValue?.length === 12) {
      setPhrases(value);
      return;
    }

    Alert.alert('Oops!', 'Not copied 12 phrases.');
  };

  const handleSubmit = async () => {
    setLoading(true);

    const trimmedPhrases = phrases.split(' ').filter(Boolean).join(' ');
    const wallet = await ethersServices.importWallet(trimmedPhrases);
    setWallet(wallet);
    if (wallet) {
      const {privateKey} = wallet;
      const signer = await ethersServices.init(privateKey);
      setSigner(signer);
      if (signer) {
        reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
      }
    }

    setLoading(false);
  };

  return (
    <Layout
      headerContent={
        <>
          <Text style={[styles.backArrow, {color}]} onPress={goBack}>
            ←
          </Text>
          <Text style={[styles.headerTitle, {color}]}>Import Wallet</Text>
        </>
      }
      footerContent={
        <Button
          title={emptyInput ? 'Paste' : 'Import'}
          isDisabled={disabled}
          isLoading={loading}
          onClick={async () => {
            if (emptyInput) {
              await handlePaste();
              return;
            }
            handleSubmit();
          }}
        />
      }>
      <View style={styles.mainContainer}>
        <Text style={[styles.inputTitle, {color: color + '99'}]}>
          {'Enter your 12 phrases'}
        </Text>

        <TextInput
          value={phrases}
          onChangeText={value => {
            setInvalidPhrasesError('');
            setPhrases(value);
          }}
          style={[
            styles.txtInput,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              color: invalidPhrasesError ? 'red' : color,
            },
          ]}
          multiline={true}
          numberOfLines={5}
        />
        <Text style={styles.txtErr}>{invalidPhrasesError}</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    fontSize: 28,
    position: 'absolute',
    left: '5%',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {alignItems: 'center', marginTop: '20%'},
  bottomContainer: {
    alignItems: 'center',
    marginBottom: '3%',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtInput: {
    borderWidth: 1.3,
    borderRadius: 6,
    borderColor: '#ffffff90',
    width: '90%',
    minHeight: 120,
    padding: '5%',
    marginTop: '2%',
    textAlignVertical: 'top',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  normalTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: '5%',
  },
  txtErr: {
    fontSize: 13,
    color: 'red',
    marginTop: '1%',
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
});

export default ImportWallet;
