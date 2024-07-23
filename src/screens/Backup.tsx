import React, {useEffect} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

import Layout from '../components/Layout';
import Button from '../components/Button';

import useStore from '../zustand/store';

const color = '#ffffff';

function Backup(): React.JSX.Element {
  const {goBack}: any = useNavigation();
  const {wallet} = useStore(state => state);

  useEffect(() => {
    if (wallet) {
      return;
    }
    goBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const {phrase}: any = wallet?.mnemonic;

  if (!phrase) {
    return <></>;
  }

  const mnemonicPhrases = phrase.split(' ');

  const handleCopy = async () => {
    await Clipboard.setString(phrase);
    Alert.alert('', 'Copied 12 phrases.');
    goBack();
  };

  return (
    <Layout
      headerContent={
        <>
          <Text style={[styles.backArrow, {color}]} onPress={goBack}>
            ←
          </Text>
          <Text style={[styles.headerTitle, {color}]}>Backup Wallet</Text>
        </>
      }
      footerContent={<Button title={'Copy'} onClick={handleCopy} />}>
      <View style={styles.mainContainer}>
        {mnemonicPhrases.map((word: any, index: number) => (
          <Text style={[styles.inputTitle]}>
            {index + 1 + '.  '}
            {word}
          </Text>
        ))}
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
  mainContainer: {margin: '10%'},
  inputTitle: {
    fontSize: 18,
    color,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
});

export default Backup;
