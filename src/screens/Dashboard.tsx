import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {utils} from 'ethers';

import Layout from '../components/Layout';
import Token from '../components/Token';
import History from '../components/History';
import AddressModal from '../components/Modal/AddressModal';
import RecieveModal from '../components/Modal/RecieveModal';
import SendTokenModal from '../components/Modal/SendTokenModal';

import apis from '../services/apis';
import {networkInfo, shortAddress} from '../utils';
import useStore from '../zustand/store';

const color = '#ffffff';

const Dashboard = () => {
  const [address, setAddress] = useState('');
  const [visibleAddressModal, setVisibleAddressModal] = useState(false);
  const [visibleRecieveModal, setVisibleRecieveModal] = useState(false);
  const [visibleSendModal, setVisibleSendModal] = useState(false);
  const [network, setNetwork] = useState<any>(null);
  const {
    tokenBalance: balance,
    ethereumPrice,
    setTokenBalance,
    signer,
    setEthereumPrice,
    setTxHistory,
  } = useStore(state => state);

  useEffect(() => {
    (async () => {
      const walletAddress: string | undefined = await signer?.getAddress();
      walletAddress && setAddress(walletAddress);

      const tokenBalance = await signer?.getBalance();
      if (tokenBalance) {
        const fiatBalance = utils.formatUnits(tokenBalance, 'ether');
        setTokenBalance(Number(fiatBalance));
      }

      const history = await apis.transactionHistory(walletAddress ?? '');
      setTxHistory(history);

      const price = await apis.fetchEthereumPrice();
      setEthereumPrice(price);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  useEffect(() => {
    (async () => {
      const chainId = await signer?.getChainId();
      const info = await networkInfo(chainId);
      setNetwork(info);
    })();
  }, [signer]);

  return (
    <Layout
      headerContent={
        <Text
          style={[styles.headerTitle, {color}]}
          onPress={() => setVisibleAddressModal(true)}>
          {shortAddress(address)} ▼
        </Text>
      }
      footerContent={
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => setVisibleSendModal(true)}>
            <Text style={styles.btnTxt}>↑ Send</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVisibleRecieveModal(true)}>
            <Text style={styles.btnTxt}>↓ Recieve</Text>
          </TouchableOpacity>
        </View>
      }>
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <Text style={styles.balanceTxt}>
            ${(balance * ethereumPrice).toFixed(4)}
          </Text>
          <Text style={{color: color + '99'}}>Total balance</Text>

          <Text style={styles.txt}>Tokens</Text>

          <Token
            title={network?.name ?? ''}
            chain={network?.chain}
            balance={balance}
          />

          <Text style={styles.txt}>Transactions</Text>
          <History explorerUrl={network?.explorerUrl} />
        </View>
        <AddressModal
          visible={visibleAddressModal}
          onClose={setVisibleAddressModal}
        />
        <SendTokenModal
          network={network}
          visible={visibleSendModal}
          onClose={setVisibleSendModal}
        />
        <RecieveModal
          visible={visibleRecieveModal}
          onClose={setVisibleRecieveModal}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backArrow: {
    fontSize: 28,
    position: 'absolute',
    left: '5%',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {alignItems: 'center', marginTop: '10%'},
  subContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
  },
  balanceTxt: {fontSize: 26, fontWeight: 'bold', color},
  txt: {color, fontSize: 22, fontWeight: 'bold', marginTop: '10%'},
  btnTxt: {
    fontSize: 16,
    color: color,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bottomContainer: {
    width: '60%',
    minHeight: 60,
    borderRadius: 8,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});

export default Dashboard;
