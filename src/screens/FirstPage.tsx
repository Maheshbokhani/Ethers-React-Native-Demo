import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import Button from '../components/Button';
import Layout from '../components/Layout';
import Loader from '../components/Loader';

import ethersServices from '../services/ethers';
import useStore from '../zustand/store';

function FirstPage(): React.JSX.Element {
  const {navigate, reset}: any = useNavigation();
  const {setWallet, setSigner} = useStore(state => state);

  const [loading, setLoading] = useState(false);

  const newWallet = async () => {
    setLoading(true);

    const wallet = await ethersServices.createWallet();
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
    <Layout>
      <View style={styles.mainContainer}>
        <Button title="Create new Wallet" onClick={newWallet} />

        <View style={styles.space} />

        <Button
          title="Import Wallet"
          onClick={() => navigate('ImportWallet')}
        />

        {loading && (
          <View style={styles.loaderContainer}>
            <Loader isVisible />
          </View>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    minHeight: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  space: {
    height: '5%',
  },
  loaderContainer: {
    top: 0,
    bottom: 0,
    backgroundColor: '#22222280',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FirstPage;
