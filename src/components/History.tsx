import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
} from 'react-native';

import {shortAddress} from '../utils';
import useStore from '../zustand/store';
import {utils} from 'ethers';

interface Props {
  item: ItemProp;
  index: number;
  explorerUrl: any;
}

type ItemProp = {
  hash: string;
  from: string;
  to: string;
  value: string;
};

const color = '#ffffff';

function HistoryItem({item, index, explorerUrl}: Props) {
  const {hash, from, to, value} = item;
  const {wallet, ethereumPrice} = useStore(state => state);
  const address = wallet?.address;
  const amount = utils.formatUnits(value, 'ether') ?? 0;

  const openExplorer = async () => {
    if (await Linking.canOpenURL(explorerUrl + hash)) {
      await Linking.openURL(explorerUrl + hash);
    }
  };

  return (
    <TouchableOpacity
      key={index.toString()}
      style={styles.mainContainer}
      onPress={openExplorer}>
      <View style={styles.img}>
        <Text style={styles.arrow}>
          {address?.toLowerCase() === from ? '↑' : '↓'}
        </Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>From {shortAddress(from)}</Text>
        <Text style={styles.subTxt}>To {shortAddress(to)}</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.title}>{Number(amount).toFixed(5)} ETH</Text>
        <Text style={styles.subTxt}>
          ${(Number(amount) * ethereumPrice).toFixed(4)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const History = ({explorerUrl}: any) => {
  const {txHistory} = useStore(state => state);

  return (
    <FlatList
      data={txHistory}
      renderItem={props => <HistoryItem {...props} explorerUrl={explorerUrl} />}
      // eslint-disable-next-line react/no-unstable-nested-components
      ListEmptyComponent={() => <Text style={styles.emptyTxt}>Not found</Text>}
      contentContainerStyle={styles.listContent}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {marginBottom: '10%'},
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {flex: 1, marginLeft: '5%'},
  arrow: {
    fontSize: 24,
    color,
    fontWeight: 'bold',
  },
  title: {
    color,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTxt: {
    color: color + '99',
    fontSize: 14,
    marginTop: '2%',
  },
  emptyTxt: {
    alignSelf: 'center',
    fontSize: 16,
    color: color + '99',
    fontWeight: 'bold',
    marginTop: '5%',
  },
  balanceContainer: {alignItems: 'flex-end'},
});
export default History;
