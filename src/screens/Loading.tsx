import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import Layout from '../components/Layout';
import Loader from '../components/Loader';

import ethersServices from '../services/ethers';
import useStore from '../zustand/store';

function Loading(): React.JSX.Element {
  const {reset}: any = useNavigation();
  const {setWallet, setSigner} = useStore(state => state);

  useEffect(() => {
    (async () => {
      const wallet = await ethersServices.decryptWallet();
      setWallet(wallet);

      if (wallet) {
        const {privateKey} = wallet;
        reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
        const signer = await ethersServices.init(privateKey);
        setSigner(signer);
        return;
      }

      reset({
        index: 0,
        routes: [{name: 'FirstPage'}],
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <View style={styles.loaderContainer}>
        <Loader isVisible />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    minHeight: '95%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loading;
